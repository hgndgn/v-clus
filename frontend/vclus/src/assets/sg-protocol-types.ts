var ProtocolTypes =
  [
    {
      "name": "All Traffic",
      "protocol": "-1",
      "fromPort": 0,
      "toPort": 65535,
      "id": 0
    },
    {
      "name": "All TCP",
      "protocol": "tcp",
      "fromPort": 0,
      "toPort": 65535,
      "id": 1
    },
    {
      "name": "All UDP",
      "protocol": "udp",
      "fromPort": 0,
      "toPort": 65535,
      "id": 2
    },
    {
      "name": "All ICMP",
      "protocol": "icmp",
      "fromPort": 0,
      "toPort": 65535,
      "id": 3
    },
    {
      "name": "Custom TCP",
      "protocol": "tcp",
      "fromPort": 0,
      "toPort": 65535,
      "id": 4
    },
    {
      "name": "Custom UDP",
      "protocol": "udp",
      "fromPort": 0,
      "toPort": 65535,
      "id": 5
    },
    {
      "name": "SSH",
      "protocol": "tcp",
      "fromPort": 22,
      "toPort": 22,
      "id": 6
    },
    {
      "name": "SMTP",
      "protocol": "tcp",
      "fromPort": 25,
      "toPort": 25,
      "id": 7
    },
    {
      "name": "DNS (UDP)",
      "protocol": "udp",
      "fromPort": 53,
      "toPort": 53,
      "id": 8
    },
    {
      "name": "DNS (TCP)",
      "protocol": "tcp",
      "fromPort": 53,
      "toPort": 53,
      "id": 9
    },
    {
      "name": "HTTP",
      "protocol": "tcp",
      "fromPort": 80,
      "toPort": 80,
      "id": 10
    },
    {
      "name": "POP3",
      "protocol": "tcp",
      "fromPort": 110,
      "toPort": 110,
      "id": 11
    },
    {
      "name": "IMAP",
      "protocol": "tcp",
      "fromPort": 143,
      "toPort": 143,
      "id": 12
    },
    {
      "name": "LDAP",
      "protocol": "tcp",
      "fromPort": 389,
      "toPort": 389,
      "id": 13
    },
    {
      "name": "HTTPS",
      "protocol": "tcp",
      "fromPort": 443,
      "toPort": 443,
      "id": 14
    },
    {
      "name": "SMB",
      "protocol": "tcp",
      "fromPort": 445,
      "toPort": 445,
      "id": 15
    },
    {
      "name": "SMTPS",
      "protocol": "tcp",
      "fromPort": 465,
      "toPort": 465,
      "id": 16
    },
    {
      "name": "IMAPS",
      "protocol": "tcp",
      "fromPort": 993,
      "toPort": 993,
      "id": 17
    },
    {
      "name": "POP3S",
      "protocol": "tcp",
      "fromPort": 995,
      "toPort": 995,
      "id": 18
    },
    {
      "name": "MS SQL",
      "protocol": "tcp",
      "fromPort": 1433,
      "toPort": 1433,
      "id": 19
    },
    {
      "name": "NFS",
      "protocol": "tcp",
      "fromPort": 2049,
      "toPort": 2049,
      "id": 20
    },
    {
      "name": "MYSQL/Aurora",
      "protocol": "tcp",
      "fromPort": 3306,
      "toPort": 3306,
      "id": 21
    },
    {
      "name": "RDP",
      "protocol": "tcp",
      "fromPort": 3389,
      "toPort": 3389,
      "id": 22
    },
    {
      "name": "Redshift",
      "protocol": "tcp",
      "fromPort": 5439,
      "toPort": 5439,
      "id": 23
    },
    {
      "name": "PostgreSQL",
      "protocol": "tcp",
      "fromPort": 5432,
      "toPort": 5432,
      "id": 24
    },
    {
      "name": "Oracle-RDS",
      "protocol": "tcp",
      "fromPort": 1521,
      "toPort": 1521,
      "id": 25
    },
    {
      "name": "WinRM-HTTP",
      "protocol": "tcp",
      "fromPort": 5985,
      "toPort": 5985,
      "id": 26
    },
    {
      "name": "Elastic GPU",
      "protocol": "tcp",
      "fromPort": 2007,
      "toPort": 2007,
      "id": 27
    }
  ]

export default ProtocolTypes