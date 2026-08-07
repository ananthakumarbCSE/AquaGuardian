# AquaGuardian — ESP32 Firmware

Production-grade C++ firmware for the **AquaGuardian Intelligent IoT Water Quality Monitoring System**.

## 🔌 Hardware Setup

### Board
- **ESP32 DevKit V1**

### Pin Assignments
| Sensor | Model | Pin | Interface |
|---|---|---|---|
| **pH Sensor** | PH-4502C | `GPIO34` | Analog (ADC1_CH6) |
| **TDS Sensor** | Gravity Analog TDS | `GPIO32` | Analog (ADC1_CH4) |
| **Turbidity Sensor** | Gravity Analog Turbidity | `GPIO35` | Analog (ADC1_CH7) |
| **Temperature** | DS18B20 Waterproof | `GPIO4` | OneWire Digital |

---

## 📁 Project Structure

```
firmware/
├── platformio.ini         # PlatformIO build configuration & library dependencies
├── README.md              # Hardware & setup documentation
├── include/
│   ├── config.h           # Device ID, pins, sampling rate, calibration constants
│   ├── secrets.h          # WiFi credentials & backend server URL
│   ├── sensors.h          # Sensor data structure & interface
│   ├── wifi_manager.h     # WiFi connection & auto-reconnect interface
│   └── api_client.h       # HTTP POST payload serializer & client
└── src/
    ├── main.cpp           # Main loop (5s cycle)
    ├── sensors.cpp        # ADC sampling, DS18B20 reading, calibration
    ├── wifi_manager.cpp   # WiFi event handling & reconnect logic
    └── api_client.cpp     # JSON payload construction & HTTP client
```

---

## 🚀 Getting Started

### 1. Configuration
Edit `include/secrets.h` with your WiFi network credentials and backend server URL:

```cpp
const char* WIFI_SSID     = "Your_WiFi_Name";
const char* WIFI_PASSWORD = "Your_WiFi_Password";
const char* SERVER_URL    = "http://192.168.1.100:8001"; // LAN IP of FastAPI server
```

### 2. Build & Upload
Using PlatformIO CLI or VS Code PlatformIO extension:

```bash
# Build firmware
pio run

# Upload to ESP32
pio run --target upload

# Open Serial Monitor (115200 baud)
pio device monitor
```

---

## 📡 Backend API Contract

The ESP32 posts JSON payloads every **5 seconds** to `POST /api/v1/sensor-readings/`:

```json
{
    "device_id": "AQG001",
    "ph": 7.20,
    "temperature": 29.5,
    "tds": 350,
    "turbidity": 4.20
}
```

The FastAPI backend automatically computes:
- Water Health Score (0-100)
- Water Quality Status (Good, Moderate, Poor, Unsafe)
- System Alerts (High / Medium severity)
- Predictive Trend Analytics & Predictive Maintenance
