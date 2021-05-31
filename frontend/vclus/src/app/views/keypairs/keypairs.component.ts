import { Component, Injector, OnInit } from '@angular/core';

import { ClientError } from '@models/ClientError';
import { Ec2Service } from '@core/services/ec2.service';
import { REQUEST_TIMEOUT } from '@constants/.ts';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-keypairs',
  templateUrl: './keypairs.component.html',
  styleUrls: ['./keypairs.component.scss'],
})
export class KeypairsComponent implements OnInit {
  hasError = false;
  keyPairs: { [key: string]: string | string[] }[];

  isLoading: boolean;
  refreshingKeypairs: boolean;

  readonly ec2Service: Ec2Service;
  readonly toastService: ToastrService;

  constructor(i: Injector) {
    this.ec2Service = i.get(Ec2Service);
    this.toastService = i.get(ToastrService);
  }

  ngOnInit() {
    this.isLoading = true;
    this.refreshingKeypairs = true;

    this.ec2Service
      .getKeyPairs()
      .pipe(take(1))
      .subscribe((result: any) => {
        if (result instanceof ClientError) {
          this.toastService.error(result.message, result.title);
          this.isLoading = false;
          this.hasError = true;
          return [];
        }
        
        this.keyPairs = result;
        this.isLoading = false;
        this.refreshingKeypairs = false;
      });

    setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
      }
    }, REQUEST_TIMEOUT);
  }

  deleteKeypair(keyname: string) {
    if (confirm('Are you sure you want to delete this key pair?')) {
      this.toastService.info(keyname, 'Deleting');

      this.ec2Service
        .deleteKeyPair(keyname)
        .pipe(take(1))
        .subscribe((res) => {
          if (res === keyname) {
            this.toastService.success(keyname, 'Key pair deleted');
            this.ngOnInit();
          } else {
            this.toastService.success(
              'Key pair could not be deleted',
              'An error occured',
            );
          }
        });
    }
  }

  downloadKeypair(keyname: string) {
    this.ec2Service
      .downloadKeyPair(keyname)
      .pipe(take(1))
      .subscribe((res) => {
        if (!res) {
          this.toastService.error(
            `'${keyname}' is not available in your database`,
          );
        }
      });
  }

  refreshKeypairs() {
    this.ngOnInit();
  }
}
