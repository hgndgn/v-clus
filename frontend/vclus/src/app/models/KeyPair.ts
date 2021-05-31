export class KeyPair {
  KeyName: string;
  KeyPairId: string;
  Tags: string[] = [];
}

export enum KeyPairOption {
  DEFAULT = 'NO_KEY_PAIR',
  CREATE = 'CREATE',
  SELECT = 'SELECT',
} 