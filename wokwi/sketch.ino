/*
 * =============================================================
 *  AquaGuardian — ESP32 Water Quality Monitoring Firmware
 *  Wokwi Simulation Sketch
 * =============================================================
 *
 *  Sensors (simulated via potentiometers + DS18B20):
 *    • pH Sensor         → GPIO 34 (ADC, pot-ph)
 *    • Turbidity Sensor   → GPIO 35 (ADC, pot-turbidity)
 *    • TDS Sensor         → GPIO 32 (ADC, pot-tds)
 *    • Temperature Sensor → GPIO 4  (OneWire, DS18B20)
 *
 *  Outputs:
 *    • LCD 1602 I2C       → SDA=21, SCL=22
 *    • Green LED (Good)   → GPIO 25
 *    • Yellow LED (Fair)  → GPIO 26
 *    • Red LED (Poor)     → GPIO 27
 *    • Buzzer (Alert)     → GPIO 14
 *
 *  The firmware reads sensors every 5 seconds, calculates the
 *  Water Health Score (matching the backend algorithm), displays
 *  results on the LCD, drives status LEDs, triggers the buzzer
 *  on unsafe readings, and POSTs data to the backend API via
 *  WiFi (simulated in Wokwi).
 * =============================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>

// ───────────────────────── Pin Definitions ─────────────────────────
#define PH_PIN          34
#define TURBIDITY_PIN   35
#define TDS_PIN         32
#define TEMP_PIN        4

#define LED_GOOD_PIN    25
#define LED_FAIR_PIN    26
#define LED_POOR_PIN    27
#define BUZZER_PIN      14

// ───────────────────────── Configuration ───────────────────────────
// WiFi credentials (Wokwi provides a simulated WiFi network)
const char* WIFI_SSID     = "Wokwi-GUEST";
const char* WIFI_PASSWORD = "";

// Backend API endpoint — change to your actual server address
const char* API_ENDPOINT = "http://YOUR_SERVER_IP:8000/api/v1/sensor-readings/";

// Device identity
const char* DEVICE_ID = "AQ-ESP32-001";

// Reading interval in milliseconds
const unsigned long READING_INTERVAL = 5000;

// ───────────────────────── Sensor Instances ────────────────────────
OneWire           oneWire(TEMP_PIN);
DallasTemperature tempSensor(&oneWire);

// ───────────────────────── Display ─────────────────────────────────
LiquidCrystal_I2C lcd(0x27, 16, 2);

// ───────────────────────── Custom LCD Characters ───────────────────
byte dropletChar[8] = {
  0b00100,
  0b00100,
  0b01110,
  0b01110,
  0b11111,
  0b11111,
  0b01110,
  0b00000
};

byte thermChar[8] = {
  0b00100,
  0b01010,
  0b01010,
  0b01010,
  0b01110,
  0b11111,
  0b11111,
  0b01110
};

// ───────────────────────── Timing ──────────────────────────────────
unsigned long lastReadingTime = 0;
int displayPage = 0;  // Cycles through display pages

// ───────────────────────── Forward Declarations ────────────────────
float readPH();
float readTurbidity();
int   readTDS();
float readTemperature();
int   calculateHealthScore(float ph, float turbidity, float temperature, int tds);
const char* getWaterStatus(int score);
void  updateLEDs(int score);
void  triggerBuzzer(int score);
void  displayOnLCD(float ph, float turbidity, float temperature, int tds, int score, const char* status);
void  postToBackend(float ph, float turbidity, float temperature, int tds);
void  connectWiFi();

// ═══════════════════════════════════════════════════════════════════
//  SETUP
// ═══════════════════════════════════════════════════════════════════
void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println("╔═══════════════════════════════════════╗");
  Serial.println("║      AquaGuardian  v1.0.0             ║");
  Serial.println("║   Water Quality Monitoring System     ║");
  Serial.println("╚═══════════════════════════════════════╝");
  Serial.println();

  // Initialize pins
  pinMode(LED_GOOD_PIN, OUTPUT);
  pinMode(LED_FAIR_PIN, OUTPUT);
  pinMode(LED_POOR_PIN, OUTPUT);
  pinMode(BUZZER_PIN,   OUTPUT);

  // Turn off all LEDs and buzzer
  digitalWrite(LED_GOOD_PIN, LOW);
  digitalWrite(LED_FAIR_PIN, LOW);
  digitalWrite(LED_POOR_PIN, LOW);
  digitalWrite(BUZZER_PIN,   LOW);

  // Initialize temperature sensor
  tempSensor.begin();

  // Initialize LCD
  lcd.init();
  lcd.backlight();
  lcd.createChar(0, dropletChar);
  lcd.createChar(1, thermChar);

  // Boot animation
  lcd.setCursor(0, 0);
  lcd.write(0);  // droplet
  lcd.print(" AquaGuardian");
  lcd.setCursor(0, 1);
  lcd.print("  Starting...");
  delay(2000);

  // Connect to WiFi
  connectWiFi();

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("System Ready!");
  lcd.setCursor(0, 1);
  lcd.print("Monitoring...");
  delay(1500);
  lcd.clear();
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN LOOP
// ═══════════════════════════════════════════════════════════════════
void loop() {
  unsigned long currentTime = millis();

  if (currentTime - lastReadingTime >= READING_INTERVAL) {
    lastReadingTime = currentTime;

    // ── Read all sensors ──
    float ph          = readPH();
    float turbidity   = readTurbidity();
    int   tds         = readTDS();
    float temperature = readTemperature();

    // ── Calculate health score (mirrors backend algorithm) ──
    int score = calculateHealthScore(ph, turbidity, temperature, tds);
    const char* status = getWaterStatus(score);

    // ── Serial output ──
    Serial.println("────────────────────────────────────────");
    Serial.printf("  pH:          %.2f\n", ph);
    Serial.printf("  Turbidity:   %.1f NTU\n", turbidity);
    Serial.printf("  TDS:         %d ppm\n", tds);
    Serial.printf("  Temperature: %.1f °C\n", temperature);
    Serial.printf("  Health Score: %d / 100\n", score);
    Serial.printf("  Status:       %s\n", status);
    Serial.println("────────────────────────────────────────");

    // ── Update outputs ──
    updateLEDs(score);
    triggerBuzzer(score);
    displayOnLCD(ph, turbidity, temperature, tds, score, status);

    // ── Post to backend API ──
    postToBackend(ph, turbidity, temperature, tds);
  }
}

// ═══════════════════════════════════════════════════════════════════
//  SENSOR READING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Read pH sensor (potentiometer on GPIO 34).
 * Maps 0–4095 ADC value to 0.00–14.00 pH range.
 */
