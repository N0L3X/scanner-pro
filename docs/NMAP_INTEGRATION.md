# Nmap Feature Integration Plan

## Phase 1: Core Scanning Methods
- FIN, XMAS, NULL Scans
- IDLE/Zombie Scanning 
- FTP bounce Scanning
- Custom TCP/IP Flag Support

Implementation in `src/utils/scanner.ts`:
```typescript
interface ScanOptions {
  scanType: 'SYN' | 'FIN' | 'XMAS' | 'NULL' | 'IDLE' | 'FTP';
  customFlags?: {
    syn?: boolean;
    ack?: boolean;
    fin?: boolean;
    rst?: boolean;
    psh?: boolean;
    urg?: boolean;
  };
}
```

## Phase 2: Host Discovery
- ARP Ping Implementation
- ICMP Echo/Timestamp
- TCP/UDP Ping
- SCTP INIT Ping

New module: `src/utils/discovery/hostDiscovery.ts`

## Phase 3: NSE Integration
- Lua Script Engine Integration
- Script Categories:
  - auth
  - broadcast
  - brute
  - default
  - discovery
  - dos
  - exploit
  - fuzzer
  - intrusive
  - malware
  - safe
  - version
  - vuln

## Phase 4: Advanced OS Detection
- TCP/IP Stack Fingerprinting
- Service Version Detection
- Timing Templates (T1-T5)
- RPC Scanning Support

## Phase 5: Output Formats
- Normal Output
- XML Format
- Grepable Format
- JSON Format
- Custom Templates

## Implementation Timeline
1. Core Scanning (2 weeks)
2. Host Discovery (1 week)
3. NSE Integration (3 weeks)
4. OS Detection (2 weeks)
5. Output Formats (1 week)

## Technical Requirements
- Raw Socket Access
- Libpcap Integration
- Lua Runtime Environment
- OS Fingerprint Database