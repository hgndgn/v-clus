import { Component, Injector, OnInit } from '@angular/core';

import { ActiveTab } from '@models/helper_models';
import { AwsSecurityGroup } from '@models/aws';
import { ClientError } from './../../models/ClientError';
import { REQUEST_TIMEOUT } from '@constants/.ts';
import { SecurityGroupService } from '@core/services/security-group.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';

@Component({
  selector: 'security-groups',
  templateUrl: './security-groups.component.html',
  styleUrls: ['./security-groups.component.scss'],
})
export class SecurityGroupsComponent implements OnInit {
  groups: AwsSecurityGroup[] = [];
  activeTab: ActiveTab = ActiveTab.LIST;

  isLoading: boolean = true;
  hasError: boolean = false;
  noGroups: boolean = false;
  refreshingGroups: boolean = false;

  readonly sgService: SecurityGroupService;
  readonly toastService: ToastrService;

  constructor(i: Injector) {
    this.sgService = i.get(SecurityGroupService);
    this.toastService = i.get(ToastrService);
  }

  ngOnInit() {
    this.sgService.fetchAll().subscribe((res) => {
      if (res instanceof ClientError) {
        this.toastService.error(res.message, res.title);
        this.isLoading = false;
        this.hasError = true;
        this.hasError = true;
        return;
      }
      
      this.groups = res;

      if (this.groups.length === 0) {
        this.noGroups = true;
        this.activeTab = ActiveTab.LIST;
      }

      this.isLoading = false;
      this.refreshingGroups = false;
    });

    setTimeout(() => {
      if (this.isLoading) {
        this.hasError = true;
      }
    }, REQUEST_TIMEOUT);
  }

  refreshGroups() {
    this.refreshingGroups = true;
    this.ngOnInit();
  }

  vpcIds() {
    return [...new Set(this.groups.map((g) => g.vpcId))];
  }

  deleteGroup(group: AwsSecurityGroup) {
    if (
      confirm(
        'You must disassociate this group from instances, before you can delete this group. Did you do it ?',
      )
    ) {
      this.toastService.info(group.id, 'Deleting');

      const idx = this.groups.findIndex(({ id }) => id === group.id);
      this.groups.splice(idx, 1);

      this.sgService
        .deleteGroup(group.id)
        .pipe(take(1))
        .subscribe((res) => {
          if (res != group.id) {
            this.groups.splice(idx, 0, group);
            this.toastService.error(res.message, res.title);
          } else {
            this.toastService.success(group.id, 'Security group deleted');
            this.ngOnInit();
          }
        });
    }
  }

  onSuccess() {
    this.ngOnInit();
  }
}
