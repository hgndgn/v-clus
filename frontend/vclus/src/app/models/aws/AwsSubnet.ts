import { isValidCidrBlock } from "../../app.utils";

export class AwsSubnet {
  id: any = undefined;
  name: string = undefined;
  state: string = undefined;
  availabilityZone: string = undefined;
  availableIpAddressCount: number = undefined;
  vpcId: string = undefined;
  ipv4Cidr: string = undefined;
  isDefaultSubnet: boolean = undefined;

  constructor(response?: any) {
    if (response) {
      this.id = response.SubnetId;
      this.state = response.State;
      this.vpcId = response.VpcId;
      this.ipv4Cidr = response.CidrBlock;
      this.availableIpAddressCount = response.AvailableIpAddressCount;
      this.isDefaultSubnet = response.DefaultForAz;
      this.availabilityZone = response.AvailabilityZone;

      let tags = response['Tags'];

      switch (tags) {
        case undefined:
          this.name = '';
          break;
        default:
          if (tags[0].Value.length > 0) {
            this.name = tags[0].Value;
          } else {
            this.name = '';
          }
      }
    }
  }
}

export class AwsSubnetCustom extends AwsSubnet {
  cidrIp: string;
  cidrSize: string;
  cidr: string;

  constructor() {
    super();
    super.name = "";
  }

  getCidr() {
    return `${this.cidrIp}/${this.cidrSize}`;
  }

  hasValidCidr() {
    return isValidCidrBlock(this.cidrIp + "/" + this.cidrSize);
  }
}