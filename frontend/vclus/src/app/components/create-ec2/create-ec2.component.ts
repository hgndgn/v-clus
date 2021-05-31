import {
  AwsSecurityGroup,
  AwsSubnet,
  AwsVpc,
  ClientError,
  SecurityGroupsOfInstances,
  VClusVpc,
  VCluster
} from '@app/models';
import {
  ClusterService,
  Ec2Service,
  SecurityGroupService,
  SubnetService,
  VpcService
} from '@core/services';
import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { REQUEST_TIMEOUT } from '@constants/.ts';
import { ToastrService } from 'ngx-toastr';
import { VClusService } from '../../services/vclus.service';
import { VClusSubnet } from '@models/vclus';
import { cloneDeep } from 'lodash';
import { combineLatest } from 'rxjs';
import { isClientError } from '@app/app.utils';
import { take } from 'rxjs/operators';
import { untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'create-ec2',
  templateUrl: './create-ec2.component.html',
  styleUrls: ['./create-ec2.component.scss'],
})
export class CreateEc2Component implements OnInit {
  @Input('instances') instances: any[];
  @Input('clusters') clusters: VCluster[];
  @Input('securityGroupsOfInstances')
  securityGroupsOfInstances: SecurityGroupsOfInstances[];

  @Output('onError') onError = new EventEmitter();
  @Output('onSuccess') onSuccess = new EventEmitter();
  @Output('onCreatingInstances') onCreatingInstances = new EventEmitter();

  isLoading: boolean;
  keyPairs: any[];

  showImageIdErrors: boolean = false;

  imageIdErrors: any = {};
  vclusVpcs: VClusVpc[] = [];

  allVpcs: AwsVpc[] = [];
  allSubnets: AwsSubnet[] = [];
  allSecurityGroups: AwsSecurityGroup[] = [];

  vpcSet: Set<string> = new Set();

  modalData: any;

  readonly ec2Service: Ec2Service;
  readonly clusterService: ClusterService;
  readonly vpcService: VpcService;
  readonly subnetService: SubnetService;
  readonly sgService: SecurityGroupService;
  readonly toastr: ToastrService;
  readonly vclusService: VClusService;

  constructor(i: Injector) {
    this.ec2Service = i.get(Ec2Service);
    this.clusterService = i.get(ClusterService);
    this.vpcService = i.get(VpcService);
    this.subnetService = i.get(SubnetService);
    this.sgService = i.get(SecurityGroupService);
    this.toastr = i.get(ToastrService);
    this.vclusService = i.get(VClusService);

    this.vclusService.vpcs.next([]);
    this.vclusService.vpcs
      .pipe(untilDestroyed(this, 'ngOnDestroy'))
      .subscribe((vpcs) => {
        this.vclusVpcs = vpcs.filter((vpc) => vpc.subnets.length > 0);
      });
  }

  ngOnDestroy() {}

  ngOnInit() {
    this.isLoading = true;
    this.allSubnets = [];
    this.allSecurityGroups = [];

    this.ec2Service.getKeyPairs().subscribe((keypairs: any) => {
      if (keypairs instanceof ClientError) {
        this.onError.emit();
        return [];
      } else {
        this.keyPairs = keypairs;
      }
    });

    const result = combineLatest(
      this.vpcService.fetchAll(),
      this.subnetService.fetchAll(),
      this.sgService.fetchAll(),
    );

    result.subscribe(([vpcs, subnets, securityGroups]) => {
      this.allVpcs = this.buildAllVpcs(vpcs);
      this.allSubnets = this.buildAllSubnets(subnets);
      this.allSecurityGroups = this.buildAllSecurityGroups(securityGroups);

      this.createVclusVpcs();

      this.isLoading = false;
    });

    setTimeout(() => {
      if (this.isLoading) {
        this.onError.emit();
        this.isLoading = false;
      }
    }, REQUEST_TIMEOUT);
  }

  getSecurityGroupsOfVpc(vpcId: string) {
    return this.allSecurityGroups.filter((sg) => sg.vpcId == vpcId);
  }

  onSubmit() {
    this.imageIdErrors = this.vclusService.getInstanceImageIdErrors(
      this.vclusService.vpcs.value,
    );

    if (Object.keys(this.imageIdErrors).length > 0) {
      this.showImageIdErrors = true;
      return;
    }

    let requestObject = cloneDeep(this.vclusVpcs);
    requestObject.forEach((vpc) => VClusVpc.prepareForSubmit(vpc));
    requestObject = requestObject.filter((v) => v.subnets.length > 0);
    requestObject.forEach((v) => {
      v.subnets = v.subnets.filter((s) => s.instances.length > 0);
    });
    this.toastr.info('Launching instances');

    this.ec2Service
      .createInstances(requestObject)
      .pipe(take(1))
      .subscribe((res) => {
        if (isClientError(res)) {
          this.toastr.error(res.message, res.title);
        } else {
          this.toastr.info('Instances launched');
          this.onSuccess.emit();
        }
      });
  }

  private buildAllVpcs(res: any) {
    if (res instanceof ClientError) {
      this.onError.emit();
      return [];
    } else {
      const vpcs = res as AwsVpc[];

      vpcs.forEach((vpc) => {
        this.vpcSet.add(vpc.id);
      });

      return res;
    }
  }

  private buildAllSubnets(res: any) {
    if (res instanceof ClientError) {
      this.onError.emit();
      return [];
    } else {
      return res;
    }
  }

  private buildAllSecurityGroups(res: any) {
    if (res instanceof ClientError) {
      this.onError.emit();
      return [];
    } else {
      return res;
    }
  }

  private createVclusVpcs() {
    const vpcs = this.allVpcs.map((vpc) => {
      const name = vpc.name ? vpc.name : 'VPC';
      const vclusVpc = new VClusVpc(vpc.id, name, true);
      vclusVpc.cidr = vpc.ipv4Cidr[0];
      return vclusVpc;
    });

    vpcs.forEach((vpc) => {
      const subnets = this.allSubnets
        .filter((s) => s.vpcId == vpc.id)
        .map((s) => {
          const vclusSubnet = new VClusSubnet(s.id, s.ipv4Cidr, '', true);
          Object.assign(vclusSubnet, s);
          vclusSubnet.name = s.id;
          return vclusSubnet;
        });
      vpc.subnets = subnets;
    });

    this.vclusService.vpcs.next([...vpcs]);
  }
}
