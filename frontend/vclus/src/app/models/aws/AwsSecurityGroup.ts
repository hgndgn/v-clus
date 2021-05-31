import { AwsSecurityGroupInboundRule } from './AwsSecurityGroupInboundRule';
import { AwsSecurityGroupOutboundRule } from './AwsSecurityGroupOutboundRule';

export class AwsSecurityGroup {
  id: string;
  name: string;
  description: string;
  tag: string;
  vpcId: string;
  inboundRules: AwsSecurityGroupInboundRule[];
  outboundRules: AwsSecurityGroupOutboundRule[];

  constructor(response: any) {
    this.name = response.GroupName;
    this.id = response.GroupId;
    this.description = response.Description;
    this.vpcId = response.VpcId;

    let tags = response['Tags'];

    if (tags !== undefined) {
      if (tags[0].Value.length > 0) {
        this.tag = tags[0].Value;
      } else {
        this.tag = '';
      }
    }
  }
}
