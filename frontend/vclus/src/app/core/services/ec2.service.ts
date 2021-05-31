import { EC2_AMAZON_IMAGE_IDS } from './../../app.constants';
import { AwsInstance } from '@models/aws/AwsInstance';
import {
  EC2_INSTANCES,
  EC2_INSTANCES_CREATE,
  EC2_INSTANCES_START,
  EC2_INSTANCES_STATE,
  EC2_INSTANCES_STOP,
  EC2_INSTANCES_TERMINATE,
  EC2_INSTANCE_INFO,
  EC2_KEY_PAIRS,
  EC2_KEY_PAIR_DELETE,
  EC2_KEY_PAIR_DOWNLOAD,
} from '@constants/.ts';
import { Injectable, Injector } from '@angular/core';

import { BaseService } from './base.service';
import { ClientError } from '@models/ClientError';
import { map } from 'rxjs/internal/operators/map';
import { FileSaverService } from 'ngx-filesaver';
import { KeyPair } from '@models/KeyPair';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Ec2Service extends BaseService {
  readonly fileSaverService: FileSaverService;

  constructor(protected injector: Injector) {
    super(injector);
    this.fileSaverService = injector.get(FileSaverService);
  }

  private extractInstances(jsonResponse: any) {
    let instances: AwsInstance[] = [];
    let reservations: any = jsonResponse.Reservations;

    if (reservations && reservations.length > 0) {
      reservations.forEach((reservation) => {
        reservation.Instances.forEach((instance) => {
          instances.push(new AwsInstance(instance));
        });
      });
    }

    return instances;
  }

  fetchAll() {
    return super.get(EC2_INSTANCES).pipe(
      map((res: any) => {
        if (res.message) {
          return new ClientError(res);
        } else {
          return this.extractInstances(res);
        }
      }),
    );
  }

  createInstances(data: any) {
    return super.post(EC2_INSTANCES_CREATE, data).pipe(
      map((res: any) => {
        if (res.message) {
          return new ClientError(res);
        } else {
          return res;
        }
      }),
    );
  }

  deleteKeyPair(keyname: string) {
    return super.post(EC2_KEY_PAIR_DELETE + keyname).pipe(
      map((res) => {
        return res;
      }),
    );
  }

  downloadKeyPair(keyname: string) {
    return super
      .get(EC2_KEY_PAIR_DOWNLOAD + keyname, {
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(
        map((res: any) => {
          if (!res) {
            return false;
          } else {
            this.fileSaverService.save((<any>res).body, `${keyname}.pem`);
            return true;
          }
        }),
      );
  }

  getAmazonImageIds() {
    return super.get(EC2_AMAZON_IMAGE_IDS).pipe(
      map((res: any) => {
        if (res.message) {
          return new ClientError(res);
        } else {
          return res;
        }
      }),
    );
  }

  getSecurityGroupsOfInstances(ids: string[]) {
    return super
      .post(EC2_INSTANCE_INFO, {
        instanceIds: ids,
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

  getKeyPairs(): Observable<KeyPair[]> {
    return super.get(EC2_KEY_PAIRS).pipe(
      map((res: any) => {
        if (res.message) {
          return new ClientError(res);
        } else {
          return res;
        }
      }),
    );
  }

  getState(id: string) {
    return super.get(EC2_INSTANCES_STATE + id).pipe(
      map((res: any) => {
        if (res.message) {
          return new ClientError(res);
        } else {
          return res;
        }
      }),
    );
  }

  startInstance(id: string) {
    return super.post(EC2_INSTANCES_START + id);
  }

  stopInstance(id: string) {
    return super.post(EC2_INSTANCES_STOP + id);
  }

  terminateInstance(id: string) {
    return super.post(EC2_INSTANCES_TERMINATE + id);
  }
}
