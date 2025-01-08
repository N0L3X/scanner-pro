use std::sync::Arc;
use tokio::sync::Mutex;
use crate::scanner::{Scanner, ScanResult};
use crate::config::ScanConfig;

pub struct NmapService {
    scanner: Arc<Mutex<Scanner>>,
}

impl NmapService {
    pub fn new() -> Self {
        Self {
            scanner: Arc::new(Mutex::new(Scanner::new())),
        }
    }

    pub async fn execute_scan(&self, target: &str, config: &ScanConfig) -> Result<ScanResult, String> {
        let scanner = self.scanner.lock().await;
        scanner.scan_target(target, config).await
    }

    pub async fn execute_script_scan(&self, target: &str, script_name: &str) -> Result<String, String> {
        let scanner = self.scanner.lock().await;
        scanner.run_nse_script(target, script_name).await
    }

    pub async fn get_service_detection(&self, target: &str, port: u16) -> Result<String, String> {
        let scanner = self.scanner.lock().await;
        scanner.detect_service(target, port).await
    }

    pub async fn get_os_detection(&self, target: &str) -> Result<String, String> {
        let scanner = self.scanner.lock().await;
        scanner.detect_os(target).await
    }
}