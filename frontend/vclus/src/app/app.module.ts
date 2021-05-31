import {
  AmazonImageIdsComponent,
  ClustersComponent,
  Ec2InstancesComponent,
  KeypairsComponent,
  SecurityGroupsComponent,
  SubnetsComponent,
  VpcsComponent
} from './views';
import {
  CreateClusterComponent,
  CreateEc2Component,
  CreateSecurityGroupComponent,
  ErrorComponent,
  InstanceInfoModalComponent,
  InstanceStateActionsComponent,
  JsonViewerComponent,
  NavbarComponent,
  SgRuleTableComponent,
  SpinnerComponent,
  VClusInstanceSettingsModalComponent,
  VClusVpcComponent,
  VclusCreateSubnetModalComponent,
  VclusSubnetModalComponent
} from './';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DocsModule } from './docs/docs.module';
import { FileSaverModule } from 'ngx-filesaver';
import { ImageIdErrorsModalComponent } from './modals/image-id-errors/image-id-errors-modal.component';
import { NgDragDropModule } from 'ng-drag-drop';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { RegionInterceptor } from '@core/region.interceptor';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { UrlInterceptor } from '@core/url.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AmazonImageIdsComponent,
    ClustersComponent,
    CreateClusterComponent,
    CreateEc2Component,
    CreateSecurityGroupComponent,
    Ec2InstancesComponent,
    ErrorComponent,
    ImageIdErrorsModalComponent,
    InstanceInfoModalComponent,
    InstanceStateActionsComponent,
    JsonViewerComponent,
    KeypairsComponent,
    NavbarComponent,
    SecurityGroupsComponent,
    SgRuleTableComponent,
    SpinnerComponent,
    SubnetsComponent,
    VclusCreateSubnetModalComponent,
    VClusInstanceSettingsModalComponent,
    VclusSubnetModalComponent,
    VClusVpcComponent,
    VpcsComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    DocsModule,
    FileSaverModule,
    FormsModule,
    HttpClientModule,
    NgxJsonViewerModule,
    ReactiveFormsModule,
    RouterModule,

    NgDragDropModule.forRoot(),

    ToastrModule.forRoot({
      timeOut: 7000,
      closeButton: true,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RegionInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UrlInterceptor, multi: true },
  ],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
