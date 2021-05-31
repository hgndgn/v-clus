import { SecurityGroupInboundRule } from './../helper_models';

export class VClusInterconnections {
  securityGroupName: string = "";
  securityGroupDescription: string = "";
  inboundRules: SecurityGroupInboundRule[] = [];
}