import {
  AmazonImageIdsComponent,
  ClustersComponent,
  Ec2InstancesComponent,
  KeypairsComponent,
  SecurityGroupsComponent,
  SubnetsComponent,
  VpcsComponent
} from './views';
import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: "vclus",
    children: [
      { path: 'clusters', component: ClustersComponent },
      { path: 'instances', component: Ec2InstancesComponent },
      { path: 'amazon-image-ids', component: AmazonImageIdsComponent },
      { path: 'keypairs', component: KeypairsComponent },
      { path: 'vpcs', component: VpcsComponent },
      { path: 'subnets', component: SubnetsComponent },
      { path: 'security-groups', component: SecurityGroupsComponent },
      { path: '**', redirectTo: '/vclus/clusters', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
