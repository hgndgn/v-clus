import {
  AwsVpc,
  ClientError,
  KeyPair,
  VClusVpc,
  VCluster
} from '@app/models';
import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Ec2Service, VpcService } from '@core/services';
import { cloneDeep, difference } from 'lodash';
import { isClientError, isValidCidrBlock } from '../../app.utils';

import { AwsSecurityGroup } from '@models/aws';
import { ClusterService } from '~/src/app/core/services/cluster.service';
import { KeyPairOption } from '@models/KeyPair';
import { REQUEST_TIMEOUT } from '@constants/.ts';
import { SecurityGroupService } from '@core/services/security-group.service';
import { ToastrService } from 'ngx-toastr';
import { VClusService } from '../../services/vclus.service';
import { take } from 'rxjs/operators';
import { untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'create-cluster',
  templateUrl: './create-cluster.component.html',
  styleUrls: ['./create-cluster.component.scss'],
})
export class CreateClusterComponent implements OnInit {
  @Input('clusters') clusters: VCluster[];
  @Output('onSuccess') onSuccessEmitter = new EventEmitter();

  vpcs: AwsVpc[];
  hasVpcs: boolean;
  hasError: boolean;
  isLoading: boolean;
  showCreateEc2Component: boolean;
  loadingText: string;

  clusterCounter = 1;
  clusterName: string = '';
  clusterDescription: string = '';
  saveCluster: boolean = false;
  hasRequiredError: boolean = false;
  clusterNames: string[] = [];

  showImageIdErrors: boolean = false;
  imageIdErrors: any = {};
  vclusVpcs: VClusVpc[] = [];
  allSecurityGroups: AwsSecurityGroup[] = [];
  keyPairs: KeyPair[] = [];
  currentCluster: VClusVpc;
  selectedExistingVpc: AwsVpc;
  creatingCluster: boolean;
  toggleLoadCluster: boolean = false;

  readonly vpcService: VpcService;
  readonly toastService: ToastrService;
  readonly ec2Service: Ec2Service;
  readonly sgService: SecurityGroupService;
  readonly vclusService: VClusService;
  readonly clusterService: ClusterService;

  constructor(i: Injector) {
    this.vpcService = i.get(VpcService);
    this.toastService = i.get(ToastrService);
    this.ec2Service = i.get(Ec2Service);
    this.sgService = i.get(SecurityGroupService);
    this.vclusService = i.get(VClusService);
    this.clusterService = i.get(ClusterService);

    window.addEventListener('click', (e) => {
      const path = e['path'];
      const buttonElements = path.filter((p) => p instanceof HTMLButtonElement);

      if (
        buttonElements.length == 0 ||
        buttonElements[0]['id'] != 'load-cluster-btn'
      ) {
        this.toggleLoadCluster = false;
        return;
      }
    });
  }

  ngOnDestroy() {}

  async ngOnInit() {
    this.vclusService.vpcs.next([]);

    this.vclusService.vpcs
      .pipe(untilDestroyed(this, 'ngOnDestroy'))
      .subscribe((vpcs) => {
        this.vclusVpcs = vpcs;
      });

    this.clusterNames = this.clusters.map(({ name }) => name);
    this.showCreateEc2Component = false;
    this.hasError = false;
    this.isLoading = true;
    this.hasVpcs = true;

    let res: any = await this.vpcService.fetchAllSync();

    if (res instanceof ClientError) {
      this.toastService.error(res.message, res.title);
      this.hasVpcs = false;
      this.isLoading = false;
      this.hasError = true;
    } else {
      this.vpcs = res;
      if (this.vpcs.length > 0) {
        this.selectedExistingVpc = this.vpcs[0];
      }
      this.isLoading = false;
    }

    this.keyPairs = await this.ec2Service.getKeyPairs().toPromise();
    res = await this.sgService.fetchAll().toPromise();
    if (res instanceof ClientError) {
      this.hasVpcs = false;
      this.hasError = true;
    } else {
      this.allSecurityGroups = res as AwsSecurityGroup[];
      this.isLoading = false;
    }

    setTimeout(() => {
      if (this.isLoading) {
        this.hasError = true;
        this.isLoading = false;
      }
    }, REQUEST_TIMEOUT);
  }

