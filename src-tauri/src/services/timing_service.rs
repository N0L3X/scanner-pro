use std::time::{Duration, Instant};
use tokio::time::sleep;

pub struct TimingService {
    template: u8,
    min_rtt: Duration,
    max_rtt: Duration,
    timeout: Duration,
}

impl TimingService {
    pub fn new(template: u8) -> Self {
        let (min_rtt, max_rtt, timeout) = match template {
            0 => (Duration::from_secs(5), Duration::from_secs(30), Duration::from_secs(300)),
            1 => (Duration::from_secs(1), Duration::from_secs(10), Duration::from_secs(60)),
            2 => (Duration::from_millis(500), Duration::from_secs(5), Duration::from_secs(30)),
            3 => (Duration::from_millis(100), Duration::from_secs(2), Duration::from_secs(20)),
            4 => (Duration::from_millis(50), Duration::from_secs(1), Duration::from_secs(10)),
            5 => (Duration::from_millis(10), Duration::from_millis(500), Duration::from_secs(5)),
            _ => (Duration::from_millis(100), Duration::from_secs(2), Duration::from_secs(20)),
        };

        Self {
            template,
            min_rtt,
            max_rtt,
            timeout,
        }
    }

    pub async fn adaptive_delay(&self) {
        let delay = match self.template {
            0 => Duration::from_millis(1000),
            1 => Duration::from_millis(500),
            2 => Duration::from_millis(100),
            3 => Duration::from_millis(50),
            4 => Duration::from_millis(10),
            5 => Duration::from_millis(0),
            _ => Duration::from_millis(100),
        };

        sleep(delay).await;
    }

    pub fn get_timeout(&self) -> Duration {
        self.timeout
    }
}