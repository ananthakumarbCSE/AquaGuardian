/**
 * =============================================================
 * AquaGuardian Firmware — API Client Implementation
 * =============================================================
 */

#include "api_client.h"
#include "config.h"
#include "secrets.h"
#include "wifi_manager.h"

#include <HTTPClient.h>
#include <ArduinoJson.h>

bool api_send_reading(const SensorData& data) {
    wifi_ensure_connected();

    if (!wifi_is_connected()) {
        Serial.println("[API Client] ❌ Cannot send reading: WiFi not connected!");
        return false;
    }

    // Build endpoint URL
    String endpoint = String(SERVER_URL) + "/api/v1/sensor-readings/";

    // Construct JSON document matching SensorReadingCreate schema
    JsonDocument doc;
    doc["device_id"]   = DEVICE_ID;
    doc["ph"]          = serialized(String(data.ph, 2));
    doc["temperature"] = serialized(String(data.temperature, 1));
    doc["tds"]         = data.tds;
    doc["turbidity"]   = serialized(String(data.turbidity, 2));

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    Serial.println("\n[API Client] Sending JSON...");
    Serial.println(jsonPayload);

    HTTPClient http;
    http.setTimeout(HTTP_TIMEOUT_MS);
    http.begin(endpoint);
    http.addHeader("Content-Type", "application/json");

    int attempt = 0;
    bool success = false;

    while (attempt < HTTP_MAX_RETRIES && !success) {
        attempt++;
        if (attempt > 1) {
            Serial.printf("[API Client] Retrying... (Attempt %d/%d)\n", attempt, HTTP_MAX_RETRIES);
            delay(HTTP_RETRY_DELAY_MS);
        }

        int httpResponseCode = http.POST(jsonPayload);

        if (httpResponseCode > 0) {
            Serial.printf("[API Client] HTTP Response: %d\n", httpResponseCode);
            String response = http.getString();
            Serial.println("[API Client] Server Response:");
            Serial.println(response);

            if (httpResponseCode >= 200 && httpResponseCode < 300) {
                success = true;
            } else {
                Serial.printf("[API Client] ⚠️ Server returned non-2xx code: %d\n", httpResponseCode);
            }
        } else {
            Serial.printf("[API Client] ❌ HTTP Request failed: %s\n", http.errorToString(httpResponseCode).c_str());
        }
    }

    http.end();
    return success;
}
