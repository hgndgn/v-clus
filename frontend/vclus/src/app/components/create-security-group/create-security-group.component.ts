import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';

import { ClientError } from '@models/ClientError';
import { NgForm } from '@angular/forms';
import ProtocolTypes from '@assets/sg-protocol-types';
import { RuleTab } from '@models/helper_models';
import { SecurityGroupRule } from '@models/SecurityGroupRule';
import { SecurityGroupService } from '@core/services/security-group.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'create-security-group',
  templateUrl: './create-security-group.component.html',
  styleUrls: ['./create-security-group.component.scss'],
})
export class CreateSecurityGroupComponent implements OnInit {
  @Input() vpcIds: string[];

  @Output() onSuccess = new EventEmitter();

  readonly sgService: SecurityGroupService;
  readonly toastr: ToastrService;
  readonly protocols = ProtocolTypes as SecurityGroupRule[];

  ruleTab: RuleTab = RuleTab.INBOUND;
  inboundRules: SecurityGroupRule[] = [];
  outboundRules: SecurityGroupRule[] = [];

  currentRule: SecurityGroupRule = new SecurityGroupRule();
  isValidPortRange = true;
  currentVpc: string;
  groupName: string;
  groupDescription: string;

  constructor(i: Injector) {
    this.sgService = i.get(SecurityGroupService);
    this.toastr = i.get(ToastrService);
  }

  ngOnInit() {
    Object.assign(this.currentRule, this.protocols[0]);
    this.currentVpc = this.vpcIds[0];
  }

  addRule() {
    if (this.ruleTab === RuleTab.INBOUND) {
      if (this.doesRuleExists(this.inboundRules, this.currentRule)) {
        this.toastr.warning('This rule exists already');
        return;
      }
      this.currentRule.destination = '';
      this.inboundRules = [
        ...this.inboundRules,
        Object.assign({}, this.currentRule),
      ];
    } else {
      if (this.doesRuleExists(this.outboundRules, this.currentRule)) {
        this.toastr.warning('This rule exists already');
        return;
      }
      this.currentRule.source = '';
      this.outboundRules = [
        ...this.outboundRules,
        Object.assign({}, this.currentRule),
      ];
    }
  }

  private doesRuleExists(
    securityRules: SecurityGroupRule[],
    rule: SecurityGroupRule,
  ) {
    return securityRules.find(
      (r) =>
        r.fromPort === rule.fromPort &&
        r.toPort === rule.toPort &&
        r.protocol === rule.protocol,
    );
  }

  /** --------- HELPER METHODS --------- **/

  canAddRule(f: NgForm) {
    const source = f.form.controls['source'];
    const description = f.form.controls['description'];
    const destination = f.form.controls['destination'];

    if (this.ruleTab === RuleTab.INBOUND) {
      return (description && description.invalid) || (source && source.invalid);
    }

    return description.invalid || destination.invalid;
  }

  /** --------- ON ACTION METHODS --------- **/

  onProtocolChange(protocol: string) {
    const p = this.protocols.find((p) => p['name'] === protocol);
    Object.assign(this.currentRule, p);
  }

  onRuleTabChange(value) {
    if (value === 1)
      this.ruleTab = RuleTab.INBOUND;
    else
      this.ruleTab = RuleTab.OUTBOUND;
  }

  onVpcChange(value: string) {
    this.currentVpc = value;
  }

  onSubmit(f: NgForm) {
    if (f.invalid) {
      return;
    }

    const emptyRules =
      this.inboundRules.length == 0 && this.outboundRules.length == 0;

    this.toastr.info('Creating Security Group…');

    if (emptyRules) {
      this.sgService
        .createGroup(this.groupName, this.groupDescription, this.currentVpc)
        .subscribe((res) => {
          if (res instanceof ClientError)
            this.toastr.error(res.message, res.title);
          else {
            this.toastr.success('Security Group Created');
            this.onSuccess.emit();
          }
        });
    } else {
      const group = {
        name: this.groupName,
        description: this.groupDescription,
        vpcId: this.currentVpc,
      };

      this.sgService
        .createGroupWithRules(group, this.inboundRules, this.outboundRules)
        .subscribe((res) => {
          if (res instanceof ClientError)
            this.toastr.error(res.message, res.title);
          else {
            this.toastr.success('Security Group Created');
            this.onSuccess.emit();
          }
        });
    }
  }
}
