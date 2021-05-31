import { Component, OnInit } from '@angular/core';

import { Region } from '@models/helper_models';
import { Router } from '@angular/router';
import awsRegions from '@assets/regions';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  readonly regions = awsRegions as Region[];

  showMenu: boolean = false;
  showOnMobile: boolean = false;
  regionName: string;
  regionValue: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.regionName = localStorage.getItem('region_name');
    this.regionValue = localStorage.getItem('region_value');
  }

  navigate(to: string) {
    const prefix = "vclus/";
    this.router.navigateByUrl(prefix + to);
  }

  changeRegion(r: any) {
    const region = this.regions.find((reg) => reg.name === r);
    localStorage.setItem('region_name', region.name);
    localStorage.setItem('region_value', region.value);
    window.location.reload(true);
  }
}
