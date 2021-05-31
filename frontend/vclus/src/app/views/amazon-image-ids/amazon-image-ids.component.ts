import { Component, OnInit } from '@angular/core';

import { ClientError } from './../../models/ClientError';
import { Ec2Service } from '@core/services';
import { REQUEST_TIMEOUT } from './../../app.constants';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';

@Component({
  selector: 'amazon-image-ids',
  templateUrl: './amazon-image-ids.component.html',
  styleUrls: ['./amazon-image-ids.component.scss'],
})
export class AmazonImageIdsComponent implements OnInit {
  images: any[] = [];
  hasError = false;
  isLoading: boolean = true;

  constructor(
    private ec2Service: Ec2Service,
    private toastService: ToastrService,
  ) {}

  ngOnInit() {
    this.ec2Service
      .getAmazonImageIds()
      .pipe(take(1))
      .subscribe((res) => {
        if (res instanceof ClientError) {
          this.toastService.error(res.message, res.title);
          this.isLoading = false;
          this.hasError = true;
          return;
        }

        this.images = res;
      });

    setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
      }
    }, REQUEST_TIMEOUT);
  }
}
