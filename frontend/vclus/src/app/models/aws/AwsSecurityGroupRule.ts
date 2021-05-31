export class AwsSecurityGroupRule {
  id: string = '';
  fromPort: number = undefined;
  toPort: number = undefined;
  protocol: string = undefined;
  cidrIp: string = '';

  constructor(response?: any) {
    if (response) {
      this.fromPort = response.FromPort;
      this.toPort = response.ToPort;
      this.protocol = response.IpProtocol;
      this.cidrIp = response.IpRanges[0].CidrIp;
    }
  }
}