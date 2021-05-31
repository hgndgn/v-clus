import { Component } from '@angular/core';
import ProtocolTypes from '@assets/sg-protocol-types';
import { SecurityGroupRule } from '@models/SecurityGroupRule';

@Component({
  selector: 'sg-rule-protocols',
  templateUrl: './sg-rule-protocols.component.html',
  styleUrls: ['./sg-rule-protocols.component.scss'],
})
export class SgRuleProtocolsComponent {
  readonly protocols = ProtocolTypes as SecurityGroupRule[];

  constructor() {}
}