float readPH() {
  int rawValue = analogRead(PH_PIN);
  float ph = (rawValue / 4095.0) * 14.0;
  return ph;
}

/**
 * Read turbidity sensor (potentiometer on GPIO 35).
 * Maps 0–4095 ADC value to 0–100 NTU range.
 */
float readTurbidity() {
  int rawValue = analogRead(TURBIDITY_PIN);
  float turbidity = (rawValue / 4095.0) * 100.0;
  return turbidity;
}

/**
 * Read TDS sensor (potentiometer on GPIO 32).
 * Maps 0–4095 ADC value to 0–2000 ppm range.
 */
int readTDS() {
  int rawValue = analogRead(TDS_PIN);
  int tds = (int)((rawValue / 4095.0) * 2000.0);
  return tds;
}

/**
 * Read temperature from DS18B20 sensor on GPIO 4.
 * Returns value in degrees Celsius.
 */
float readTemperature() {
  tempSensor.requestTemperatures();
  float tempC = tempSensor.getTempCByIndex(0);
  // If sensor returns -127, it's a read error; default to 25°C
  if (tempC == -127.0) {
    tempC = 25.0;
  }
  return tempC;
}

// ═══════════════════════════════════════════════════════════════════
//  HEALTH SCORE — mirrors backend calculate_health_score()
// ═══════════════════════════════════════════════════════════════════

/**
 * Calculates the Water Health Score (0–100) using the EXACT same
 * algorithm as the backend's health_score.py service.
 *
 * Scoring breakdown (25 points per parameter):
 *   pH:          6.5–8.5 → 25 | 6.0–6.5 or 8.5–9.0 → 18 | else → 8
 *   Turbidity:   ≤5 → 25  | ≤10 → 18  | else → 8
 *   Temperature: 20–30 → 25 | 15–35 → 18 | else → 8
 *   TDS:         ≤300 → 25 | ≤500 → 18 | else → 8
 */
int calculateHealthScore(float ph, float turbidity, float temperature, int tds) {
  int score = 0;

  // pH Score
  if (ph >= 6.5 && ph <= 8.5) {
    score += 25;
  } else if ((ph >= 6.0 && ph < 6.5) || (ph > 8.5 && ph <= 9.0)) {
    score += 18;
  } else {
    score += 8;
  }

  // Turbidity Score
  if (turbidity <= 5.0) {
    score += 25;
  } else if (turbidity <= 10.0) {
    score += 18;
  } else {
    score += 8;
  }

  // Temperature Score
  if (temperature >= 20.0 && temperature <= 30.0) {
    score += 25;
  } else if (temperature >= 15.0 && temperature <= 35.0) {
    score += 18;
  } else {
    score += 8;
  }

  // TDS Score
  if (tds <= 300) {
    score += 25;
  } else if (tds <= 500) {
    score += 18;
  } else {
    score += 8;
  }

  return score;
}

/**
 * Returns a human-readable water status string based on the
 * health score — identical to the backend's classification.
 */
