import { CREATE_SUBNET, DELETE_SUBNET, SUBNETS } from '@constants/.ts';
import { Injectable, Injector } from '@angular/core';

import { AwsSubnet } from '@models/aws';
import { BaseService } from './base.service';
import { ClientError } from '@models/ClientError';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SubnetService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }

  fetchAll() {
    return super.get(SUBNETS).pipe(
      map((res: any) => {
        if (res.message) {
          return new ClientError(res);
        } else {
          return res['Subnets'].map(s => new AwsSubnet(s)) as AwsSubnet[];
        }
      }),
    );
  }

  createSubnet(name: string, cidr: string, vpcId: string) {
    return super
      .post(CREATE_SUBNET, {
        name,
        cidr,
        vpcId,
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

  deleteSubnet(subnetId: string) {
    return super.post(DELETE_SUBNET + subnetId).pipe(
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
