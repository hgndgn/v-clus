import { AwsSecurityGroup, AwsSubnet, AwsVpc, ClientError, KeyPair } from '@app/models';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { StringSet, VClusInstance, VClusSubnet, VClusVpc } from '@models/vclus';

import { AwsInstanceTypes } from '@assets/AwsInstanceTypes';
import { ToastrService } from 'ngx-toastr';
import { VClusService } from '../../services/vclus.service';
import { VpcService } from '@core/services';
import { VpcWithSubnets } from '@models/helper_models';
import { isValidCidrBlock } from '../../app.utils';

class VpcQuickViewData {
  vpc: VClusVpc;
  isValidCidr: boolean = false;
  vpcId: string;
  vpcName: string;
  vpcCidrIp: string;
  vpcCidrSize: string;
  initialCidr: string;
  show: boolean = false;
}

export class SubnetModalData {
  subnet: VClusSubnet;
}

export class InstanceModalData {
  instance: VClusInstance;
  securityGroups?: AwsSecurityGroup[];
}

@Component({
  selector: 'vclus-vpc',
  templateUrl: './vclus-vpc.component.html',
  styleUrls: ['./vclus-vpc.component.scss']
})
export class VClusVpcComponent implements OnInit {
  @Input() vpc: VClusVpc;
  @Input() keyPairs?: KeyPair[];
  @Input() securityGroups: AwsSecurityGroup[];
  @Input() isAwsVpc?: boolean;

  @Output('onDelete') deleteEmit = new EventEmitter<string>();
  @Output('openVpcModal') openVpcModalEmit = new EventEmitter<VpcQuickViewData>();

  showVpcModal = false;
  showSubnetModal = false;
  showInstanceModal = false;
  vpcQuickViewData: VpcQuickViewData = new VpcQuickViewData();
  subnetModalData: SubnetModalData = new SubnetModalData();
  instanceModalData: InstanceModalData = new InstanceModalData();

  showEc2Modal: boolean = false;
  showSubnetCreateModal: boolean = false;

  allVpcs: AwsVpc[];
  allSubnets: AwsSubnet[];
  allVpcsWithSubnets: VpcWithSubnets[] = [];

  modalData: any = {};

  readonly ec2Infos: any[] = AwsInstanceTypes as any[];
  readonly vpcSet: StringSet = new StringSet();

  readonly vpcService: VpcService;
  readonly toast: ToastrService;
  readonly vclusService: VClusService;

  constructor(i: Injector) {
    this.vpcService = i.get(VpcService);
    this.toast = i.get(ToastrService);
    this.vclusService = i.get(VClusService);
  }

  async ngOnInit() {
    await this.getAllVpcs();
  }

  async getAllVpcs() {
    const res = await this.vpcService.fetchAllSync();

    if (res instanceof ClientError) {
      return [];
    } else {
      this.allVpcs = res as AwsVpc[];
    }
  }

  addNewSubnet() {
    this.vclusService.addNewSubnet(this.vpc.id);
  }

  addNewInstance(toAdd: VClusSubnet) {
    this.vclusService.addNewInstance(this.vpc.id, toAdd);
  }

  openInstanceModal(instance: VClusInstance) {
    this.instanceModalData.instance = instance;
    this.showInstanceModal = true;
  }

  openSubnetModal(subnet: VClusSubnet) {
    this.subnetModalData.subnet = subnet;
    this.showSubnetModal = true;
  }

  toggle = false

  openVpcModal() {
    this.vpcQuickViewData.show = false;
    this.toggle = false;

    if (this.vpc.hasValidCidr) {
      const [ip, size] = this.vpc.cidr.split('/');
      this.vpcQuickViewData.vpcCidrIp = ip;
      this.vpcQuickViewData.vpcCidrSize = size;
      this.vpcQuickViewData.isValidCidr = true;
      this.vpcQuickViewData.initialCidr = this.vpc.cidr;

    } else {
      this.vpcQuickViewData.vpcCidrIp = '10.0.0.0';
      this.vpcQuickViewData.vpcCidrSize = this.vpc.vpcCidrSizes[0];
    }

    this.vpcQuickViewData.vpcName = this.vpc.name;
    this.vpcQuickViewData.vpcId = this.vpc.id;
    this.vpcQuickViewData.vpc = this.vpc;

    // this.showVpcModal = true;
    this.vpcQuickViewData.show = true;
    this.toggle = true;
    this.openVpcModalEmit.emit(this.vpcQuickViewData);
  }

