export class AwsInstance {
  id: string;
  name: string;
  type: string;
  imageId: string;
  state: string;
  zone: string;
  publicDnsName: string;
  privateDnsName: string;
  publicIpAddress: string;
  privateIpAddress: string;
  keyname: string;
  launchTime: string;
  subnetId: string;
  vpcId: string;

  constructor(response?: any) {
    this.id = response.InstanceId;
    this.type = response.InstanceType;
    this.imageId = response.ImageId;
    this.state = response.State.Name;
    this.zone = response.Placement.AvailabilityZone;
    this.keyname = response.KeyName;
    this.launchTime = response.LaunchTime;
    this.privateIpAddress = response.PrivateIpAddress;
    this.privateDnsName = response.PrivateDnsName;

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

    if (this.state === 'running') {
      this.publicDnsName = response.PublicDnsName;
      this.publicIpAddress = response.PublicIpAddress;
    }

    if (this.state !== 'terminated' && this.state !== 'shutting-down') {
      this.subnetId = response.NetworkInterfaces[0].SubnetId;
      this.vpcId = response.VpcId;
    }
  }
}
