/**
 * =============================================================
 * AquaGuardian Firmware — Configuration
 * =============================================================
 *
 * Central configuration file for all firmware constants.
 * Pin assignments, calibration values, timing, and device identity.
 *
 * Modify calibration values here to tune sensor accuracy.
 * No magic numbers should exist outside this file.
 */

#ifndef CONFIG_H
#define CONFIG_H

// =============================================================
// Device Identity
// =============================================================
#define DEVICE_ID           "AQG001"
#define FIRMWARE_VERSION    "1.0.0"

// =============================================================
// Timing (milliseconds)
// =============================================================
#define READING_INTERVAL_MS     5000    // Read sensors every 5 seconds
#define WIFI_RETRY_DELAY_MS     500     // Delay between WiFi reconnect attempts
#define WIFI_CONNECT_TIMEOUT_MS 15000   // Max time to wait for WiFi connection
#define HTTP_TIMEOUT_MS         10000   // HTTP request timeout
#define HTTP_RETRY_DELAY_MS     2000    // Delay before retrying a failed POST
#define HTTP_MAX_RETRIES        3       // Max POST retry attempts per reading

// =============================================================
// GPIO Pin Assignments
// =============================================================
#define PH_PIN              34      // PH-4502C analog output → GPIO34
#define TDS_PIN             32      // Gravity TDS analog out  → GPIO32
#define TURBIDITY_PIN       35      // Gravity Turbidity analog → GPIO35
#define DS18B20_PIN         4       // DS18B20 data line       → GPIO4

// =============================================================
// ADC Configuration
// =============================================================
#define ADC_RESOLUTION      4095.0f // ESP32 12-bit ADC
#define ADC_REF_VOLTAGE     3.3f    // ESP32 operating voltage
#define ADC_SAMPLES         20      // Number of samples to average per reading

// =============================================================
// pH Sensor Calibration (PH-4502C)
// =============================================================
// The PH-4502C outputs a voltage proportional to pH.
// Linear mapping: pH = PH_SLOPE * voltage + PH_OFFSET
// Calibrate with pH 4.0 and pH 7.0 buffer solutions.
// Default values for PH-4502C with 3.3V reference:
#define PH_SLOPE            -5.70f  // Voltage-to-pH slope
#define PH_OFFSET           21.34f  // Voltage-to-pH intercept
#define PH_MIN              0.0f    // Minimum valid pH
#define PH_MAX              14.0f   // Maximum valid pH

// =============================================================
// TDS Sensor Calibration (Gravity Analog TDS)
// =============================================================
// TDS is calculated from voltage using a quadratic formula
// provided by the DFRobot documentation, with temperature
// compensation applied.
#define TDS_VREF            3.3f    // Reference voltage
#define TDS_TEMP_COEFF      0.02f   // Temperature compensation coefficient
#define TDS_MIN             0       // Minimum valid TDS (ppm)
#define TDS_MAX             5000    // Maximum valid TDS (ppm)

// =============================================================
// Turbidity Sensor Calibration (Gravity Analog Turbidity)
// =============================================================
// Maps sensor voltage to NTU (Nephelometric Turbidity Units).
// Clean water ≈ 4.0V → 0 NTU; dirty water ≈ 0V → ~3000 NTU
// Linear approximation: NTU = TURB_SLOPE * voltage + TURB_OFFSET
#define TURB_CLEAN_VOLTAGE  4.0f    // Voltage output for clean water
#define TURB_MAX_NTU        3000.0f // Maximum NTU value
#define TURB_MIN            0.0f    // Minimum valid turbidity (NTU)
#define TURB_MAX            3000.0f // Maximum valid turbidity (NTU)

// =============================================================
// Temperature Sensor (DS18B20)
// =============================================================
#define TEMP_MIN            -10.0f  // Minimum valid temperature (°C)
#define TEMP_MAX            85.0f   // Maximum valid temperature (°C)
#define TEMP_RESOLUTION     12      // DS18B20 resolution in bits (9-12)

#endif // CONFIG_H
