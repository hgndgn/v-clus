import { AwsEc2State, AwsInstance, ClientError } from '@app/models';
import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { Ec2Service } from '@core/services';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';

@Component({
  selector: 'instance-state-actions',
  templateUrl: './instance-state-actions.component.html',
  styleUrls: ['./instance-state-actions.component.scss'],
})
export class InstanceStateActionsComponent implements OnInit {
  @Input() instance: AwsInstance;
  @Output() onStateChange = new EventEmitter();

  validState: boolean = true;

  readonly ec2Service: Ec2Service;
  readonly toastService: ToastrService;

  constructor(i: Injector) {
    this.ec2Service = i.get(Ec2Service);
    this.toastService = i.get(ToastrService);
  }

  ngOnInit(): void {
    switch (this.instance.state) {
      case 'running':
        break;
      case 'stopped':
        break;
      case 'terminated':
        break;
      default:
        this.validState = false;
    }
  }

  startInstance() {
    if (this.instance.state === AwsEc2State.STOPPED) {
      let prevState = this.instance.state;
      this.instance.state = AwsEc2State.PENDING;
      this.validState = false;

      const _this = this;

      this.ec2Service
        .startInstance(this.instance.id)
        .pipe(take(1))
        .subscribe((res) => {
          if (res instanceof ClientError) {
            _this.instance.state = prevState;
            _this.toastService.error(
              res.message,
              res.title,
            );
          } else {
            _this.onStateChange.emit();
            _this.instance.state = AwsEc2State.RUNNING;
            _this.validState = true;
          }
        });
    }
  }

  stopInstance() {
    if (this.instance.state === AwsEc2State.RUNNING) {
      let prevState = this.instance.state;
      this.instance.state = AwsEc2State.STOPPING;
      this.validState = false;

      const _this = this;

      this.ec2Service
        .stopInstance(this.instance.id)
        .pipe(take(1))
        .subscribe((res) => {
          if (res instanceof ClientError) {
            _this.instance.state = prevState;
            _this.toastService.error(
              'An error occured',
              'Instance not stopped',
            );
          } else {
            _this.onStateChange.emit();
            _this.instance.state = AwsEc2State.STOPPED;
            _this.validState = true;
          }
        });
    }
  }

  terminateInstance() {
    switch (this.instance.state) {
      case AwsEc2State.STOPPED:
      case AwsEc2State.RUNNING:
        let prevState = this.instance.state;
        this.instance.state = AwsEc2State.SHUTTING_DOWN;
        this.validState = false;

        const _this = this;

        this.ec2Service
          .terminateInstance(this.instance.id)
          .pipe(take(1))
          .subscribe((res) => {
            if (res instanceof ClientError) {
              _this.instance.state = prevState;
              _this.toastService.error(
                res.message,
                res.title,
              );
            } else {
              _this.onStateChange.emit();
              _this.instance.state = AwsEc2State.TERMINATED;
              _this.validState = true;
            }
          });
        break;
      default:
        break;
    }
  }
}
