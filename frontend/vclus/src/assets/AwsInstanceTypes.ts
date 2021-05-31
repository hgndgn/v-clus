export interface AwsInstaceType {
  name: string
  apiName: string
  memory: string
  storage: string
}

export const AwsInstanceTypes =
  [
    {
      'name': 'C1 High-CPU Medium',
      'apiName': 'c1.medium',
      'memory': '1.7 GiB',
      'storage': '350 GiB HDD + 900MB swap'
    },
    {
      'name': 'C1 High-CPU Extra Large',
      'apiName': 'c1.xlarge',
      'memory': '7.0 GiB',
      'storage': '1680 GiB (4 * 420 GiB HDD)'
    },
    {
      'name': 'C3 High-CPU Double Extra Large',
      'apiName': 'c3.2xlarge',
      'memory': '15.0 GiB',
      'storage': '160 GiB (2 * 80 GiB SSD)'
    },
    {
      'name': 'C3 High-CPU Quadruple Extra Large',
      'apiName': 'c3.4xlarge',
      'memory': '30.0 GiB',
      'storage': '320 GiB (2 * 160 GiB SSD)'
    },
    {
      'name': 'C3 High-CPU Eight Extra Large',
      'apiName': 'c3.8xlarge',
      'memory': '60.0 GiB',
      'storage': '640 GiB (2 * 320 GiB SSD)'
    },
    {
      'name': 'C3 High-CPU Large',
      'apiName': 'c3.large',
      'memory': '3.75 GiB',
      'storage': '32 GiB (2 * 16 GiB SSD)'
    },
    {
      'name': 'C3 High-CPU Extra Large',
      'apiName': 'c3.xlarge',
      'memory': '7.5 GiB',
      'storage': '80 GiB (2 * 40 GiB SSD)'
    },
    {
      'name': 'C4 High-CPU Double Extra Large',
      'apiName': 'c4.2xlarge',
      'memory': '15.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'C4 High-CPU Quadruple Extra Large',
      'apiName': 'c4.4xlarge',
      'memory': '30.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'C4 High-CPU Eight Extra Large',
      'apiName': 'c4.8xlarge',
      'memory': '60.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'C4 High-CPU Large',
      'apiName': 'c4.large',
      'memory': '3.75 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'C4 High-CPU Extra Large',
      'apiName': 'c4.xlarge',
      'memory': '7.5 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'C5 High-CPU 18xlarge',
      'apiName': 'c5.18xlarge',
      'memory': '144.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'C5 High-CPU Double Extra Large',
      'apiName': 'c5.2xlarge',
      'memory': '16.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'C5 High-CPU Quadruple Extra Large',
      'apiName': 'c5.4xlarge',
      'memory': '32.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'C5 High-CPU 9xlarge',
      'apiName': 'c5.9xlarge',
      'memory': '72.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'C5 High-CPU Large',
      'apiName': 'c5.large',
      'memory': '4.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'C5 High-CPU Extra Large',
      'apiName': 'c5.xlarge',
      'memory': '8.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'C5 High-CPU 18xlarge',
      'apiName': 'c5d.18xlarge',
      'memory': '144.0 GiB',
      'storage': '1800 GiB (2 * 900 GiB NVMe SSD)'
    },
    {
      'name': 'C5 High-CPU Double Extra Large',
      'apiName': 'c5d.2xlarge',
      'memory': '16.0 GiB',
      'storage': '200 GiB NVMe SSD'
    },
    {
      'name': 'C5 High-CPU Quadruple Extra Large',
      'apiName': 'c5d.4xlarge',
      'memory': '32.0 GiB',
      'storage': '400 GiB NVMe SSD'
    },
    {
      'name': 'C5 High-CPU 9xlarge',
      'apiName': 'c5d.9xlarge',
      'memory': '72.0 GiB',
      'storage': '900 GiB NVMe SSD'
    },
    {
      'name': 'C5 High-CPU Large',
      'apiName': 'c5d.large',
      'memory': '4.0 GiB',
      'storage': '50 GiB NVMe SSD'
    },
    {
      'name': 'C5 High-CPU Extra Large',
      'apiName': 'c5d.xlarge',
      'memory': '8.0 GiB',
      'storage': '100 GiB NVMe SSD'
    },
    {
      'name': 'Cluster Compute Eight Extra Large',
      'apiName': 'cc2.8xlarge',
      'memory': '60.5 GiB',
      'storage': '3360 GiB (4 * 840 GiB HDD)'
    },
    {
      'name': 'High Memory Cluster Eight Extra Large',
      'apiName': 'cr1.8xlarge',
      'memory': '244.0 GiB',
      'storage': '240 GiB (2 * 120 GiB SSD)'
    },
    {
      'name': 'D2 Double Extra Large',
      'apiName': 'd2.2xlarge',
      'memory': '61.0 GiB',
      'storage': '12000 GiB (6 * 2000 GiB HDD)'
    },
    {
      'name': 'D2 Quadruple Extra Large',
      'apiName': 'd2.4xlarge',
      'memory': '122.0 GiB',
      'storage': '24000 GiB (12 * 2000 GiB HDD)'
    },
    {
      'name': 'D2 Eight Extra Large',
      'apiName': 'd2.8xlarge',
      'memory': '244.0 GiB',
      'storage': '48000 GiB (24 * 2000 GiB HDD)'
    },
    {
      'name': 'D2 Extra Large',
      'apiName': 'd2.xlarge',
      'memory': '30.5 GiB',
      'storage': '6000 GiB (3 * 2000 GiB HDD)'
    },
    {
      'name': 'F1 16xlarge',
      'apiName': 'f1.16xlarge',
      'memory': '976.0 GiB',
      'storage': '3760 GiB (4 * 940 GiB NVMe SSD)'
    },
    {
      'name': 'F1 Double Extra Large',
      'apiName': 'f1.2xlarge',
      'memory': '122.0 GiB',
      'storage': '470 GiB NVMe SSD'
    },
    {
      'name': 'F1 Quadruple Extra Large',
      'apiName': 'f1.4xlarge',
      'memory': '244.0 GiB',
      'storage': '940 GiB NVMe SSD'
    },
    {
      'name': 'G2 Double Extra Large',
      'apiName': 'g2.2xlarge',
      'memory': '15.0 GiB',
      'storage': '60 GiB SSD'
    },
    {
      'name': 'G2 Eight Extra Large',
      'apiName': 'g2.8xlarge',
      'memory': '60.0 GiB',
      'storage': '240 GiB (2 * 120 GiB SSD)'
    },
    {
      'name': 'G3 16xlarge',
      'apiName': 'g3.16xlarge',
      'memory': '488.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'G3 Quadruple Extra Large',
      'apiName': 'g3.4xlarge',
      'memory': '122.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'G3 Eight Extra Large',
      'apiName': 'g3.8xlarge',
      'memory': '244.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'H1 16xlarge',
      'apiName': 'h1.16xlarge',
      'memory': '256.0 GiB',
      'storage': '16000 GiB (8 * 2000 GiB HDD)'
    },
    {
      'name': 'H1 Double Extra Large',
      'apiName': 'h1.2xlarge',
      'memory': '32.0 GiB',
      'storage': '2000 GiB HDD'
    },
    {
      'name': 'H1 Quadruple Extra Large',
      'apiName': 'h1.4xlarge',
      'memory': '64.0 GiB',
      'storage': '4000 GiB (2 * 2000 GiB HDD)'
    },
    {
      'name': 'H1 Eight Extra Large',
      'apiName': 'h1.8xlarge',
      'memory': '128.0 GiB',
      'storage': '8000 GiB (4 * 2000 GiB HDD)'
    },
    {
      'name': 'High Storage Eight Extra Large',
      'apiName': 'hs1.8xlarge',
      'memory': '117.0 GiB',
      'storage': '48000 GiB (24 * 2000 GiB HDD)'
    },
    {
      'name': 'I2 Double Extra Large',
      'apiName': 'i2.2xlarge',
      'memory': '61.0 GiB',
      'storage': '1600 GiB (2 * 800 GiB SSD)'
    },
    {
      'name': 'I2 Quadruple Extra Large',
      'apiName': 'i2.4xlarge',
      'memory': '122.0 GiB',
      'storage': '3200 GiB (4 * 800 GiB SSD)'
    },
    {
      'name': 'I2 Eight Extra Large',
      'apiName': 'i2.8xlarge',
      'memory': '244.0 GiB',
      'storage': '6400 GiB (8 * 800 GiB SSD)'
    },
    {
      'name': 'I2 Extra Large',
      'apiName': 'i2.xlarge',
      'memory': '30.5 GiB',
      'storage': '800 GiB SSD'
    },
    {
      'name': 'I3 High I/O 16xlarge',
      'apiName': 'i3.16xlarge',
      'memory': '488.0 GiB',
      'storage': '15200 GiB (8 * 1900 GiB NVMe SSD)'
    },
    {
      'name': 'I3 High I/O Double Extra Large',
      'apiName': 'i3.2xlarge',
      'memory': '61.0 GiB',
      'storage': '1900 GiB NVMe SSD'
    },
    {
      'name': 'I3 High I/O Quadruple Extra Large',
      'apiName': 'i3.4xlarge',
      'memory': '122.0 GiB',
      'storage': '3800 GiB (2 * 1900 GiB NVMe SSD)'
    },
    {
      'name': 'I3 High I/O Eight Extra Large',
      'apiName': 'i3.8xlarge',
      'memory': '244.0 GiB',
      'storage': '7600 GiB (4 * 1900 GiB NVMe SSD)'
    },
    {
      'name': 'I3 High I/O Large',
      'apiName': 'i3.large',
      'memory': '15.25 GiB',
      'storage': '475 GiB NVMe SSD'
    },
    {
      'name': 'I3 High I/O Metal',
      'apiName': 'i3.metal',
      'memory': '512.0 GiB',
      'storage': '15200 GiB (8 * 1900 GiB NVMe SSD)'
    },
    {
      'name': 'I3 High I/O Extra Large',
      'apiName': 'i3.xlarge',
      'memory': '30.5 GiB',
      'storage': '950 GiB NVMe SSD'
    },
    {
      'name': 'M1 General Purpose Large',
      'apiName': 'm1.large',
      'memory': '7.5 GiB',
      'storage': '840 GiB (2 * 420 GiB HDD)'
    },
    {
      'name': 'M1 General Purpose Medium',
      'apiName': 'm1.medium',
      'memory': '3.75 GiB',
      'storage': '410 GiB HDD'
    },
    {
      'name': 'M1 General Purpose Small',
      'apiName': 'm1.small',
      'memory': '1.7 GiB',
      'storage': '160 GiB HDD + 900MB swap'
    },
    {
      'name': 'M1 General Purpose Extra Large',
      'apiName': 'm1.xlarge',
      'memory': '15.0 GiB',
      'storage': '1680 GiB (4 * 420 GiB HDD)'
    },
    {
      'name': 'M2 High Memory Double Extra Large',
      'apiName': 'm2.2xlarge',
      'memory': '34.2 GiB',
      'storage': '850 GiB HDD'
    },
    {
      'name': 'M2 High Memory Quadruple Extra Large',
      'apiName': 'm2.4xlarge',
      'memory': '68.4 GiB',
      'storage': '1680 GiB (2 * 840 GiB HDD)'
    },
    {
      'name': 'M2 High Memory Extra Large',
      'apiName': 'm2.xlarge',
      'memory': '17.1 GiB',
      'storage': '420 GiB HDD'
    },
    {
      'name': 'M3 General Purpose Double Extra Large',
      'apiName': 'm3.2xlarge',
      'memory': '30.0 GiB',
      'storage': '160 GiB (2 * 80 GiB SSD)'
    },
    {
      'name': 'M3 General Purpose Large',
      'apiName': 'm3.large',
      'memory': '7.5 GiB',
      'storage': '32 GiB SSD'
    },
    {
      'name': 'M3 General Purpose Medium',
      'apiName': 'm3.medium',
      'memory': '3.75 GiB',
      'storage': '4 GiB SSD'
    },
    {
      'name': 'M3 General Purpose Extra Large',
      'apiName': 'm3.xlarge',
      'memory': '15.0 GiB',
      'storage': '80 GiB (2 * 40 GiB SSD)'
    },
    {
      'name': 'M4 General Purpose Deca Extra Large',
      'apiName': 'm4.10xlarge',
      'memory': '160.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'M4 General Purpose 16xlarge',
      'apiName': 'm4.16xlarge',
      'memory': '256.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'M4 General Purpose Double Extra Large',
      'apiName': 'm4.2xlarge',
      'memory': '32.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'M4 General Purpose Quadruple Extra Large',
      'apiName': 'm4.4xlarge',
      'memory': '64.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'M4 General Purpose Large',
      'apiName': 'm4.large',
      'memory': '8.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'M4 General Purpose Extra Large',
      'apiName': 'm4.xlarge',
      'memory': '16.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'M5 General Purpose 12xlarge',
      'apiName': 'm5.12xlarge',
      'memory': '192.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'M5 General Purpose 24xlarge',
      'apiName': 'm5.24xlarge',
      'memory': '384.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'M5 General Purpose Double Extra Large',
      'apiName': 'm5.2xlarge',
      'memory': '32.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'M5 General Purpose Quadruple Extra Large',
      'apiName': 'm5.4xlarge',
      'memory': '64.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'M5 General Purpose Large',
      'apiName': 'm5.large',
      'memory': '8.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'M5 General Purpose Extra Large',
      'apiName': 'm5.xlarge',
      'memory': '16.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'M5 General Purpose 12xlarge',
      'apiName': 'm5d.12xlarge',
      'memory': '192.0 GiB',
      'storage': '1800 GiB (2 * 900 GiB NVMe SSD)'
    },
    {
      'name': 'M5 General Purpose 24xlarge',
      'apiName': 'm5d.24xlarge',
      'memory': '384.0 GiB',
      'storage': '3600 GiB (4 * 900 GiB NVMe SSD)'
    },
    {
      'name': 'M5 General Purpose Double Extra Large',
      'apiName': 'm5d.2xlarge',
      'memory': '32.0 GiB',
      'storage': '300 GiB NVMe SSD'
    },
    {
      'name': 'M5 General Purpose Quadruple Extra Large',
      'apiName': 'm5d.4xlarge',
      'memory': '64.0 GiB',
      'storage': '600 GiB (2 * 300 GiB NVMe SSD)'
    },
    {
      'name': 'M5 General Purpose Large',
      'apiName': 'm5d.large',
      'memory': '8.0 GiB',
      'storage': '75 GiB NVMe SSD'
    },
    {
      'name': 'M5 General Purpose Extra Large',
      'apiName': 'm5d.xlarge',
      'memory': '16.0 GiB',
      'storage': '150 GiB NVMe SSD'
    },
    {
      'name': 'General Purpose GPU 16xlarge',
      'apiName': 'p2.16xlarge',
      'memory': '732.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'General Purpose GPU Eight Extra Large',
      'apiName': 'p2.8xlarge',
      'memory': '488.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'General Purpose GPU Extra Large',
      'apiName': 'p2.xlarge',
      'memory': '61.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'P3 16xlarge',
      'apiName': 'p3.16xlarge',
      'memory': '488.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'P3 Double Extra Large',
      'apiName': 'p3.2xlarge',
      'memory': '61.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'P3 Eight Extra Large',
      'apiName': 'p3.8xlarge',
      'memory': '244.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'R3 High-Memory Double Extra Large',
      'apiName': 'r3.2xlarge',
      'memory': '61.0 GiB',
      'storage': '160 GiB SSD'
    },
    {
      'name': 'R3 High-Memory Quadruple Extra Large',
      'apiName': 'r3.4xlarge',
      'memory': '122.0 GiB',
      'storage': '320 GiB SSD'
    },
    {
      'name': 'R3 High-Memory Eight Extra Large',
      'apiName': 'r3.8xlarge',
      'memory': '244.0 GiB',
      'storage': '640 GiB (2 * 320 GiB SSD)'
    },
    {
      'name': 'R3 High-Memory Large',
      'apiName': 'r3.large',
      'memory': '15.25 GiB',
      'storage': '32 GiB SSD'
    },
    {
      'name': 'R3 High-Memory Extra Large',
      'apiName': 'r3.xlarge',
      'memory': '30.5 GiB',
      'storage': '80 GiB SSD'
    },
    {
      'name': 'R4 High-Memory 16xlarge',
      'apiName': 'r4.16xlarge',
      'memory': '488.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'R4 High-Memory Double Extra Large',
      'apiName': 'r4.2xlarge',
      'memory': '61.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'R4 High-Memory Quadruple Extra Large',
      'apiName': 'r4.4xlarge',
      'memory': '122.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'R4 High-Memory Eight Extra Large',
      'apiName': 'r4.8xlarge',
      'memory': '244.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'R4 High-Memory Large',
      'apiName': 'r4.large',
      'memory': '15.25 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'R4 High-Memory Extra Large',
      'apiName': 'r4.xlarge',
      'memory': '30.5 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'R5 12xlarge',
      'apiName': 'r5.12xlarge',
      'memory': '384.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'R5 24xlarge',
      'apiName': 'r5.24xlarge',
      'memory': '768.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'R5 Double Extra Large',
      'apiName': 'r5.2xlarge',
      'memory': '64.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'R5 Quadruple Extra Large',
      'apiName': 'r5.4xlarge',
      'memory': '128.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'R5 Large',
      'apiName': 'r5.large',
      'memory': '16.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'R5 Extra Large',
      'apiName': 'r5.xlarge',
      'memory': '32.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'R5D 12xlarge',
      'apiName': 'r5d.12xlarge',
      'memory': '384.0 GiB',
      'storage': '1800 GiB (2 * 900 GiB NVMe SSD)'
    },
    {
      'name': 'R5D 24xlarge',
      'apiName': 'r5d.24xlarge',
      'memory': '768.0 GiB',
      'storage': '3600 GiB (4 * 900 GiB NVMe SSD)'
    },
    {
      'name': 'R5D Double Extra Large',
      'apiName': 'r5d.2xlarge',
      'memory': '64.0 GiB',
      'storage': '300 GiB NVMe SSD'
    },
    {
      'name': 'R5D Quadruple Extra Large',
      'apiName': 'r5d.4xlarge',
      'memory': '128.0 GiB',
      'storage': '600 GiB (2 * 300 GiB NVMe SSD)'
    },
    {
      'name': 'R5D Large',
      'apiName': 'r5d.large',
      'memory': '16.0 GiB',
      'storage': '75 GiB NVMe SSD'
    },
    {
      'name': 'R5D Extra Large',
      'apiName': 'r5d.xlarge',
      'memory': '32.0 GiB',
      'storage': '150 GiB NVMe SSD'
    },
    {
      'name': 'T1 Micro',
      'apiName': 't1.micro',
      'memory': '0.613 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'T2 Double Extra Large',
      'apiName': 't2.2xlarge',
      'memory': '32.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'T2 Large',
      'apiName': 't2.large',
      'memory': '8.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'T2 Medium',
      'apiName': 't2.medium',
      'memory': '4.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'T2 Micro',
      'apiName': 't2.micro',
      'memory': '1.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'T2 Nano',
      'apiName': 't2.nano',
      'memory': '0.5 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'T2 Small',
      'apiName': 't2.small',
      'memory': '2.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'T2 Extra Large',
      'apiName': 't2.xlarge',
      'memory': '16.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'T3 Double Extra Large',
      'apiName': 't3.2xlarge',
      'memory': '32.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'T3 Large',
      'apiName': 't3.large',
      'memory': '8.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'T3 Medium',
      'apiName': 't3.medium',
      'memory': '4.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'T3 Micro',
      'apiName': 't3.micro',
      'memory': '1.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'T3 Nano',
      'apiName': 't3.nano',
      'memory': '0.5 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'T3 Small',
      'apiName': 't3.small',
      'memory': '2.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'T3 Extra Large',
      'apiName': 't3.xlarge',
      'memory': '16.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'U-12TB1 Metal',
      'apiName': 'u-12tb1.metal',
      'memory': '12288.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'U-6TB1 Metal',
      'apiName': 'u-6tb1.metal',
      'memory': '6144.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'U-9TB1 Metal',
      'apiName': 'u-9tb1.metal',
      'memory': '9216.0 GiB',
      'storage': 'EBS only'
    },
    {
      'name': 'X1 Extra High-Memory 16xlarge',
      'apiName': 'x1.16xlarge',
      'memory': '976.0 GiB',
      'storage': '1920 GiB SSD'
    },
    {
      'name': 'X1 Extra High-Memory 32xlarge',
      'apiName': 'x1.32xlarge',
      'memory': '1952.0 GiB',
      'storage': '3840 GiB (2 * 1920 GiB SSD)'
    },
    {
      'name': 'X1E 16xlarge',
      'apiName': 'x1e.16xlarge',
      'memory': '1952.0 GiB',
      'storage': '1920 GiB SSD'
    },
    {
      'name': 'X1E Double Extra Large',
      'apiName': 'x1e.2xlarge',
      'memory': '244.0 GiB',
      'storage': '240 GiB SSD'
    },
    {
      'name': 'X1E 32xlarge',
      'apiName': 'x1e.32xlarge',
      'memory': '3904.0 GiB',
      'storage': '3840 GiB (2 * 1920 GiB SSD)'
    },
    {
      'name': 'X1E Quadruple Extra Large',
      'apiName': 'x1e.4xlarge',
      'memory': '488.0 GiB',
      'storage': '480 GiB SSD'
    },
    {
      'name': 'X1E Eight Extra Large',
      'apiName': 'x1e.8xlarge',
      'memory': '976.0 GiB',
      'storage': '960 GiB SSD'
    },
    {
      'name': 'X1E Extra Large',
      'apiName': 'x1e.xlarge',
      'memory': '122.0 GiB',
      'storage': '120 GiB SSD'
    },
    {
      'name': 'Z1D 12xlarge',
      'apiName': 'z1d.12xlarge',
      'memory': '384.0 GiB',
      'storage': '1800 GiB (2 * 900 GiB NVMe SSD)'
    },
    {
      'name': 'Z1D Double Extra Large',
      'apiName': 'z1d.2xlarge',
      'memory': '64.0 GiB',
      'storage': '300 GiB NVMe SSD'
    },
    {
      'name': 'Z1D 3xlarge',
      'apiName': 'z1d.3xlarge',
      'memory': '96.0 GiB',
      'storage': '450 GiB NVMe SSD'
    },
    {
      'name': 'Z1D 6xlarge',
      'apiName': 'z1d.6xlarge',
      'memory': '192.0 GiB',
      'storage': '900 GiB NVMe SSD'
    },
    {
      'name': 'Z1D Large',
      'apiName': 'z1d.large',
      'memory': '16.0 GiB',
      'storage': '75 GiB NVMe SSD'
    },
    {
      'name': 'Z1D Extra Large',
      'apiName': 'z1d.xlarge',
      'memory': '32.0 GiB',
      'storage': '150 GiB NVMe SSD'
    }
  ]
