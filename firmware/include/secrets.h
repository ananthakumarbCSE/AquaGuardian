/**
 * =============================================================
 * AquaGuardian Firmware — Secrets
 * =============================================================
 *
 * WiFi credentials and backend server URL.
 *
 * ⚠️  DO NOT commit this file to version control.
 *     Add "firmware/include/secrets.h" to your .gitignore.
 *
 * Replace the placeholder values below with your actual
 * WiFi network credentials and backend server URL.
 */

#ifndef SECRETS_H
#define SECRETS_H

// =============================================================
// WiFi Credentials
// =============================================================
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// =============================================================
// Backend API Server
// =============================================================
// Point this to your FastAPI backend.
// When running on a local machine, use the machine's LAN IP
// (not localhost/127.0.0.1 — the ESP32 is a separate device).
//
// Examples:
//   "http://192.168.1.100:8001"   ← Local development
//   "https://api.aquaguardian.io" ← Production
const char* SERVER_URL = "http://192.168.1.100:8001";

#endif // SECRETS_H
