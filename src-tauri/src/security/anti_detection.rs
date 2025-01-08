```rust
use serde::{Serialize, Deserialize};
use rand::Rng;
use std::time::Duration;

#[derive(Debug, Serialize, Deserialize)]
pub struct AntiDetectionConfig {
    pub randomize_delay: bool,
    pub fragment_packets: bool,
    pub rotate_user_agent: bool,
    pub min_delay: u64,
    pub max_delay: u64,
}

pub struct AntiDetection {
    config: AntiDetectionConfig,
}

impl AntiDetection {
    pub fn new(config: AntiDetectionConfig) -> Self {
        Self { config }
    }

    pub fn get_random_delay(&self) -> Duration {
        if !self.config.randomize_delay {
            return Duration::from_millis(0);
        }

        let mut rng = rand::thread_rng();
        let delay = rng.gen_range(self.config.min_delay..=self.config.max_delay);
        Duration::from_millis(delay)
    }

    pub fn get_packet_fragmentation(&self) -> Option<u16> {
        if !self.config.fragment_packets {
            return None;
        }

        let mut rng = rand::thread_rng();
        Some(rng.gen_range(8..=1500))
    }

    pub fn get_user_agent(&self) -> Option<String> {
        if !self.config.rotate_user_agent {
            return None;
        }

        let user_agents = vec![
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            "Mozilla/5.0 (X11; Linux x86_64)",
        ];

        let mut rng = rand::thread_rng();
        Some(user_agents[rng.gen_range(0..user_agents.len())].to_string())
    }

    pub fn apply_evasion_techniques(&self, scan_config: &mut crate::config::ScanConfig) {
        if self.config.fragment_packets {
            scan_config.advanced.fragment_packets = true;
            if let Some(size) = self.get_packet_fragmentation() {
                scan_config.advanced.fragment_size = size;
            }
        }

        if self.config.randomize_delay {
            let delay = self.get_random_delay();
            scan_config.timing.scan_delay = delay.as_millis() as u32;
        }
    }
}
```