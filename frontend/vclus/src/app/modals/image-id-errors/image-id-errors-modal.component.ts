import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { VClusVpc } from '@models/vclus';

@Component({
  selector: 'image-id-errors',
  templateUrl: './image-id-errors-modal.component.html',
  styleUrls: ['./image-id-errors-modal.component.scss']
})
export class ImageIdErrorsModalComponent implements OnInit {

  @Input() imageIdErrors;

  @Output() onClose = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  getVpcKeysOfImageIdErrors() {
    return Object.keys(this.imageIdErrors);
  }

  getSubnetKeysOfImageIdErrors(vpcKey: string) {
    return Object.keys(this.imageIdErrors[vpcKey]);
  }

}
