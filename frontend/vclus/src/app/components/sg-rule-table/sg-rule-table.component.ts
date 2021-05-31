import { Component, Input, OnInit } from '@angular/core';

import { SecurityGroupRule } from '@models/SecurityGroupRule';

@Component({
  selector: 'sg-rule-table',
  templateUrl: './sg-rule-table.component.html',
  styleUrls: ['./sg-rule-table.component.scss'],
})
export class SgRuleTableComponent implements OnInit {
  @Input('rules') rules: SecurityGroupRule[];
  @Input('ruleType') ruleType: string;

  constructor() { }

  ngOnInit() { }

  remove(r: any) {
    const idx = this.rules.findIndex((e: any) => e['id'] === r.id);
    this.rules.splice(idx, 1);
  }
}
