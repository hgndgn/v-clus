import {
  ActiveTab,
  SecurityGroupsOfInstances
} from '@app/models/helper_models';
import { AwsInstance, ClientError } from '@app/models';
import { Component, Injector, OnInit } from '@angular/core';

import { Ec2Service } from '@core/services/ec2.service';
import { REQUEST_TIMEOUT } from '@constants/.ts';
import { ToastrService } from 'ngx-toastr';
import { getEc2StateClass } from '@app/app.utils';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ec2-instances',
  templateUrl: './ec2-instances.component.html',
  styleUrls: ['./ec2-instances.component.scss'],
})
export class Ec2InstancesComponent implements OnInit {
  instances: AwsInstance[];
  securityGroupsOfInstances: SecurityGroupsOfInstances[] = [];

  getEc2StateClass = getEc2StateClass;
  activeTab: ActiveTab = ActiveTab.LIST;
  isLoading: boolean = true;
  hasError: boolean = false;
  noInstances: boolean = false;
  refreshingInstances: boolean = true;
  showCreateEc2Component: boolean = true;

  selectedEc2: AwsInstance;
  showInfoModal: boolean = false;
  contextMenuEvent: any;

  readonly ec2Service: Ec2Service;
  readonly toastService: ToastrService;

  constructor(i: Injector) {
    this.ec2Service = i.get(Ec2Service);
    this.toastService = i.get(ToastrService);
  }

  async ngOnInit() {
    this.refreshingInstances = true;
    const success = await this.fetchInstances();
    this.refreshingInstances = false;

    if (!success) return;

    // load existing security groups of the instances
    await this.ec2Service
      .getSecurityGroupsOfInstances(this.instances.map((i) => i.id))
      .pipe(take(1))
      .toPromise()
      .then((res) => {
        this.securityGroupsOfInstances = res;
        this.afterLoading();
      });

    setTimeout(() => {
      if (this.isLoading) {
        this.hasError = true;
        this.isLoading = false;
      }
    }, REQUEST_TIMEOUT);
  }

  async fetchInstances(): Promise<boolean> {
    try {
      const res = await this.ec2Service.fetchAll().toPromise();

      if (res instanceof ClientError) {
        this.toastService.error(res.message, res.title);
        this.refreshingInstances = false;
        this.isLoading = false;
        this.hasError = true;
        return false;
      } else {
        this.instances = res;
      }

      if (this.instances.length === 0) {
        this.noInstances = true;
        this.afterLoading();
        return true;
      }
    } catch (e) {
      if (this.isLoading) {
        this.hasError = true;
      }
    }
    return false;
  }

  onCreatingInstances() {
    this.showCreateEc2Component = false;
    this.refreshInstances();
  }

  onStateChange() {
    this.ngOnInit();
  }

  refreshInstances() {
    this.isLoading = false;
    this.refreshingInstances = true;
    this.activeTab = ActiveTab.LIST;
    this.showCreateEc2Component = false;
    this.ngOnInit();
  }

  showError() {
    this.hasError = true;
  }

  afterLoading() {
    this.isLoading = false;
    this.refreshingInstances = false;
    this.showCreateEc2Component = true;
  }
}
