import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';
import { DocsComponent } from './docs.component';
import { AwsInstancePropsComponent } from './components/ec2-types/ec2-types.component';
import { NgModule } from '@angular/core';
import { SgRuleProtocolsComponent } from './components/sg-rule-protocols/sg-rule-protocols.component';

const routes: Routes = [
  {
    path: 'docs/security-group-protocols',
    component: SgRuleProtocolsComponent,
  },
  {
    path: 'docs/instance-types',
    component: AwsInstancePropsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [
    DocsComponent,
    SgRuleProtocolsComponent,
    AwsInstancePropsComponent,
  ],
})
export class DocsModule {}
