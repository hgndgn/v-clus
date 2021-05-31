import { AwsSecurityGroupRule } from './AwsSecurityGroupRule';
export class AwsSecurityGroupOutboundRule extends AwsSecurityGroupRule {
  destination: string = '';

  constructor(response?: any) {
    super(response);
  }
}