import { KeyPairOption } from '@models/KeyPair';
import { SecurityGroupInboundRule } from '../helper_models';
import { UUID } from 'angular2-uuid';
import { VClusInterconnections } from './VClusInterconnections';
import { toInteger } from 'lodash';
import { trimStrings } from '@app/app.utils';

export class VClusInstance {
  amount: number = 1;
  imageId: string = '';
  isNew: boolean = true;
  securityGroups: string[] = [];
  keyname: string = KeyPairOption.DEFAULT;
  keyPairOption: string = KeyPairOption.DEFAULT;
  state?: string = 'undefined';
  type: string = 't2.micro';

  id: string = "";
  uniqueId: string = "";
  subnetId: string = "";
  vpcId: string = "";
  interconnections: VClusInterconnections = new VClusInterconnections();

  constructor() {
    this.uniqueId = UUID.UUID();
  }

  static prepareForSubmit(i: VClusInstance) {
    delete i.isNew;
    delete i.state;
    i.amount = toInteger(i.amount);
    trimStrings(i);
  }

  get name() {
    return "Instance-" + this.id;
  }

  isValidAmount() {
    return this.amount >= 1 && this.amount <= 20
  }

  addInboundRule(rule: SecurityGroupInboundRule) {
    // rule.sourceInstanceUniqueId = this.uniqueId;
    const exists = this.interconnections.inboundRules.find(
      ({ sourceInstanceId }) => sourceInstanceId == rule.sourceInstanceId
    );

    // rule check
    if (!exists) {
      this.interconnections.inboundRules.push(rule);
      return true;
    }

    // port check
    const existingRulesOfSourceInstanceId = this.interconnections.inboundRules.filter(
      ({ sourceInstanceId, sourceSubnetId, sourceVpcId }) => (
        sourceInstanceId == rule.sourceInstanceId &&
        sourceSubnetId == rule.sourceSubnetId &&
        sourceVpcId == rule.sourceVpcId
      )
    );

    const checkProtocol = existingRulesOfSourceInstanceId.find(
      ({ fromPort, toPort, protocol }) =>
        fromPort == rule.fromPort &&
        toPort == rule.toPort &&
        protocol == rule.protocol
    );

    if (!checkProtocol) {
      this.interconnections.inboundRules.push(rule);
      return true;
    }
  }

  removeInboundRule(ruleId: string) {
    this.interconnections.inboundRules = this.interconnections.inboundRules.filter(
      ({ uniqId }) => uniqId !== ruleId,
    );
  }
}
