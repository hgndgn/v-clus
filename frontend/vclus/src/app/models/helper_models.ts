import { AwsSecurityGroup } from './aws';
import { SecurityGroupRule } from './SecurityGroupRule';

export class SecurityGroupsOfInstances {
  vpcId: string;
  instanceId: string;
  securityGroups: AwsSecurityGroup[]
}

export interface SubnetWithInstances {
  subnet?: string | any;
  instances?: any[];
}

export interface VpcWithSubnets {
  vpcId?: string;
  subnetsWithInstances?: SubnetWithInstances[];
}

export interface Ec2Info {
  name: string;
  apiName: string;
  memory: string;
  storage: string;
}

export class Ec2Drag {
  id: number = 0;
  imageId: string = '';
  vpcId: string = '';
  securityGroups: string[] = [];
  initialSecurityGroups: string[] = [];
  subnetId: string = '';
  keyname = '';
  keyPairOption = '';
  amount: number = 1;
  type: string = 't2.micro';
}

export class SecurityGroupInboundRule extends SecurityGroupRule {
  uniqId: string = "";
  sourceVpcName: string = "";
  sourceSubnetName: string = "";
  sourceVpcId: string = "";
  sourceSubnetId: string = "";
  sourceInstanceId: string = "";
  sourceInstanceUniqueId: string = "";

  constructor() {
    super();
    delete this.source;
    delete this.destination;
  }
}

export enum ActiveTab {
  LIST = 1,
  CREATE,
}

export enum Ec2SettingsTab {
  SETTINGS = 1,
  INTERCONNECTIONS
}

export enum RuleTab {
  INBOUND = 1,
  OUTBOUND,
}

export type Region = {
  name: string;
  value: string;
};
