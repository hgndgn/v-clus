import { AwsSecurityGroupRule } from './AwsSecurityGroupRule';
export class AwsSecurityGroupInboundRule extends AwsSecurityGroupRule {
  source: string = '';

  constructor(response?: any) {
    super(response);
  }
}