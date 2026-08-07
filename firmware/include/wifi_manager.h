/**
 * =============================================================
 * AquaGuardian Firmware — WiFi Manager Interface
 * =============================================================
 *
 * Header for WiFi connection management with automatic
 * reconnection support.
 */

#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <Arduino.h>

/**
 * Connect to the WiFi network defined in secrets.h.
 * Blocks until connected or timeout is reached.
 * Prints connection status and IP address to Serial.
 */
void wifi_init();

/**
 * Check if WiFi is currently connected.
 *
 * @return true if connected, false otherwise.
 */
bool wifi_is_connected();

/**
 * Ensure WiFi is connected. If disconnected, attempt reconnection.
 * Non-blocking: returns immediately if already connected.
 * If disconnected, blocks until reconnected or timeout.
 */
void wifi_ensure_connected();

#endif // WIFI_MANAGER_H
