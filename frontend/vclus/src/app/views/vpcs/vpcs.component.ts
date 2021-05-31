import { Component, Injector, OnInit } from '@angular/core';
import { SubnetService, VpcService } from '@core/services';

import { AwsVpc } from '@models/aws/AwsVpc';
import { ClientError } from '@models/ClientError';
import { REQUEST_TIMEOUT } from '@constants/.ts';
import { ToastrService } from 'ngx-toastr';
import { VClusVpc } from '@models/vclus';
import { isValidCidrBlock } from '../../app.utils';
import { take } from 'rxjs/operators';

class CreateVpcModal {
  name: string = '';
  cidrIp: string = '10.0.0.0';
  cidrSize: string = '16';

  getCidr() {
    return `${this.cidrIp}/${this.cidrSize}`;
  }

  hasValidCidr() {
    return isValidCidrBlock(this.cidrIp + '/' + this.cidrSize);
  }
}

@Component({
  selector: 'vpcs',
  templateUrl: './vpcs.component.html',
  styleUrls: ['./vpcs.component.scss'],
})
export class VpcsComponent implements OnInit {
  vpcs: AwsVpc[];

  hasError: boolean;
  refreshingVpcs: boolean;
  isLoading: boolean = true;
  isCreatingVpc: boolean = false;
  showCreateModal: boolean = false;
  vpcName: string;
  vpcCidr: string;

  createVpcModal: CreateVpcModal = new CreateVpcModal();
  toggleQuickView: boolean = false;

  readonly vpcService: VpcService;
  readonly toastService: ToastrService;
  readonly subnetService: SubnetService;

  constructor(i: Injector) {
    this.vpcService = i.get(VpcService);
    this.subnetService = i.get(SubnetService);
    this.toastService = i.get(ToastrService);
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
        this.showCreateModal = false;
      }
    });
  }

  ngOnInit() {
    this.hasError = false;

    try {
      this.vpcService.fetchAll().subscribe((res) => {
        if (res instanceof ClientError) {
          this.toastService.error(res.message, res.title);
          this.refreshingVpcs = false;
          this.isLoading = false;
          this.hasError = true;
          return;
        }

        this.vpcs = res as AwsVpc[];
        this.refreshingVpcs = false;
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

  get cidrSizes() {
    return new VClusVpc('', '').vpcCidrSizes;
  }

  createVpc() {
    this.isCreatingVpc = true;

    this.vpcService
      .createVpc(this.createVpcModal.name, this.createVpcModal.getCidr())
      .pipe(take(1))
      .subscribe((res) => {
        if (res instanceof ClientError) {
          this.toastService.error(res.message, res.title);
        } else {
          this.ngOnInit();
          this.toastService.success('Vpc created');
          this.showCreateModal = false;
          this.vpcCidr = '';
          this.vpcName = '';
        }

        this.isCreatingVpc = false;
      });
  }

  deleteVpc(vpc: AwsVpc) {
    if (
      confirm(
        'All included resources (instances, subnets…) will be deleted. Are you sure?',
      )
    ) {
      const idx = this.vpcs.findIndex(({ id }) => id === vpc.id);
      this.vpcs.splice(idx, 1);

      this.toastService.info(vpc.id, 'Deleting');

      this.vpcService
        .deleteVpc(vpc.id)
        .pipe(take(1))
        .subscribe((res) => {
          if (res != vpc.id) {
            this.vpcs.splice(idx, 0, vpc);
            this.toastService.error(res.message, res.title);
          } else {
            this.toastService.success(`${vpc.id}`, 'Deleted');
            this.ngOnInit();
          }
        });
    }
  }

  refreshVpcs() {
    this.refreshingVpcs = true;
    this.ngOnInit();
  }
}
