import { Component, OnInit } from '@angular/core';
import { REGION_NAME, REGION_VALUE } from './app.constants';

import { Region } from '@models/helper_models';
import awsRegions from '@assets/regions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  readonly regions = awsRegions as Region[];

  show: boolean;
  regionName: string;
  regionValue: string;

  constructor() {}

  ngOnInit() {
    var regionName = localStorage.getItem(REGION_NAME);
    var regionValue = localStorage.getItem(REGION_VALUE);

    if (regionName === null || regionValue === null) {
      this.regionName = this.regions[0].name;
      this.regionValue = this.regions[0].value;
      this.show = true;
    }
  }

  changeRegion(r: any) {
    const region = this.regions.find(reg => reg.name === r);
    this.regionName = region.name;
    this.regionValue = region.value;
  }

  continue() {
    localStorage.setItem(REGION_NAME, this.regionName);
    localStorage.setItem(REGION_VALUE, this.regionValue);
    window.location.reload();
  }
}
