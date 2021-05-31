import { VClusInstance, VClusSubnet, VClusVpc } from './../models/vclus';

import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { isInteger } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class VClusService {
  private init: VClusVpc[] = [];
  public vpcs = new BehaviorSubject(this.init);

  constructor() { }

  addNewVpc(vpc: VClusVpc) {
    const vpcs = this.vpcs.value;
    this.vpcs.next([...vpcs, vpc]);
    return vpc;
  }

  addNewSubnet(vpcId: string) {
    const vpc = this._getVpc(vpcId)
    const added = vpc.addNewSubnet(vpc.cidr);
    this.vpcs.next(this.vpcs.value);
    return added;
  }

  addNewInstance(vpcId: string, subnet: VClusSubnet) {
    const vpc = this._getVpc(vpcId);
    const added = vpc.addNewInstance(subnet);
    this.vpcs.next(this.vpcs.value);
    return added;
  }

  getSubnet(vpcId: string, subnetId: string) {
    const vpc = this._getVpc(vpcId);
    return vpc.getSubnet(subnetId);
  }

  getVpc(vpcId: string) {
    return this._getVpc(vpcId);
  }

  removeInstance(vpcId: string, subnetId: string, instance: VClusInstance) {
    let idx = -1;

    this.vpcs.value.forEach(vpc => {
      vpc.subnets.forEach((s, _idx) => {
        if (s.id == subnetId) {
          idx = _idx;
        }
        s.instances.forEach(i => {
          i.interconnections.inboundRules = i.interconnections.inboundRules.filter(r => r.sourceInstanceUniqueId != instance.uniqueId);
        });
      });
    })
    const vpc = this._getVpc(vpcId);
    const subnet = vpc.subnets[idx];
    subnet.removeInstance(instance.uniqueId);
    this.vpcs.next(this.vpcs.value);
  }

  removeSubnet(vpcId: string, subnet: VClusSubnet) {
    this.vpcs.value.forEach(vpc => {
      vpc.subnets.forEach(s => {
        s.instances.forEach(i => {
          const condition = (ir) => ir.sourceVpcId == vpcId && ir.sourceSubnetId != subnet.id;
          i.interconnections.inboundRules = i.interconnections.inboundRules.filter(condition);
        })
      });
    });
    const subnetToDelete = this._getSubnet(subnet.id);
    subnetToDelete.instances.forEach(i => this.removeInstance(subnet.vpcId, subnet.id, i));
    const vpc = this._getVpc(vpcId);
    vpc.removeSubnet(subnet.id);
    this.vpcs.next(this.vpcs.value);
  }

  removeVpc(vpcId: string) {
    const vpc = this.vpcs.value.find(vpc => vpc.id == vpcId);
    vpc.subnets.forEach(s => this.removeSubnet(vpc.id, s));
    const vpcs = this.vpcs.value.filter(vpc => vpc.id != vpcId);
    this.vpcs.next(vpcs);
  }

  updateInstance(updated?: VClusInstance) {
    const vpc = this._getVpc(updated.vpcId);
    vpc.updateInstance(updated);
    this.vpcs.next(this.vpcs.value);
  }

  updateSubnet(vpcId: string, updated: VClusSubnet) {
    const vpc = this._getVpc(vpcId);
    vpc.updateSubnet(updated);
    this.vpcs.next(this.vpcs.value);
  }

  updateVpc(updated: VClusVpc) {
    this._updateVpc(updated);
    this.vpcs.next(this.vpcs.value);
  }

  getInstanceImageIdErrors(vpcs: VClusVpc[]) {
    const imageIdErrors: any = {};

    vpcs.forEach(vpc => {
      vpc.subnets.forEach(s => {
        s.instances.forEach(i => {
          if (!i.imageId) {
            const vpc = isInteger(+i.vpcId) ? "Vpc-" + i.vpcId : i.vpcId;
            const subnet = isInteger(+i.subnetId) ? "Subnet-" + i.subnetId : i.subnetId;
            const instance = "Instance-" + i.id;
            imageIdErrors[vpc] = imageIdErrors[vpc] ? imageIdErrors[vpc] : {};
            imageIdErrors[vpc][subnet] = imageIdErrors[vpc][subnet] ? imageIdErrors[vpc][subnet] : [];
            if (!imageIdErrors[vpc][subnet].includes(instance)) {
              imageIdErrors[vpc][subnet].push(instance);
            }
          }
        });
      });
    });

    return imageIdErrors;
  }

  private _updateVpc(updated: VClusVpc) {
    for (let v = 0; v < this.vpcs.value.length; v++) {
      let vpc = this.vpcs.value[v];
      if (vpc.id == updated.id) {
        vpc = updated;
        break;
      }
    }

    this.vpcs.next(this.vpcs.value);
  }

  private _getVpc(vpcId: string) {
    const vpcs = this.vpcs.value;
    return vpcs.find(vpc => vpc.id == vpcId);
  }

  private _getSubnet(subnetId: string) {
    const vpcs = this.vpcs.value;
    for (let i = 0; i < vpcs.length; i++) {
      const vpc = vpcs[i];
      const subnet = vpc.subnets.find(s => s.id == subnetId);
      if (subnet && subnet.id == subnetId) {
        return subnet;
      }
    }
  }
}
