#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod scanner;
mod config;

use scanner::Scanner;
use config::ScanConfig;
use tauri::command;

#[command]
async fn execute_nmap_scan(target: String, config: ScanConfig) -> Result<String, String> {
    Scanner::scan_target(&target, &config)
        .await
        .map(|result| serde_json::to_string(&result).unwrap())
}

#[command]
async fn scan_port(host: String, port: u16) -> Result<bool, String> {
    Scanner::quick_port_scan(&host, port).await
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            execute_nmap_scan,
            scan_port
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}