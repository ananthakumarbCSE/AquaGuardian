/**
 * =============================================================
 * AquaGuardian Firmware — WiFi Manager Implementation
 * =============================================================
 */

#include "wifi_manager.h"
#include "config.h"
#include "secrets.h"

#include <WiFi.h>

void wifi_init() {
    Serial.println("\n[WiFi] Initializing connection...");
    Serial.printf("[WiFi] Connecting to SSID: %s\n", WIFI_SSID);

    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    unsigned long startTime = millis();
    while (WiFi.status() != WL_CONNECTED) {
        delay(WIFI_RETRY_DELAY_MS);
        Serial.print(".");
        
        if (millis() - startTime > WIFI_CONNECT_TIMEOUT_MS) {
            Serial.println("\n[WiFi] ❌ Connection Timeout!");
            return;
        }
    }

    Serial.println("\n[WiFi] Connected");
    Serial.printf("[WiFi] IP Address: %s\n", WiFi.localIP().toString().c_str());
    Serial.printf("[WiFi] RSSI: %d dBm\n", WiFi.RSSI());
}

bool wifi_is_connected() {
    return WiFi.status() == WL_CONNECTED;
}

void wifi_ensure_connected() {
    if (wifi_is_connected()) {
        return;
    }

    Serial.println("\n[WiFi] ⚠️ Disconnected! Attempting auto-reconnect...");
    WiFi.disconnect();
    WiFi.reconnect();

    unsigned long startTime = millis();
    while (WiFi.status() != WL_CONNECTED) {
        delay(WIFI_RETRY_DELAY_MS);
        Serial.print(".");

        if (millis() - startTime > WIFI_CONNECT_TIMEOUT_MS) {
            Serial.println("\n[WiFi] ❌ Reconnection Failed!");
            return;
        }
    }

    Serial.println("\n[WiFi] Reconnected successfully");
    Serial.printf("[WiFi] IP Address: %s\n", WiFi.localIP().toString().c_str());
}
