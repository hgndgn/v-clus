import {
  CREATE_CLUSTER,
  DELETE_CLUSTER,
  VIRTUAL_CLUSTERS,
} from '@constants/.ts';
import { Injectable, Injector } from '@angular/core';

import { BaseService } from './base.service';
import { ClientError } from '@models/ClientError';
import { map } from 'rxjs/internal/operators/map';

@Injectable({ providedIn: 'root' })
export class ClusterService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }

  fetchAll() {
    return super.get(VIRTUAL_CLUSTERS).pipe(
      map((res: any) => {
        if (res && res.message) {
          return new ClientError(res);
        } else {
          return res;
        }
      }),
    );
  }

  createCluster(data: any) {
    return super.post(CREATE_CLUSTER, data);
  }

  deleteCluster(id: number) {
    return super.post(DELETE_CLUSTER + id);
  }
}
