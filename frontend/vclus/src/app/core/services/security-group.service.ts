import {
  CREATE_SECURITY_GROUP,
  DELETE_SECURITY_GROUP,
  SECURITY_GROUPS,
  SECURITY_GROUPS_CREATE_WITH_RULES,
} from '@constants/.ts';
import { Injectable, Injector } from '@angular/core';

import { AwsSecurityGroup } from '@models/aws';
import { BaseService } from './base.service';
import { ClientError } from '@models/ClientError';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class SecurityGroupService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }

  private extractSecurityGroups(jsonResponse: any) {
    let securityGroups: AwsSecurityGroup[] = [];
    let resSgs = jsonResponse['SecurityGroups'];
  
    if (resSgs === undefined || resSgs.length === 0) {
      console.error('There are no available security groups.');
    } else {
      resSgs.forEach((sg) => {
        securityGroups.push(new AwsSecurityGroup(sg));
      });
    }
  
    return securityGroups;
  }

  fetchAll() {
    return super.get(SECURITY_GROUPS).pipe(
      map((res: any) => {
        if (res.message) {
          return new ClientError(res);
        } else {
          return this.extractSecurityGroups(res);
        }
      }),
    );
  }

  createGroup(name: string, description: string, vpcId: string) {
    return super
      .post(CREATE_SECURITY_GROUP, {
        name: name,
        description: description,
        vpcId: vpcId,
      })
      .pipe(
        map((res: any) => {
          if (res.message) {
            return new ClientError(res);
          } else {
            return res;
          }
        }),
      );
  }

  createGroupWithRules(group: any, inboundRules: any[], outboundRules: any[]) {
    return super
      .post(SECURITY_GROUPS_CREATE_WITH_RULES, {
        group: group,
        inboundRules: inboundRules,
        outboundRules: outboundRules,
      })
      .pipe(
        map((res: any) => {
          if (res.message) {
            return new ClientError(res);
          } else {
            return res;
          }
        }),
      );
  }

  deleteGroup(groupId: string) {
    return super.post(DELETE_SECURITY_GROUP + groupId).pipe(
      map((res: any) => {
        if (res.message) {
          return new ClientError(res);
        } else {
          return res;
        }
      }),
    );
  }
}
