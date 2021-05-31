import * as quickV from 'bulma-extensions';

import {
  AwsSubnet,
  AwsSubnetCustom,
  AwsVpc,
  ClientError,
  VClusSubnet,
  VClusVpc
} from '@app/models';
import { Component, Injector, OnInit } from '@angular/core';
import { SubnetService, VpcService } from '@core/services';

import { REQUEST_TIMEOUT } from '@constants/.ts';
import { ToastrService } from 'ngx-toastr';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'subnets',
  templateUrl: './subnets.component.html',
  styleUrls: ['./subnets.component.scss'],
})
export class SubnetsComponent implements OnInit {
  subnets: AwsSubnet[] = [];

  hasError: boolean;
  refreshingSubnets: boolean;
  isLoading: boolean = true;
  isCreatingSubnet: boolean = false;
  // showCreateModal: boolean = false;
  toggleQuickView: boolean = false;
  subnetName: string;
  subnetCidr: string;

  vpcSet: Set<string> = new Set();
  allVpcs: AwsVpc[] = [];
  selectedVpc: string;
  modalData: any;

  filterSubnet: any = {
    name: '',
    id: '',
    ipv4Cidr: '',
    vpcId: '',
    availabilityZone: '',
  };

  readonly toastService: ToastrService;
  readonly subnetService: SubnetService;
  readonly vpcService: VpcService;

  constructor(i: Injector) {
    this.vpcService = i.get(VpcService);
    this.subnetService = i.get(SubnetService);
    this.toastService = i.get(ToastrService);
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
        // this.showCreateModal = false;
      }
    });
  }

  ngOnInit() {
    var quickviews = quickV.bulmaQuickview.attach(); // quickviews now contains an array of all Quickview instances

    this.hasError = false;

    try {
      const result = combineLatest(
        this.vpcService.fetchAll(),
        this.subnetService.fetchAll(),
      );

      result.pipe(take(1)).subscribe(([vpcs, subnets]) => {
        if (vpcs instanceof ClientError) {
          const error = vpcs;
          this.toastService.error(error.message, error.title);
          this.isLoading = false;
          this.hasError = true;
          return;
        }

        this.allVpcs = this.buildAllVpcs(vpcs);
        this.subnets = this.buildAllSubnets(subnets);
        this.refreshingSubnets = false;
        this.isLoading = false;
      });
    } catch (e) {
      if (this.isLoading) {
        this.hasError = true;
      }
    }

    setTimeout(() => {
      if (this.isLoading) {
        this.hasError = true;
        this.isLoading = false;
      }
    }, REQUEST_TIMEOUT);
  }

  deleteSubnet(subnet: AwsSubnet) {
    if (
      confirm(
        'You must terminate all running instances in the subnet before you can delete the subnet. Did you do it ?',
      )
    ) {
      const idx = this.subnets.findIndex(({ id }) => id === subnet.id);
      this.toastService.info(subnet.id, 'Deleting');
      this.subnets.splice(idx, 1);

      this.subnetService
        .deleteSubnet(subnet.id)
        .pipe(take(1))
        .subscribe((res) => {
          if (res != subnet.id) {
            this.subnets.splice(idx, 0, subnet);
            this.toastService.error(res.message, res.title);
          } else {
            this.toastService.success(`${subnet.id} deleted`);
            this.ngOnInit();
          }
        });
    }
  }

  refreshSubnets() {
    this.refreshingSubnets = true;
    this.ngOnInit();
  }

  createSubnet() {
    // if (awsSubnet) {
    this.toastService.info('Creating subnet…');
    this.refreshingSubnets = true;
    this.subnetService
      .createSubnet(
        this.awsSubnet.name,
        this.awsSubnet.cidr,
        this.awsSubnet.vpcId,
      )
      .pipe(take(1))
      .subscribe((res) => {
        if (res instanceof ClientError) {
          this.toastService.error(res.message, res.title);
          this.refreshingSubnets = false;
        } else {
          this.toastService.success(res, 'Subnet created');
          this.awsSubnet = new AwsSubnetCustom();
          this.ngOnInit();
        }
      });
    // }

    // this.showCreateModal = false;
    this.toggleQuickView = !this.toggleQuickView;
  }

  getVpcOfSubnet(vpcId: string) {
    return this.allVpcs.find((vpc) => vpc.id == vpcId);
  }

  private buildAllVpcs(res: any) {
    if (res instanceof ClientError) {
      this.hasError = true;
      return [];
    } else {
      const vpcs = res as AwsVpc[];

      if (vpcs.length > 0) {
        this.selectedVpc = vpcs[0].id;
        vpcs.forEach((vpc) => {
          this.vpcSet.add(vpc.id);
        });
      }

      return res;
    }
  }

  private buildAllSubnets(res: any) {
    if (res instanceof ClientError) {
      this.hasError = true;
      return [];
    }

    return res;
  }

  subnetToAccept: VClusSubnet;
  subnetsToAccept: VClusSubnet[] = [];

  awsSubnet: AwsSubnetCustom = new AwsSubnetCustom();
  selectedVclusVpc: VClusVpc;
  selectedAwsVpc: AwsVpc;

  showQuickCreateSubnet() {
    this.toggleQuickView = !this.toggleQuickView;
    this.selectedAwsVpc = this.allVpcs[0];
    this.setSelectedVpc(this.selectedAwsVpc.id);
    this.awsSubnet.vpcId = this.selectedAwsVpc.id;
    this.updateAwsSubnetCidr();
  }

  get cidrSizes() {
    return new VClusVpc('', '').vpcCidrSizes;
  }

  setSelectedVpc(id: string) {
    this.selectedAwsVpc = this.allVpcs.find((vpc) => vpc.id == id);
    this.selectedVclusVpc = new VClusVpc(
      this.selectedAwsVpc.id,
      this.selectedAwsVpc.name,
      true,
    );
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
    this.awsSubnet.cidrIp = this.selectedAwsVpc.ipv4Cidr[0].split('/')[0];
    this.awsSubnet.cidrSize = this.selectedAwsVpc.ipv4Cidr[0].split('/')[1];
    this.awsSubnet.cidr = this.awsSubnet.getCidr();
  }
}
