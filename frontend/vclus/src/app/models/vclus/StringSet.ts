export class StringSet {
  private strings: Set<string> = new Set();

  constructor(values?: string[]) {
    this.strings = new Set(values);
  }

  public add(cidr: string): string[] {
    const res = this.strings.add(cidr);
    return [...res];
  }

  public delete(cidr: string): void {
    this.strings.delete(cidr);
  }

  public set(values: string[]) {
    this.strings = new Set(values);
  }

  public get values(): string[] {
    return [...this.strings.values()];
  }

  public get size(): number {
    return this.strings.size;
  }

  public has(cidr: string) {
    return this.strings.has(cidr)
  }
}