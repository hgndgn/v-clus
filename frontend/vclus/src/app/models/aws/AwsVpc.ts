export class AwsVpc {
  name: string;
  id: string;
  state: string;
  ipv4Cidr: string[] = [];
  routeTable: string;
  tenancy: string;
  isDefaultVpc: boolean;

  constructor(response?: any) {
    if (response) {
      this.id = response.VpcId;
      this.state = response.State;
      this.isDefaultVpc = response.IsDefault;
      this.tenancy = response.InstanceTenancy;
      response.CidrBlockAssociationSet.forEach(e => {
        this.ipv4Cidr.push(e.CidrBlock);
      });

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
