```rust
use std::sync::Arc;
use tokio::sync::Mutex;
use std::time::{Duration, Instant};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct DosProtectionConfig {
    pub max_concurrent_scans: u32,
    pub scan_interval: u64,
    pub max_ports_per_second: u32,
    pub cooldown_period: u64,
}

pub struct DosProtection {
    config: Arc<Mutex<DosProtectionConfig>>,
    active_scans: Arc<Mutex<u32>>,
    last_scan_time: Arc<Mutex<Instant>>,
    ports_scanned: Arc<Mutex<u32>>,
}

impl DosProtection {
    pub fn new(config: DosProtectionConfig) -> Self {
        Self {
            config: Arc::new(Mutex::new(config)),
            active_scans: Arc::new(Mutex::new(0)),
            last_scan_time: Arc::new(Mutex::new(Instant::now())),
            ports_scanned: Arc::new(Mutex::new(0)),
        }
    }

    pub async fn check_scan_allowed(&self) -> Result<(), String> {
        let config = self.config.lock().await;
        let mut active_scans = self.active_scans.lock().await;
        let mut last_scan_time = self.last_scan_time.lock().await;
        let mut ports_scanned = self.ports_scanned.lock().await;

        // Check concurrent scans
        if *active_scans >= config.max_concurrent_scans {
            return Err("Too many concurrent scans".to_string());
        }

        // Check scan interval
        let elapsed = last_scan_time.elapsed();
        if elapsed < Duration::from_millis(config.scan_interval) {
            return Err("Scanning too frequently".to_string());
        }

        // Check port rate
        if *ports_scanned >= config.max_ports_per_second {
            tokio::time::sleep(Duration::from_millis(config.cooldown_period)).await;
            *ports_scanned = 0;
        }

        Ok(())
    }

    pub async fn start_scan(&self) {
        let mut active_scans = self.active_scans.lock().await;
        let mut last_scan_time = self.last_scan_time.lock().await;

        *active_scans += 1;
        *last_scan_time = Instant::now();
    }

    pub async fn end_scan(&self) {
        let mut active_scans = self.active_scans.lock().await;
        *active_scans = active_scans.saturating_sub(1);
    }

    pub async fn increment_ports_scanned(&self, count: u32) {
        let mut ports_scanned = self.ports_scanned.lock().await;
        *ports_scanned += count;
    }
}
```