const char* getWaterStatus(int score) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 25) return "Poor";
  return "Unsafe";
}

// ═══════════════════════════════════════════════════════════════════
//  OUTPUT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Drives the three status LEDs based on water health score.
 *   • Green  (≥75) — Good/Excellent
 *   • Yellow (50–74) — Fair
 *   • Red    (<50) — Poor/Unsafe
 */
void updateLEDs(int score) {
  digitalWrite(LED_GOOD_PIN, LOW);
  digitalWrite(LED_FAIR_PIN, LOW);
  digitalWrite(LED_POOR_PIN, LOW);

  if (score >= 75) {
    digitalWrite(LED_GOOD_PIN, HIGH);
  } else if (score >= 50) {
    digitalWrite(LED_FAIR_PIN, HIGH);
  } else {
    digitalWrite(LED_POOR_PIN, HIGH);
  }
}

/**
 * Triggers the buzzer with short beeps when water quality is
 * Poor or Unsafe (health score < 50).
 */
void triggerBuzzer(int score) {
  if (score < 50) {
    // Three short alert beeps
    for (int i = 0; i < 3; i++) {
      digitalWrite(BUZZER_PIN, HIGH);
      delay(100);
      digitalWrite(BUZZER_PIN, LOW);
      delay(100);
    }
  } else {
    digitalWrite(BUZZER_PIN, LOW);
  }
}

/**
 * Cycles the LCD display through multiple pages to show all
 * sensor data and the computed health score.
 *
 * Page 0: pH and Turbidity
 * Page 1: TDS and Temperature
 * Page 2: Health Score and Status
 */
void displayOnLCD(float ph, float turbidity, float temperature, int tds, int score, const char* status) {
  lcd.clear();

  switch (displayPage) {
    case 0:
      lcd.setCursor(0, 0);
      lcd.print("pH: ");
      lcd.print(ph, 2);
      lcd.setCursor(0, 1);
      lcd.print("Turb: ");
      lcd.print(turbidity, 1);
      lcd.print(" NTU");
      break;

    case 1:
      lcd.setCursor(0, 0);
      lcd.print("TDS: ");
      lcd.print(tds);
      lcd.print(" ppm");
      lcd.setCursor(0, 1);
      lcd.write(1);  // thermometer char
      lcd.print(" Temp: ");
      lcd.print(temperature, 1);
      lcd.print("C");
      break;

    case 2:
      lcd.setCursor(0, 0);
      lcd.write(0);  // droplet char
      lcd.print(" Score: ");
      lcd.print(score);
      lcd.print("/100");
      lcd.setCursor(0, 1);
      lcd.print(">> ");
      lcd.print(status);
      break;
  }

  displayPage = (displayPage + 1) % 3;
}

// ═══════════════════════════════════════════════════════════════════
//  NETWORK FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Connects to the WiFi network. In Wokwi, the "Wokwi-GUEST"
 * SSID provides simulated internet connectivity.
 */
void connectWiFi() {
  Serial.print("[WiFi] Connecting to ");
  Serial.print(WIFI_SSID);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("WiFi Connect...");

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.print("[WiFi] Connected! IP: ");
    Serial.println(WiFi.localIP());

    lcd.setCursor(0, 1);
    lcd.print("Connected!");
  } else {
    Serial.println();
    Serial.println("[WiFi] Connection failed — running offline.");

    lcd.setCursor(0, 1);
    lcd.print("Offline Mode");
  }
  delay(1500);
}

/**
 * POSTs sensor readings to the AquaGuardian backend API as JSON.
 * Payload matches the SensorReadingCreate schema:
 *   { device_id, ph, turbidity, temperature, tds }
 */
void postToBackend(float ph, float turbidity, float temperature, int tds) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] WiFi not connected — skipping POST.");
    return;
  }

  HTTPClient http;
  http.begin(API_ENDPOINT);
  http.addHeader("Content-Type", "application/json");

  // Build JSON payload using ArduinoJson
  StaticJsonDocument<256> doc;
  doc["device_id"]   = DEVICE_ID;
  doc["ph"]          = serialized(String(ph, 2));
  doc["turbidity"]   = serialized(String(turbidity, 2));
  doc["temperature"] = serialized(String(temperature, 2));
  doc["tds"]         = tds;

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  Serial.print("[HTTP] POST → ");
  Serial.println(API_ENDPOINT);
  Serial.print("[HTTP] Payload: ");
  Serial.println(jsonPayload);

  int httpCode = http.POST(jsonPayload);

  if (httpCode > 0) {
    Serial.printf("[HTTP] Response Code: %d\n", httpCode);
    if (httpCode == 200 || httpCode == 201) {
      String response = http.getString();
      Serial.print("[HTTP] Response: ");
      Serial.println(response);
    }
  } else {
    Serial.printf("[HTTP] POST failed: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}
