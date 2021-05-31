import { AwsVpc, ClientError } from '@app/models';
import {
  CREATE_VPC,
  DELETE_VPC,
  GET_VPC,
  VPCS,
  VPC_SUBNETS
} from '@constants/.ts';
import { Injectable, Injector } from '@angular/core';

import { BaseService } from './base.service';
import { SubnetService } from './subnet.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class VpcService extends BaseService {
  subnetService: SubnetService;

  constructor(protected injector: Injector) {
    super(injector);
    this.subnetService = injector.get(SubnetService);
  }

  private extractVpcs(jsonResponse: any) {
    let vpcs: AwsVpc[] = [];
    let resVpcs = jsonResponse.Vpcs;
  
    if (resVpcs && resVpcs.length > 0) {
      resVpcs.forEach((vpc) => {
        vpcs.push(new AwsVpc(vpc));
      });
    }
  
    return vpcs;
  }

  fetchAll() {
    return super.get(VPCS).pipe(
      map((res: any) => {
        if (res.message) {
          return new ClientError(res);
        }

        return this.extractVpcs(res);
      }),
    );
  }

  async fetchAllSync() {
    const res: any = await super.get(VPCS).toPromise();
    
    if (!Object.keys(res).includes("Vpcs")) {
      return new ClientError(res);
    }

    return this.extractVpcs(res);
  }

  fetchOne(id: string) {
    return super.get(GET_VPC + id).pipe(
      map((res: any) => {
        if (res.message) {
          return new ClientError(res);
        }

        return this.extractVpcs(res);
      }),
    );
  }

  createVpc(name: string, cidr: string) {
    return super.post(CREATE_VPC, { name, cidr }).pipe(
      map((res: any) => {
        if (res.message) {
          return new ClientError(res);
        } else {
          return res;
        }
      }),
    );
  }

  deleteVpc(vpcId: string) {
    return super.post(DELETE_VPC + vpcId).pipe(
      map((res: any) => {
        if (res.message) {
          return new ClientError(res);
        } else {
          return res;
        }
      }),
    );
  }

  getSubnetsOfVpc(id: string) {
    return super.get(VPC_SUBNETS + id).pipe(
      map((res: any) => {
        if (res.message) {
          return new ClientError(res);
        }

        return res;
      }),
    );
  }
}
