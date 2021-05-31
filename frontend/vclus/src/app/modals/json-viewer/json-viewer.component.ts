import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { VClusVpc, VCluster } from '@models/vclus';

import { DomSanitizer } from '@angular/platform-browser';
import { cloneDeep } from 'lodash';
import { closeOnEscapeClicked } from '@app/app.utils';

@Component({
  selector: 'json-viewer',
  templateUrl: './json-viewer.component.html',
  styleUrls: ['./json-viewer.component.scss'],
})
export class JsonViewerComponent implements OnInit {
  @Input() data: VCluster;
  @Output() onClose = new EventEmitter();

  vclusVpcs: VClusVpc[] = [];
  @ViewChild('downloadBtn') el: ElementRef;

  constructor(private sanitizer: DomSanitizer) {
    closeOnEscapeClicked(window, this.onClose);
  }

  ngOnInit() {
    this.vclusVpcs = cloneDeep(this.data.vclusVpcs);
    this.cleanProps();
  }

  cleanProps() {
    this.vclusVpcs.forEach(vpc => {
      delete vpc.id;
      vpc.subnets.forEach(subnet => {
        delete subnet.id;
        delete subnet.uniqueId;
        // delete subnet.acceptedSubnetConnections;
        subnet.instances.forEach(instance => {
          delete instance.id;
          delete instance.isNew;
          delete instance.keyPairOption;
          delete instance.state;
          delete instance.uniqueId;
          instance.interconnections.inboundRules.forEach(ir => {
            delete ir.id;
            delete ir.uniqId;
            delete ir.sourceVpcId;
            delete ir.sourceSubnetId;
            delete ir.sourceInstanceId;
            delete ir.sourceInstanceUniqueId;
          })
        })
      })
    })
  }

  closeModal() {
    this.onClose.emit();
  }
}
