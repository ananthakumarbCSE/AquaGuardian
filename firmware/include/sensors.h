/**
 * =============================================================
 * AquaGuardian Firmware — Sensor Interface
 * =============================================================
 *
 * Header for sensor initialization and reading functions.
 * Provides a clean struct to hold all sensor data and
 * validation status.
 */

#ifndef SENSORS_H
#define SENSORS_H

#include <Arduino.h>

/**
 * Holds a single set of sensor readings with validity flag.
 */
struct SensorData {
    float ph;           // pH value (0.0 – 14.0)
    float temperature;  // Temperature in °C
    int   tds;          // Total Dissolved Solids in ppm
    float turbidity;    // Turbidity in NTU
    bool  valid;        // true if all readings are within sane range
};

/**
 * Initialize all sensor hardware (ADC pins, OneWire bus, DS18B20).
 * Call once in setup().
 */
void sensors_init();

/**
 * Read all sensors, apply calibration, validate, and return.
 * Performs multi-sample averaging on analog sensors for stability.
 *
 * @return SensorData struct with readings and validity flag.
 */
SensorData sensors_read();

#endif // SENSORS_H