  addEmptyVpc() {
    let vpc = new VClusVpc((this.clusterCounter++).toString(), 'VPC');
    vpc = this.vclusService.addNewVpc(vpc);
    this.vclusService.addNewSubnet(vpc.id);
    return vpc;
  }

  canSubmit() {
    const c1 = this.vclusVpcs.every((vpc) => vpc.subnets.length > 0);
    return c1;
  }

  getKeysRecursive(obj: any) {
    const recursiveKeys = (obj, results = new Set<string>([])) => {
      const r = results;
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (!Array.isArray(obj)) {
          r.add(key);
        }
        if (typeof value == 'object') {
          recursiveKeys(value, r);
        }
      });
      return r;
    };

    return recursiveKeys(obj);
  }

  importCluster(event) {
    if (event.target.files.length !== 1) {
      console.error('No file selected');
    } else {
      if (event.target.files[0].type != 'application/json') {
        this.toastService.error(
          'Only application/json file types can be imported!',
        );
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const json = reader.result.toString();
        const vpcs = JSON.parse(json);
        if (Array.isArray(vpcs)) {
          const keysOfImportedJson = [...this.getKeysRecursive(vpcs).values()];
          const keysOfVclusVpc = [
            ...this.getKeysRecursive(VClusVpc.getEmptyVpc()).values(),
          ];
          const diff = difference(keysOfImportedJson, keysOfVclusVpc);
          if (diff.length > 0) {
            this.toastService.error('Invlid JSON imported');
          } else {
            this.loadVpcsOfCluster(vpcs);
          }
        } else {
          this.toastService.error('Invlid JSON imported');
        }
      };
      reader.readAsText(event.target.files[0]);
    }
  }

  loadVpcsOfCluster(vclusVpcs: VClusVpc[]) {
    this.vclusService.vpcs.next([]);

    let lastClusterId = 1;

    vclusVpcs.forEach((v) => {
      let vpc = new VClusVpc(v.id, v.name);
      vpc.name = v.name;
      vpc.cidr = v.cidr;
      vpc = this.vclusService.addNewVpc(vpc);
      lastClusterId = +v.id;

      v.subnets.forEach((s) => {
        let subnet = this.vclusService.addNewSubnet(vpc.id);

        s.instances.forEach((i) => {
          let instance = this.vclusService.addNewInstance(subnet.vpcId, subnet);
          Object.assign(instance, i);
          if (instance.keyPairOption != KeyPairOption.DEFAULT) {
            const keynameInKeypairs = this.keyPairs.find(
              (kp) => kp.KeyName == instance.keyname,
            );
            if (!keynameInKeypairs) {
              instance.keyPairOption = KeyPairOption.DEFAULT;
              instance.keyname = KeyPairOption.DEFAULT;
            }
          }
        });
        subnet.cidr = s.cidr;
        subnet.cidrIp = s.cidrIp;
        subnet.cidrSize = s.cidrSize;
        subnet.uniqueId = s.uniqueId;
        subnet.id = s.id;
        subnet.vpcId = s.vpcId;
        subnet.name = s.name;
        subnet.vpcCidr = s.vpcCidr;
        subnet.acceptedSubnetCidrs = s.acceptedSubnetCidrs;
      });
    });

    this.clusterCounter = lastClusterId + 1;
  }

  loadClusterByName(clusterName: string) {
    if (!clusterName) return;

    if (
      !confirm(
        `Loading of cluster ${clusterName} will be discard current resources. Are you sure?`,
      )
    ) {
      return;
    }

    const cluster = this.clusters.find((n) => n.name == clusterName);
    this.loadVpcsOfCluster(cluster.vclusVpcs);
  }

  onDeleteCluster(vpcId: string) {
    this.vclusService.removeVpc(vpcId);
  }

  getVpcKeysOfImageIdErrors() {
    return Object.keys(this.imageIdErrors);
  }

  getSubnetKeysOfImageIdErrors(vpcKey: string) {
    return Object.keys(this.imageIdErrors[vpcKey]);
  }

  hasErrors() {
    this.imageIdErrors = this.vclusService.getInstanceImageIdErrors(
      this.vclusService.vpcs.value,
    );

    if (Object.keys(this.imageIdErrors).length > 0) {
      this.showImageIdErrors = true;
      return true;
    }

    if (!this.canSubmit()) {
      this.toastService.error('VPCs must contain at least one subnet');
      return true;
    }
  }

  onSubmit() {
    if (this.hasErrors()) return;

    let clonedVpcs = cloneDeep(this.vclusVpcs);
    clonedVpcs.forEach((vpc) => VClusVpc.prepareForSubmit(vpc));
    clonedVpcs = clonedVpcs.filter((v) => v.subnets.length > 0);

    const requestObject = {
      cluster: clonedVpcs,
      clusterName: this.clusterName.trim(),
      clusterDescription: this.clusterDescription.trim(),
      saveCluster: !!this.clusterName.trim(),
    };

    this.loadingText =
      'Creating cluster. This process can take a while, please wait.';
    this.creatingCluster = true;

    this.clusterService
      .createCluster(requestObject)
      .pipe(take(1))
      .subscribe((res) => {
        if (isClientError(res)) {
          this.toastService.error(res.message, res.title);
          this.loadingText = '';
          this.creatingCluster = false;
          this.isLoading = false;
        } else {
          this.toastService.success('Virtual cluster has been created');
          this.creatingCluster = false;
          this.onSuccessEmitter.emit();
          this.ngOnInit();
        }
      });
  }

  getSecurityGroupsOfVpc(vpcId: string) {
    return this.allSecurityGroups.filter((sg) => sg.vpcId != vpcId);
  }

  vpcQuickViewData: VpcQuickViewData = new VpcQuickViewData();

  hasValidCidr() {
    const cidr =
      this.vpcQuickViewData.vpcCidrIp + '/' + this.vpcQuickViewData.vpcCidrSize;
    return isValidCidrBlock(cidr);
  }

  onVpcModalClosed() {
    // update vpc names in inbound rules
    this.vclusService.vpcs.value.forEach((vpc) => {
      vpc.subnets.forEach((subnet) => {
        subnet.instances.forEach((instance) => {
          instance.interconnections.inboundRules.forEach((ir) => {
            if (ir.sourceVpcId == this.vpcQuickViewData.vpcId) {
              const vpc = this.vclusService.getVpc(ir.sourceVpcId);
              vpc.name = this.vpcQuickViewData.vpcName;
              ir.sourceVpcName = vpc.name;
              this.vclusService.updateVpc(vpc);
            }
          });
        });
      });
    });

    this.vpcQuickViewData.vpc.name = this.vpcQuickViewData.vpcName;
    this.vpcQuickViewData.vpc.hasValidCidr = true;

    const [oldIp, oldSize] = this.vpcQuickViewData.vpc.cidr.split('/');
    const newIp = this.vpcQuickViewData.vpcCidrIp;
    const newSize = this.vpcQuickViewData.vpcCidrSize;
    const cidrChanged = oldIp != newIp || oldSize != newSize;

    if (cidrChanged) {
      this.vpcQuickViewData.vpc.cidr =
        this.vpcQuickViewData.vpcCidrIp +
        '/' +
        this.vpcQuickViewData.vpcCidrSize;
      this.vpcQuickViewData.vpc.updateCidrsOfCurrentSubnets();
    }

    this.vclusService.updateVpc(this.vpcQuickViewData.vpc);

    if (this.vpcQuickViewData.vpc.subnets.length > 0 && cidrChanged) {
      this.toastService.success(
        'Subnet CIDRs updated',
        this.vpcQuickViewData.vpc.name,
      );
    }

    this.vpcQuickViewData.show = false;
  }

  openVpcModal(vpc: VpcQuickViewData) {
    this.vpcQuickViewData = vpc;
  }
}

class VpcQuickViewData {
  vpc: VClusVpc;
  isValidCidr: boolean = false;
  vpcId: string = '';
  vpcName: string = '';
  vpcCidrIp: string = '';
  vpcCidrSize: string = '';
  initialCidr: string = '';
  show: boolean = false;
}
