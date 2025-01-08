```rust
use tokio::net::TcpStream;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct IoTProtocolResult {
    pub protocol: String,
    pub version: Option<String>,
    pub security: IoTSecurity,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct IoTSecurity {
    pub encryption: Option<String>,
    pub authentication: Option<String>,
    pub certificates: bool,
}

pub struct IoTProtocols;

impl IoTProtocols {
    pub async fn detect_mqtt(host: &str, port: u16) -> Result<IoTProtocolResult, String> {
        let is_tls = port == 8883;
        
        Ok(IoTProtocolResult {
            protocol: "MQTT".to_string(),
            version: Some("3.1.1".to_string()),
            security: IoTSecurity {
                encryption: Some(if is_tls { "TLS" } else { "None" }.to_string()),
                authentication: None,
                certificates: is_tls,
            },
        })
    }

    pub async fn detect_coap(host: &str, port: u16) -> Result<IoTProtocolResult, String> {
        let is_dtls = port == 5684;

        Ok(IoTProtocolResult {
            protocol: "CoAP".to_string(),
            version: Some("1.0".to_string()),
            security: IoTSecurity {
                encryption: Some(if is_dtls { "DTLS" } else { "None" }.to_string()),
                authentication: None,
                certificates: is_dtls,
            },
        })
    }
}
```