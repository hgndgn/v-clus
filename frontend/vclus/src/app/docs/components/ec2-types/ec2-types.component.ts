import { Component, OnInit } from '@angular/core';

import { AwsInstanceProps } from '@assets/AwsInstanceProps';

@Component({
  selector: 'ec2-types',
  templateUrl: './ec2-types.component.html',
  styleUrls: ['./ec2-types.component.scss'],
})
export class AwsInstancePropsComponent implements OnInit {
  readonly instanceTypes = [...AwsInstanceProps];
  keys = [];

  constructor() {}

  ngOnInit() {
    this.keys = Object.keys(this.instanceTypes[0]);
  }
}
