import { isInteger } from 'lodash';

export class SecurityGroupRule {
  id: number = -1;
  name: string = "";
  protocol: string = "";
  fromPort: number = -1;
  toPort: number = -1;
  source: string = '';
  destination: string = '';
  description: string = '';

  public isCustom() {
    return this.name.toLowerCase().startsWith('custom');
  }

  public isValidFromPort(): boolean {
    if (!this.isValidRange()) return false;
    return this.isValidPort(this.fromPort);
  }

  public isValidToPort(): boolean {
    if (!this.isValidRange()) return false;
    return this.isValidPort(this.toPort);
  }

  private isValidRange() {
    return this.fromPort <= this.toPort;
  }

  public isValidPort(value: number): boolean {
    if (!isInteger(value)) return false;

    if (value < 0 || value > 65535) {
      return false;
    }

    return value >= 0;
  }
}