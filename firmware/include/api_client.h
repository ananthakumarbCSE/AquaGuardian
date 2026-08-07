/**
 * =============================================================
 * AquaGuardian Firmware — API Client Interface
 * =============================================================
 *
 * Header for the HTTP client that POSTs sensor readings
 * to the FastAPI backend.
 */

#ifndef API_CLIENT_H
#define API_CLIENT_H

#include <Arduino.h>
#include "sensors.h"

/**
 * Send a sensor reading to the backend via HTTP POST.
 *
 * Constructs a JSON payload matching the backend's
 * SensorReadingCreate schema and sends it to:
 *   POST {SERVER_URL}/api/v1/sensor-readings/
 *
 * Retries up to HTTP_MAX_RETRIES times on failure.
 *
 * @param data  The SensorData struct with validated readings.
 * @return true if the server responded with 2xx, false otherwise.
 */
bool api_send_reading(const SensorData& data);

#endif // API_CLIENT_H
