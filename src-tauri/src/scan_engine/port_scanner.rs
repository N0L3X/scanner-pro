```rust
use tokio::net::TcpStream;
use tokio::time::timeout;
use std::time::Duration;
use super::{Port, PortState};

pub struct PortScanner {
    timeout_duration: Duration,
}

impl PortScanner {
    pub fn new(timeout_ms: u64) -> Self {
        Self {
            timeout_duration: Duration::from_millis(timeout_ms),
        }
    }

    pub async fn scan_port(&self, target: &str, port: u16) -> Result<Port, String> {
        let addr = format!("{}:{}", target, port);
        
        match timeout(self.timeout_duration, TcpStream::connect(&addr)).await {
            Ok(Ok(_)) => Ok(Port {
                number: port,
                state: PortState::Open,
                service: None,
            }),
            Ok(Err(_)) => Ok(Port {
                number: port,
                state: PortState::Closed,
                service: None,
            }),
            Err(_) => Ok(Port {
                number: port,
                state: PortState::Filtered,
                service: None,
            }),
        }
    }

    pub async fn scan_port_range(&self, target: &str, start: u16, end: u16) -> Result<Vec<Port>, String> {
        let mut results = Vec::new();
        let mut handles = Vec::new();

        for port in start..=end {
            let target = target.to_string();
            let scanner = self.clone();
            let handle = tokio::spawn(async move {
                scanner.scan_port(&target, port).await
            });
            handles.push(handle);
        }

        for handle in handles {
            if let Ok(Ok(port)) = handle.await {
                results.push(port);
            }
        }

        Ok(results)
    }
}

impl Clone for PortScanner {
    fn clone(&self) -> Self {
        Self {
            timeout_duration: self.timeout_duration,
        }
    }
}
```