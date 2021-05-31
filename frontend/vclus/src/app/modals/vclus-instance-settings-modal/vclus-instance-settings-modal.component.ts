import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { AwsInstanceType, AwsSecurityGroup } from '@models/aws';
import {
  Ec2SettingsTab,
  SecurityGroupInboundRule
} from '@models/helper_models';
import { KeyPair, KeyPairOption } from '@models/KeyPair';
import { VClusInstance, VClusSubnet, VClusVpc } from '@models/vclus';

import { AwsInstanceTypes } from '@assets/AwsInstanceTypes';
import ProtocolTypes from '@assets/sg-protocol-types';
import { Subscription } from 'rxjs';
import { UUID } from 'angular2-uuid';
import { VClusService } from '../../services/vclus.service';
import { cloneDeep } from 'lodash';
import { closeOnEscapeClicked } from '@app/app.utils';
import { untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'vclus-instance-settings-modal',
  templateUrl: './vclus-instance-settings-modal.component.html',
  styleUrls: ['./vclus-instance-settings-modal.component.scss'],
})
export class VClusInstanceSettingsModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input('instance') inputInstance: VClusInstance;
  @Input() keyPairs: KeyPair[];

  @Input() isAwsInstance?: boolean;
  @Input() securityGroups?: AwsSecurityGroup[];

  @Output('onClose') onCloseEmit = new EventEmitter<{
    updated: VClusInstance;
    old: VClusInstance;
  }>();

  tab = Ec2SettingsTab;
  keyPairOption = KeyPairOption;
  toggleQuickView: boolean = false;

  readonly protocols = ProtocolTypes;
  readonly awsInstanceTypes = AwsInstanceTypes as AwsInstanceType[];
  readonly keyPairOptions: { key: string; value: string }[] = [
    {
      key: 'CREATE',
      value: 'Create a new key pair',
    },
    {
      key: 'SELECT',
      value: 'Select an existing key pair',
    },
    {
      key: 'NO_KEY_PAIR',
      value: 'Proceed without a key pair',
    },
  ];

  activeTab: Ec2SettingsTab = Ec2SettingsTab.SETTINGS;

  instance: VClusInstance;
  vpcs: VClusVpc[];

  isValidPortRange: boolean = true;
  interConnectionRule: SecurityGroupInboundRule =
    new SecurityGroupInboundRule();
  subnetsOfSelectedVpc: VClusSubnet[];
  instancesOfSelectedSubnet: VClusInstance[];
  securityGroupName: string;
  securityGroupDescription: string;

  interconnections: {
    vpcId: string;
    vpcName: string;
    subnets?: {
      subnetId: string;
      subnetName: string;
      instances: {
        instanceId: string;
        rules?: SecurityGroupInboundRule[];
      }[];
    }[];
  }[] = [];

  subscription: Subscription;

  constructor(
    private vclusService: VClusService,
    private cdr: ChangeDetectorRef,
  ) {
    closeOnEscapeClicked(window, this.onCloseEmit);
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {}

  ngOnInit() {
    this.vclusService.vpcs
      .pipe(untilDestroyed(this, 'ngOnDestroy'))
      .subscribe((vpcs) => {
        this.vpcs = vpcs;
      });

    this.instance = cloneDeep(this.inputInstance);
    Object.assign(this.interConnectionRule, this.protocols[0]);
    this.updateRules();
    this.toggleQuickView = true;
  }

  addInboundRule() {
    this.interConnectionRule.uniqId = UUID.UUID().substr(0, 10);
    const rule: SecurityGroupInboundRule = JSON.parse(
      JSON.stringify(this.interConnectionRule),
    );
    const added = this.instance.addInboundRule(rule);
    if (added) {
      this.updateRules();
    }
  }

  changeKeyPairOption(value: string) {
    const option = this.keyPairOptions.find((k) => k.value == value).key;
    this.instance.keyPairOption = option;

    switch (option) {
      case KeyPairOption.CREATE:
        this.instance.keyname = '';
        this.instance.keyPairOption = KeyPairOption.CREATE;
        break;
      case KeyPairOption.SELECT:
        this.instance.keyname =
          this.keyPairs.length > 0 ? this.keyPairs[0].KeyName : '';
        this.instance.keyPairOption = KeyPairOption.SELECT;
        break;
      default:
        this.instance.keyname = KeyPairOption.DEFAULT;
        this.instance.keyPairOption = KeyPairOption.DEFAULT;
    }
  }

  getInstancesOfSubnet(subnetId: string) {
    const subnet = this.subnetsOfSelectedVpc.find((s) => s.id == subnetId);
    if (subnet) {
      return subnet.instances;
    }
    return [];
  }

  getSubnetsOfVpc(vpcId: string) {
    const vpc = this.vpcs.find((vpc) => vpc.id == vpcId);
    if (vpc) {
      return vpc.subnets;
    }
    return [];
  }

  removeInboundRule(rule: SecurityGroupInboundRule) {
    this.instance.removeInboundRule(rule.uniqId);
    this.updateRules();
  }

  setSourceVpcId(vpcId: string) {
    const vpc = this.vpcs.find((vpc) => vpc.id == vpcId);
    this.subnetsOfSelectedVpc = this.getSubnetsOfVpc(vpcId);

    this.interConnectionRule.sourceVpcId = vpcId;
    this.interConnectionRule.sourceVpcName = vpc.name;
    this.interConnectionRule.sourceSubnetId = '';
    this.interConnectionRule.sourceInstanceId = '';
  }

  setSourceSubnetId(subnetId: string) {
    const vpc = this.vpcs.find(
      (vpc) => vpc.id == this.interConnectionRule.sourceVpcId,
    );
    const subnet = vpc.subnets.find((s) => s.id == subnetId);

    this.interConnectionRule.sourceSubnetId = subnetId;
    this.interConnectionRule.sourceSubnetName = subnet.name;
    this.instancesOfSelectedSubnet = this.getInstancesOfSubnet(subnetId);
  }

  setSourceInstanceId(instanceUniqueId: string) {
    const vpc = this.vclusService.vpcs
      .getValue()
      .find((vpc) => vpc.id == this.interConnectionRule.sourceVpcId);
    for (let i = 0; i < vpc.subnets.length; i++) {
      const subnet = vpc.subnets.find(
        (s) => s.id == this.interConnectionRule.sourceSubnetId,
      );
      if (subnet) {
        const instance = subnet.instances.find(
          (i) => i.uniqueId == instanceUniqueId,
        );
        if (instance) {
          this.interConnectionRule.sourceInstanceId = instance.id;
          this.interConnectionRule.sourceInstanceUniqueId = instance.uniqueId;
          break;
        }
      }
    }
  }

  setProtocol(protocolName: string) {
    const p = this.protocols.find((p) => p['name'] == protocolName);
    Object.assign(this.interConnectionRule, p);
  }

  toggleSecurityGroup(groupId: string) {
    if (this.instance.securityGroups.includes(groupId)) {
      this.instance.securityGroups = this.instance.securityGroups.filter(
        (id) => id != groupId,
      );
    } else {
      this.instance.securityGroups.push(groupId);
    }
  }

  updateRules() {
    this.interconnections = [];

    // VPCs
    this.instance.interconnections.inboundRules.forEach((rule) => {
      if (
        !this.interconnections.find((ico) => {
          return ico.vpcId == rule.sourceVpcId;
        })
      )
        this.interconnections.push({
          vpcId: rule.sourceVpcId,
          vpcName: rule.sourceVpcName,
          subnets: [],
        });
    });
    // SUBNETs
    this.instance.interconnections.inboundRules.forEach((rule) => {
      const vpc = this.interconnections.find(
        (ico) => ico.vpcId == rule.sourceVpcId,
      );
      if (!vpc.subnets.find((s) => s.subnetId == rule.sourceSubnetId))
        vpc.subnets.push({
          subnetId: rule.sourceSubnetId,
          subnetName: rule.sourceSubnetName,
          instances: [],
        });
    });
    // INSTANCEs
    this.instance.interconnections.inboundRules.forEach((rule) => {
      const vpc = this.interconnections.find(
        (ico) => ico.vpcId == rule.sourceVpcId,
      );
      const subnet = vpc.subnets.find((s) => s.subnetId == rule.sourceSubnetId);
      if (!subnet.instances.find((i) => i.instanceId == rule.sourceInstanceId))
        subnet.instances.push({
          instanceId: rule.sourceInstanceId,
          rules: [],
        });
    });
    // RULEs
    this.instance.interconnections.inboundRules.forEach((rule) => {
      const vpc = this.interconnections.find(
        (ico) => ico.vpcId == rule.sourceVpcId,
      );
      const subnet = vpc.subnets.find((s) => s.subnetId == rule.sourceSubnetId);
      const instance = subnet.instances.find(
        (i) => i.instanceId == rule.sourceInstanceId,
      );
      instance.rules.push(rule);
    });
  }

  amountExceeded = 0;

  onClose(cancelled: boolean = false) {
    if (cancelled) {
      this.onCloseEmit.emit();
      return;
    }

    this.onCloseEmit.emit({ updated: this.instance, old: this.inputInstance });
  }
}
