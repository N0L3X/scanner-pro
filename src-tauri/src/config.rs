use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ScanConfig {
    pub scan_types: ScanTypes,
    pub discovery: Discovery,
    pub timing: Timing,
    pub version: Version,
    pub scripts: Scripts,
    pub advanced: Advanced,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ScanTypes {
    pub syn: bool,
    pub fin: bool,
    pub xmas: bool,
    pub null: bool,
    pub ack: bool,
    pub window: bool,
    pub maimon: bool,
    pub idle: bool,
    pub udp: bool,
    pub sctp: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Discovery {
    pub arp_ping: bool,
    pub icmp_echo: bool,
    pub icmp_timestamp: bool,
    pub tcp_ping: bool,
    pub udp_ping: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Timing {
    pub template: u8,
    pub min_rtt_timeout: u32,
    pub max_rtt_timeout: u32,
    pub initial_rtt_timeout: u32,
    pub max_retries: u32,
    pub host_timeout: u32,
    pub scan_delay: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Version {
    pub enabled: bool,
    pub intensity: u8,
    pub light: bool,
    pub all_ports: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Scripts {
    pub categories: Vec<String>,
    pub timeout: u32,
    pub trace: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Advanced {
    pub fragment_packets: bool,
    pub fragment_size: u16,
    pub decoys: Vec<String>,
    pub source_port: u16,
    pub data_length: u16,
    pub ip_ttl: u8,
    pub spoof_mac: String,
    pub randomize: bool,
}