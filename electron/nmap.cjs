const { spawn } = require('child_process');
const path = require('path');
const xml2js = require('xml2js');

class NmapWrapper {
  constructor() {
    this.nmapPath = process.platform === 'win32' 
      ? path.join(__dirname, '../bin/nmap.exe')
      : 'nmap';
  }

  async executeScan(config) {
    return new Promise((resolve, reject) => {
      const args = this.buildCommandArgs(config);
      const nmap = spawn(this.nmapPath, args);
      
      let output = '';
      let errorOutput = '';

      nmap.stdout.on('data', (data) => {
        output += data;
      });

      nmap.stderr.on('data', (data) => {
        errorOutput += data;
      });

      nmap.on('close', (code) => {
        if (code === 0) {
          resolve(this.parseOutput(output));
        } else {
          reject(new Error(`Nmap scan failed: ${errorOutput}`));
        }
      });
    });
  }

  buildCommandArgs(config) {
    const args = [];

    // Basic scan type
    if (config.scanTypes.syn) args.push('-sS');
    if (config.scanTypes.connect) args.push('-sT');
    if (config.scanTypes.fin) args.push('-sF');
    if (config.scanTypes.xmas) args.push('-sX');
    if (config.scanTypes.null) args.push('-sN');
    if (config.scanTypes.ack) args.push('-sA');
    if (config.scanTypes.window) args.push('-sW');
    if (config.scanTypes.maimon) args.push('-sM');
    if (config.scanTypes.udp) args.push('-sU');
    if (config.scanTypes.sctp) args.push('-sY');
    if (config.scanTypes.ip) args.push('-sO');

    // Host Discovery
    if (config.discovery.arpPing) args.push('-PR');
    if (config.discovery.icmpEcho) args.push('-PE');
    if (config.discovery.icmpTimestamp) args.push('-PP');
    if (config.discovery.tcpPing) args.push('-PS');
    if (config.discovery.udpPing) args.push('-PU');
    if (config.discovery.sctpPing) args.push('-PY');
    if (config.discovery.ipProtocol) args.push('-PO');

    // Timing Template
    args.push(`-T${config.timing.template}`);

    // Custom timing options
    if (config.timing.minRttTimeout) args.push(`--min-rtt-timeout ${config.timing.minRttTimeout}ms`);
    if (config.timing.maxRttTimeout) args.push(`--max-rtt-timeout ${config.timing.maxRttTimeout}ms`);
    if (config.timing.initialRttTimeout) args.push(`--initial-rtt-timeout ${config.timing.initialRttTimeout}ms`);
    if (config.timing.maxRetries) args.push(`--max-retries ${config.timing.maxRetries}`);
    if (config.timing.hostTimeout) args.push(`--host-timeout ${config.timing.hostTimeout}ms`);
    if (config.timing.scanDelay) args.push(`--scan-delay ${config.timing.scanDelay}ms`);

    // Version Detection
    if (config.version.intensity) args.push(`--version-intensity ${config.version.intensity}`);
    if (config.version.light) args.push('--version-light');
    if (config.version.allPorts) args.push('--version-all');
    if (config.version.versionTrace) args.push('--version-trace');

    // NSE Scripts
    const scriptCategories = Object.entries(config.scripts.categories)
      .filter(([_, enabled]) => enabled)
      .map(([category]) => category);
    
    if (scriptCategories.length > 0) {
      args.push(`--script=${scriptCategories.join(',')}`);
    }

    if (Object.keys(config.scripts.scriptArgs).length > 0) {
      const scriptArgs = Object.entries(config.scripts.scriptArgs)
        .map(([key, value]) => `${key}=${value}`)
        .join(',');
      args.push(`--script-args=${scriptArgs}`);
    }

    if (config.scripts.scriptTimeout) args.push(`--script-timeout ${config.scripts.scriptTimeout}ms`);
    if (config.scripts.scriptTrace) args.push('--script-trace');

    // Advanced Options
    if (config.advanced.fragmentPackets) {
      args.push('-f');
      if (config.advanced.fragmentSize) args.push(`--mtu ${config.advanced.fragmentSize}`);
    }

    if (config.advanced.decoys.length > 0) {
      args.push(`-D ${config.advanced.decoys.join(',')}`);
    }

    if (config.advanced.sourcePort) args.push(`--source-port ${config.advanced.sourcePort}`);
    if (config.advanced.dataLength) args.push(`--data-length ${config.advanced.dataLength}`);
    if (config.advanced.ipTtl) args.push(`--ttl ${config.advanced.ipTtl}`);
    if (config.advanced.spoofMac) args.push(`--spoof-mac ${config.advanced.spoofMac}`);
    if (config.advanced.badsum) args.push('--badsum');
    if (config.advanced.randomize) args.push('--randomize-hosts');

    // Output format
    args.push('-oX', '-'); // Output in XML format to stdout

    return args;
  }

  async parseOutput(output) {
    try {
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(output);
      
      return {
        hosts: result.nmaprun.host?.map(host => ({
          address: host.address[0].$.addr,
          status: host.status[0].$.state,
          ports: host.ports?.[0].port?.map(port => ({
            number: parseInt(port.$.portid),
            protocol: port.$.protocol,
            state: port.state[0].$.state,
            service: port.service?.[0].$.name,
            version: port.service?.[0].$.version,
            product: port.service?.[0].$.product
          })) || [],
          os: host.os?.[0].osmatch?.map(match => ({
            name: match.$.name,
            accuracy: parseInt(match.$.accuracy)
          })) || [],
          scripts: host.hostscript?.[0].script?.map(script => ({
            id: script.$.id,
            output: script.$.output
          })) || []
        })) || [],
        scanStats: {
          timeStart: result.nmaprun.$.start,
          timeEnd: result.nmaprun.runstats[0].finished[0].$.time,
          hostsTotal: parseInt(result.nmaprun.runstats[0].hosts[0].$.total),
          hostsUp: parseInt(result.nmaprun.runstats[0].hosts[0].$.up),
          hostsDown: parseInt(result.nmaprun.runstats[0].hosts[0].$.down)
        }
      };
    } catch (error) {
      throw new Error(`Failed to parse Nmap output: ${error.message}`);
    }
  }
}

module.exports = { NmapWrapper };