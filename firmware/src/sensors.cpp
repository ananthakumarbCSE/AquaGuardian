/**
 * =============================================================
 * AquaGuardian Firmware — Sensors Implementation
 * =============================================================
 */

#include "sensors.h"
#include "config.h"

#include <OneWire.h>
#include <DallasTemperature.h>

// OneWire & DallasTemperature instances
static OneWire oneWire(DS18B20_PIN);
static DallasTemperature tempSensor(&oneWire);

// Internal helper for analog averaging
static float read_analog_voltage(uint8_t pin) {
    uint32_t analogSum = 0;
    for (int i = 0; i < ADC_SAMPLES; i++) {
        analogSum += analogRead(pin);
        delay(5);
    }
    float rawAverage = (float)analogSum / (float)ADC_SAMPLES;
    return (rawAverage / ADC_RESOLUTION) * ADC_REF_VOLTAGE;
}

void sensors_init() {
    Serial.println("[Sensors] Initializing Hardware...");

    // Configure ADC pins
    pinMode(PH_PIN, INPUT);
    pinMode(TDS_PIN, INPUT);
    pinMode(TURBIDITY_PIN, INPUT);

    // Initialize DS18B20 temperature sensor
    tempSensor.begin();
    tempSensor.setResolution(TEMP_RESOLUTION);

    Serial.println("[Sensors] Hardware initialized successfully.");
}

SensorData sensors_read() {
    SensorData data;
    data.valid = true;

    Serial.println("\n----------------------------------------");
    Serial.println("Reading Sensors...");

    // 1. Temperature Reading (DS18B20)
    tempSensor.requestTemperatures();
    data.temperature = tempSensor.getTempCByIndex(0);

    if (data.temperature < TEMP_MIN || data.temperature > TEMP_MAX) {
        Serial.printf("[Sensors] ⚠️ Invalid Temperature reading: %.2f °C\n", data.temperature);
        // Fallback value for safety
        data.temperature = 25.0f;
        data.valid = false;
    } else {
        Serial.printf("Temperature : %.1f °C\n", data.temperature);
    }

    // 2. pH Reading (PH-4502C)
    float phVoltage = read_analog_voltage(PH_PIN);
    data.ph = (PH_SLOPE * phVoltage) + PH_OFFSET;

    // Clamp pH between 0.0 and 14.0
    if (data.ph < PH_MIN || data.ph > PH_MAX) {
        Serial.printf("[Sensors] ⚠️ Out-of-bounds pH reading: %.2f (Voltage: %.2fV)\n", data.ph, phVoltage);
        data.ph = constrain(data.ph, PH_MIN, PH_MAX);
        data.valid = false;
    } else {
        Serial.printf("pH          : %.2f\n", data.ph);
    }

    // 3. TDS Reading (Gravity TDS Sensor with Temperature Compensation)
    float tdsVoltage = read_analog_voltage(TDS_PIN);
    
    // Temperature compensation formula: Compensation Voltage = Voltage / (1.0 + 0.02 * (temp - 25.0))
    float compensationCoefficient = 1.0f + TDS_TEMP_COEFF * (data.temperature - 25.0f);
    float compensationVoltage = tdsVoltage / compensationCoefficient;

    // DFRobot TDS conversion polynomial formula
    float tdsValue = (133.42f * compensationVoltage * compensationVoltage * compensationVoltage 
                     - 255.86f * compensationVoltage * compensationVoltage 
                     + 857.39f * compensationVoltage) * 0.5f;

    data.tds = (int)tdsValue;
    if (data.tds < TDS_MIN || data.tds > TDS_MAX) {
        Serial.printf("[Sensors] ⚠️ Invalid TDS reading: %d ppm\n", data.tds);
        data.tds = constrain(data.tds, TDS_MIN, TDS_MAX);
        data.valid = false;
    } else {
        Serial.printf("TDS         : %d ppm\n", data.tds);
    }

    // 4. Turbidity Reading (Gravity Analog Turbidity Sensor)
    float turbVoltage = read_analog_voltage(TURBIDITY_PIN);
    
    // Linear relationship approximation: NTU = TURB_SLOPE * voltage + TURB_OFFSET
    // If voltage >= 4.0V, NTU ≈ 0 (clean water)
    if (turbVoltage >= TURB_CLEAN_VOLTAGE) {
        data.turbidity = 0.0f;
    } else {
        // Simple linear scale from TURB_CLEAN_VOLTAGE (0 NTU) to 0.0V (TURB_MAX_NTU)
        data.turbidity = (TURB_CLEAN_VOLTAGE - turbVoltage) * (TURB_MAX_NTU / TURB_CLEAN_VOLTAGE);
    }

    if (data.turbidity < TURB_MIN || data.turbidity > TURB_MAX) {
        Serial.printf("[Sensors] ⚠️ Invalid Turbidity reading: %.2f NTU\n", data.turbidity);
        data.turbidity = constrain(data.turbidity, TURB_MIN, TURB_MAX);
        data.valid = false;
    } else {
        Serial.printf("Turbidity   : %.1f NTU\n", data.turbidity);
    }

    Serial.printf("[Sensors] Status: %s\n", data.valid ? "VALID" : "VALIDATION_WARNING");
    Serial.println("----------------------------------------");

    return data;
}
