import { AwsSubnet, AwsSubnetCustom, AwsVpc } from '@models/aws';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VClusSubnet, VClusVpc } from '@models/vclus';

import { VClusService } from '../../services/vclus.service';
import { closeOnEscapeClicked } from '@app/app.utils';

@Component({
  selector: 'vclus-create-subnet-modal',
  templateUrl: './vclus-create-subnet-modal.component.html',
  styleUrls: ['./vclus-create-subnet-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VclusCreateSubnetModalComponent implements OnInit {

  @Input() allVpcs: AwsVpc[] = [];
  @Input() allSubnets: AwsSubnet[] = [];

  @Output('onClose') onCloseEmit = new EventEmitter<AwsSubnetCustom>();

  subnetToAccept: VClusSubnet;
  subnetsToAccept: VClusSubnet[] = [];

  awsSubnet: AwsSubnetCustom = new AwsSubnetCustom();
  selectedVclusVpc: VClusVpc;
  selectedAwsVpc: AwsVpc;

  constructor(public vclusService: VClusService) {
    closeOnEscapeClicked(window, this.onCloseEmit);
  }

  ngOnInit() {
    this.selectedAwsVpc = this.allVpcs[0];
    this.setSelectedVpc(this.selectedAwsVpc.id);
    this.awsSubnet.vpcId = this.selectedAwsVpc.id;
    this.updateAwsSubnetCidr();
  }

  get cidrSizes() {
    return new VClusVpc("", "").vpcCidrSizes;
  }

  setSelectedVpc(id: string) {
    this.selectedAwsVpc = this.allVpcs.find(vpc => vpc.id == id);
    this.selectedVclusVpc = new VClusVpc(this.selectedAwsVpc.id, this.selectedAwsVpc.name, true);
    this.selectedVclusVpc.cidr = this.selectedAwsVpc.ipv4Cidr[0];
    this.awsSubnet.vpcId = this.selectedAwsVpc.id;
    this.updateAwsSubnetCidr();
  }

  setSelectedVpcCidr(cidr: string) {
    this.selectedVclusVpc.cidr = cidr;
    this.awsSubnet.ipv4Cidr = cidr;
    this.updateAwsSubnetCidr();
  }

  updateAwsSubnetCidr() {
    this.awsSubnet.cidrIp = this.selectedAwsVpc.ipv4Cidr[0].split("/")[0];
    this.awsSubnet.cidrSize = this.selectedAwsVpc.ipv4Cidr[0].split("/")[1];
    this.awsSubnet.cidr = this.awsSubnet.getCidr();
  }

  onClose(cancelled: boolean = false) {
    if (cancelled) {
      this.onCloseEmit.emit();
      return;
    }

    this.awsSubnet.cidr = this.awsSubnet.getCidr();
    this.onCloseEmit.emit(this.awsSubnet);
  }
}