  onInstanceModalClosed(result?: { updated: VClusInstance, old: VClusInstance }) {
    if (result) {
      const subnet = this.vclusService.getSubnet(result.updated.vpcId, result.updated.subnetId);
      this.vclusService.updateSubnet(subnet.vpcId, subnet);
      this.vclusService.updateInstance(result.updated);
    }

    this.showInstanceModal = false;
  }

  onSubnetModalClosed(subnet?: VClusSubnet) {
    if (subnet) {
      const modalSubnetId = this.subnetModalData.subnet.id;
      const modalVpcId = this.subnetModalData.subnet.vpcId;
      // update subnet names in inbound rules
      this.vclusService.vpcs.value.forEach(vpc => {
        vpc.subnets.forEach(s => {
          s.instances.forEach(instance => {
            instance.interconnections.inboundRules.forEach(ir => {
              const condition = (ir.sourceVpcId == modalVpcId && ir.sourceSubnetId == modalSubnetId);
              if (condition) {
                ir.sourceSubnetName = subnet.name;
                this.vclusService.updateInstance(instance);
              }
            })
          })
        })
      })
      this.vclusService.updateSubnet(this.vpc.id, subnet);
    }

    this.showSubnetModal = false;
  }

  onVpcModalClosed() {
    // update vpc names in inbound rules
    this.vclusService.vpcs.value.forEach(vpc => {
      vpc.subnets.forEach(subnet => {
        subnet.instances.forEach(instance => {
          instance.interconnections.inboundRules.forEach(ir => {
            if (ir.sourceVpcId == this.vpcQuickViewData.vpcId) {
              const vpc = this.vclusService.getVpc(ir.sourceVpcId);
              vpc.name = this.vpcQuickViewData.vpcName;
              ir.sourceVpcName = vpc.name;
              this.vclusService.updateVpc(vpc);
            }
          })
        })
      })
    })

    this.vpc.name = this.vpcQuickViewData.vpcName;
    this.vpc.hasValidCidr = true;

    const [oldIp, oldSize] = this.vpc.cidr.split('/');
    const newIp = this.vpcQuickViewData.vpcCidrIp;
    const newSize = this.vpcQuickViewData.vpcCidrSize;
    const cidrChanged = oldIp != newIp || oldSize != newSize;

    if (cidrChanged) {
      this.vpc.cidr = this.vpcQuickViewData.vpcCidrIp + '/' + this.vpcQuickViewData.vpcCidrSize;
      this.vpc.updateCidrsOfCurrentSubnets();
    }

    this.vclusService.updateVpc(this.vpc);

    if (this.vpc.subnets.length > 0 && cidrChanged) {
      this.toast.success('Subnet CIDRs updated', this.vpc.name);
    }

    this.showVpcModal = false;
    this.vpcQuickViewData.show = false;
  }

  removeInstance(subnetId: string, instance: VClusInstance) {
    this.vclusService.removeInstance(this.vpc.id, subnetId, instance);
  }

  removeSubnet(subnet: VClusSubnet) {
    this.vclusService.removeSubnet(this.vpc.id, subnet);
  }

  removeVpc() {
    this.deleteEmit.emit(this.vpc.id);
  }

  setNewVpcCidrSize(cidrSize: string) {
    this.vpcQuickViewData.vpcCidrSize = cidrSize;
    this.checkCidr();
  }

  checkCidr() {
    const cidr = this.vpcQuickViewData.vpcCidrIp + '/' + this.vpcQuickViewData.vpcCidrSize;
    const isValid = isValidCidrBlock(cidr);

    if (!!isValid) {
      this.vpcQuickViewData.isValidCidr = true;
    }
  }
}
