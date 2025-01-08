```rust
use std::sync::Arc;
use tokio::sync::Mutex;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AnonymizationConfig {
    pub enabled: bool,
    pub proxy_chain: Vec<String>,
    pub rotate_identity: bool,
    pub fake_mac: Option<String>,
}

pub struct NetworkAnonymizer {
    config: Arc<Mutex<AnonymizationConfig>>,
    original_identity: Option<NetworkIdentity>,
}

#[derive(Clone)]
struct NetworkIdentity {
    mac_address: String,
    ip_address: String,
}

impl NetworkAnonymizer {
    pub fn new() -> Self {
        Self {
            config: Arc::new(Mutex::new(AnonymizationConfig {
                enabled: false,
                proxy_chain: Vec::new(),
                rotate_identity: false,
                fake_mac: None,
            })),
            original_identity: None,
        }
    }

    pub async fn enable_anonymization(&mut self, config: AnonymizationConfig) -> Result<(), String> {
        // Store original network identity
        self.original_identity = Some(self.get_current_identity().await?);
        
        // Apply anonymization settings
        let mut current_config = self.config.lock().await;
        *current_config = config;

        if config.rotate_identity {
            self.setup_identity_rotation().await?;
        }

        Ok(())
    }

    pub async fn disable_anonymization(&mut self) -> Result<(), String> {
        if let Some(original) = self.original_identity.take() {
            self.restore_identity(original).await?;
        }

        let mut config = self.config.lock().await;
        config.enabled = false;
        
        Ok(())
    }

    async fn get_current_identity(&self) -> Result<NetworkIdentity, String> {
        // Implementation to get current network identity
        Ok(NetworkIdentity {
            mac_address: "00:00:00:00:00:00".to_string(),
            ip_address: "0.0.0.0".to_string(),
        })
    }

    async fn setup_identity_rotation(&self) -> Result<(), String> {
        // Implementation for identity rotation
        Ok(())
    }

    async fn restore_identity(&self, identity: NetworkIdentity) -> Result<(), String> {
        // Implementation to restore original identity
        Ok(())
    }
}
```