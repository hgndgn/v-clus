import { AwsSubnet, AwsVpc } from '@models/aws';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VClusSubnet, VClusVpc } from '@models/vclus';

import { ToastrService } from 'ngx-toastr';
import { VClusService } from '../../services/vclus.service';
import { cloneDeep } from 'lodash';
import { closeOnEscapeClicked } from '@app/app.utils';

@Component({
  selector: 'vclus-subnet-modal',
  templateUrl: './vclus-subnet-modal.component.html',
  styleUrls: ['./vclus-subnet-modal.component.scss']
})
export class VclusSubnetModalComponent implements OnInit {

  @Input('vpc') inputVpc: VClusVpc;
  @Input('subnet') inputSubnet: VClusSubnet;

  @Input() allVpcs: AwsVpc[] = [];

  @Output('onClose') onCloseEmit = new EventEmitter<VClusSubnet | AwsSubnet>();

  vclusSubnet: VClusSubnet;
  subnetToAccept: VClusSubnet;

  awsSubnet: AwsSubnet = new AwsSubnet();
  selectedVclusVpc: VClusVpc;
  selectedAwsVpc: AwsVpc;

  toggleQuickView: boolean = false;

  constructor(public vclusService: VClusService, private toast: ToastrService) {
    closeOnEscapeClicked(window, this.onCloseEmit);
  }

  ngOnInit() {
    this.awsSubnet.name = "";
    const allSubnets = [];
    this.vclusService.vpcs.value.forEach(vpc => {
      allSubnets.push(...vpc.subnets);
    })

    this.vclusSubnet = cloneDeep(this.inputSubnet);
    this.subnetToAccept = new VClusSubnet(this.inputSubnet.id, this.inputVpc.cidr, this.inputVpc.cidr);
    this.toggleQuickView = true;
  }

  acceptCidr() {
    var added = this.vclusSubnet.acceptSubnetCidr(this.subnetToAccept.getCidr());
    if (!added) {
      this.toast.info(this.subnetToAccept.getCidr(), 'CIDR already accepted');
    }
  }

  setSubnet(commaSeparatedValue: string) {
    const [vpcId, subnetUniqueId] = commaSeparatedValue.split(",");
    const subnet = this.vclusService.getSubnet(vpcId, subnetUniqueId);
    this.subnetToAccept = cloneDeep(subnet);
  }

  setSelectedVpc(id: string) {
    this.selectedAwsVpc = this.allVpcs.find(vpc => vpc.id == id);
    this.selectedVclusVpc = new VClusVpc(this.selectedAwsVpc.id, this.selectedAwsVpc.name, true);
    this.selectedVclusVpc.cidr = this.selectedAwsVpc.ipv4Cidr[0];
    this.awsSubnet.vpcId = this.selectedAwsVpc.id;
  }

  setSelectedVpcCidr(cidr: string) {
    this.selectedVclusVpc.cidr = cidr;
    this.awsSubnet.ipv4Cidr = cidr;
  }

  onClose(cancelled: boolean = false) {
    if (cancelled) {
      this.onCloseEmit.emit();
      return;
    }

    this.onCloseEmit.emit(this.vclusSubnet);
  }
}
