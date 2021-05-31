import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AwsInstance } from '@app/models';
import { closeOnEscapeClicked } from '@app/app.utils';

@Component({
  selector: 'instance-info-modal',
  templateUrl: './instance-info-modal.component.html',
  styleUrls: ['./instance-info-modal.component.scss'],
})
export class InstanceInfoModalComponent implements OnInit {
  @Input() ec2: AwsInstance;
  @Output() onClose = new EventEmitter();

  constructor() {
    closeOnEscapeClicked(window, this.onClose);
  }

  ngOnInit() {}
}
