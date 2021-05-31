import { SecurityGroupInboundRule } from '../helper_models';
import { SecurityGroupRule } from './../SecurityGroupRule';
import { VClusInstance } from './VClusInstance';
import { VClusSubnet } from './VClusSubnet';
import { trimStrings } from '@app/app.utils';

export class VClusVpc {
  public id: string = "";
  public name: string = "";
  public cidr: string = "";
  public vpcCidrSizes: string[] = [];
  public hasValidCidr: boolean = true;

  private subnetCounter = 1;
  private instanceCounter = 1;

  public subnets: VClusSubnet[] = [];

  constructor(id: string, name: string, isAws: boolean = false) {
    const sizeTop = 16;     // 2^(32 - 16) possible ips
    const sizeBottom = 28;  // 2^(32 - 28) possible ips
    for (let i = sizeTop; i <= sizeBottom; i++) {
      this.vpcCidrSizes.push(i.toString())
    }

    this.cidr = '10.0.0.0/16';
    this.id = id;
    if (isAws) {
      this.name = id;
    } else {
      this.name = name + ' - ' + id;
    }
  }

  static getEmptyVpc() {
    const vpc = new VClusVpc("", "");
    const subnet = new VClusSubnet("", "", "");
    const instance = new VClusInstance();
    const ir = new SecurityGroupInboundRule();
    const sr = new SecurityGroupRule();
    Object.assign(ir, sr);

    instance.interconnections.inboundRules.push(ir);
    subnet.instances.push(instance);
    // subnet.acceptedSubnetConnections.push({ cidr: "", uniqueId: "" })
    subnet.acceptedSubnetCidrs.push("");
    vpc.subnets.push(subnet);
    return vpc;
  }

  addNewSubnet(vpcCidr: string) {
    if (!this.hasValidCidr) {
      return;
    }

    const id = (this.subnetCounter++).toString();
    const vclusSubnet = new VClusSubnet(id, vpcCidr, vpcCidr);
    vclusSubnet.vpcId = this.id;
    this.subnets.push(vclusSubnet);
    return vclusSubnet;
  }

  updateSubnet(updated: VClusSubnet) {
    const subnet = this.subnets.find(s => s.id == updated.id);

    // if (subnet.cidr != updated.cidr) {
    //   this.existingSubnetCidrs.add(updated.cidr);
    //   this.existingSubnetCidrs.delete(subnet.cidr);
    // }

    subnet.cidr = updated.getCidr();
    subnet.cidrIp = updated.cidrIp;
    subnet.cidrSize = updated.cidrSize;
    subnet.name = updated.name;
    subnet.acceptedSubnetCidrs = updated.acceptedSubnetCidrs;
  }

  addNewInstance(subnet: VClusSubnet) {
    const instance = new VClusInstance();
    instance.id = (this.instanceCounter++).toString();
    instance.vpcId = this.id;
    instance.subnetId = subnet.id;
    subnet.instances.push(instance);
    return instance;
  }

  updateInstance(instance: VClusInstance) {
    const subnet = this.subnets.find(s => s.id == instance.subnetId);
    for (let i = 0; i < subnet.instances.length; i++) {
      const instanceId = subnet.instances[i].id;
      if (instanceId == instance.id) {
        subnet.instances[i] = instance;
      }
    }
  }

  getSubnet(id: string) {
    return this.subnets.find(s => s.id == id);
  }

  removeSubnet(id: string) {
    this.subnets = this.subnets.filter(s => s.id != id);
  }


  updateCidrsOfCurrentSubnets() {
    this.subnets.forEach(s => {
      s.vpcCidr = this.cidr;
      s.cidrIp = this.cidr.split("/")[0];
      s.cidrSize = this.cidr.split("/")[1];
    });
  }

  static prepareForSubmit(vpc: VClusVpc) {
    delete vpc.vpcCidrSizes;
    delete vpc.hasValidCidr;
    delete vpc.subnetCounter;
    delete vpc.instanceCounter;
    trimStrings(vpc);

    vpc.subnets.forEach(s => {
      VClusSubnet.prepareForSubmit(s);
      s.instances.forEach(i => VClusInstance.prepareForSubmit(i));
    })
  }
}