import { isValidCidrBlock, trimStrings } from '@app/app.utils';

import { AwsSubnet } from './../aws/AwsSubnet';
import { UUID } from 'angular2-uuid';
import { VClusInstance } from './VClusInstance';
import { sum } from 'lodash';

export class VClusSubnet extends AwsSubnet {
  public uniqueId: string = "";
  public id: string = "";
  public vpcId: string = "";
  public cidr: string = "";
  public cidrIp: string = "10.0.0.0";
  public cidrSize: string = "16";
  public name: string = "";
  public vpcCidr: string = "";
  public instances: VClusInstance[] = [];
  public acceptedSubnetCidrs: string[] = [];

  constructor(id: string, cidr: string, vpcCidr: string, private isAws: boolean = false) {
    super();
    this.uniqueId = UUID.UUID();
    this.id = id;
    this.vpcCidr = vpcCidr;
    if (isAws) {
      this.name = id;
      this.cidr = cidr;
    } else {
      this.cidr = this.getCidr();
      this.name = "Subnet-" + id;
    }
  }

  static prepareForSubmit(s: VClusSubnet) {
    delete s.state;
    delete s.availabilityZone;
    delete s.availableIpAddressCount;
    delete s.ipv4Cidr;
    delete s.isDefaultSubnet;
    trimStrings(s);

    // if (!s.isAws) {
    //   s.acceptedSubnetCidrs = s.acceptedSubnetConnections.map(con => con.cidr);
    // }
    // delete s.acceptedSubnetConnections;
  }

  hasValidCidr() {
    return isValidCidrBlock(this.cidrIp + "/" + this.cidrSize);
  }

  getCidr() {
    return `${this.cidrIp}/${this.cidrSize}`;
  }

  getInstance(uniqueId: string) {
    return this.instances.find(i => i.uniqueId == uniqueId);
  }

  getTotalInstanceAmount() {
    return sum(this.instances.map(i => i.amount));
  }

  removeInstance(uniqueId: string) {
    this.instances = this.instances.filter(i => i.uniqueId != uniqueId);
  }

  acceptSubnetCidr(cidr: string) {
    if (this.acceptedSubnetCidrs.includes(cidr)) return false;
    return this.acceptedSubnetCidrs.push(cidr);
  }
  // acceptSubnetCidr(subnet: VClusSubnet) {
  //   if (!(subnet instanceof VClusSubnet)) return;
  //   const subnetCidr = subnet.getCidr();
  //   const exists = this.acceptedSubnetConnections.find(s => s.cidr == subnetCidr);
  //   if (!exists) {
  //     const cidr = subnet.getCidr()
  //     const uniqueId = subnet.uniqueId;
  //     this.acceptedSubnetConnections.push({ cidr, uniqueId });
  //     return true;
  //   }
  //   return false;
  // }

  removeAcceptedSubnetCidr(cidr: string) {
    this.acceptedSubnetCidrs = this.acceptedSubnetCidrs.filter(c => c != cidr);
    // this.acceptedSubnetConnections = this.acceptedSubnetConnections.filter(s => s.cidr != cidr);
  }
}
