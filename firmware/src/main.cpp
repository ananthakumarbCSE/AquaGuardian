/**
 * =============================================================
 * AquaGuardian Firmware — Main Entry Point
 * =============================================================
 *
 * ESP32 Smart Water Quality Monitoring System Firmware.
 * Reads pH, Temperature, TDS, and Turbidity sensors every 5 seconds,
 * formats into JSON matching FastAPI schema, and posts to backend.
 */

#include <Arduino.h>
#include "config.h"
#include "sensors.h"
#include "wifi_manager.h"
#include "api_client.h"

static unsigned long lastReadingTime = 0;

void setup() {
    // 1. Initialize Serial Communication
    Serial.begin(115200);
    delay(1000);

    Serial.println("\n==================================================");
    Serial.println("  AquaGuardian — ESP32 Firmware v" FIRMWARE_VERSION);
    Serial.println("==================================================");
    Serial.printf("Device ID: %s\n", DEVICE_ID);

    // 2. Initialize Sensors
    sensors_init();

    // 3. Initialize WiFi Connection
    wifi_init();

    Serial.println("\n[System] Setup complete. Entering main monitoring loop...");
    Serial.println("==================================================\n");
}

void loop() {
    unsigned long currentMillis = millis();

    // Run sensor cycle every READING_INTERVAL_MS (5000ms)
    if (currentMillis - lastReadingTime >= READING_INTERVAL_MS || lastReadingTime == 0) {
        lastReadingTime = currentMillis;

        // Ensure WiFi connectivity before reading & sending
        wifi_ensure_connected();

        // Read and validate sensor values
        SensorData data = sensors_read();

        // Send sensor data payload to FastAPI backend
        bool sent = api_send_reading(data);

        if (sent) {
            Serial.println("[System] ✅ Cycle completed successfully.");
        } else {
            Serial.println("[System] ⚠️ Cycle finished with errors.");
        }
    }

    // Small yield delay to prevent CPU starving / watchdog triggers
    delay(10);
}
