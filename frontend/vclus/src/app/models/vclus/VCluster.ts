import { VClusVpc } from '@models/vclus';

export class VCluster {
  id: number
  name: string
  description: string
  createDate: string
  vclusVpcs: VClusVpc[] = [];
}