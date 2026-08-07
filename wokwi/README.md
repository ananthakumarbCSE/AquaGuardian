# AquaGuardian — Wokwi Simulation

This folder contains a complete [Wokwi](https://wokwi.com/) virtual simulation of the AquaGuardian water quality monitoring system.

## 🖥️ Circuit Overview

```
                      ┌─────────────────────────────────┐
                      │      ESP32 DevKit C V4          │
   ┌──────────┐       │                                 │       ┌────────────┐
   │ pH Pot   │──SIG──┤ GPIO 34 (ADC)                   │──SDA──┤            │
   └──────────┘       │                                 │──SCL──┤  LCD 1602  │
   ┌──────────┐       │                                 │       │   (I2C)    │
   │Turb. Pot │──SIG──┤ GPIO 35 (ADC)                   │       └────────────┘
   └──────────┘       │                                 │
   ┌──────────┐       │                                 │       ┌──┐ ┌──┐ ┌──┐
   │ TDS Pot  │──SIG──┤ GPIO 32 (ADC)          GPIO 25──┤──────►│🟢│ │🟡│ │🔴│
   └──────────┘       │                        GPIO 26──┤──────►└──┘ └──┘ └──┘
   ┌──────────┐       │                        GPIO 27──┤──────►  Status LEDs
   │ DS18B20  │──DQ───┤ GPIO 4 (OneWire)                │
   │ (Temp)   │       │                        GPIO 14──┤──────► 🔊 Buzzer
   └──────────┘       │                                 │
                      └─────────────────────────────────┘
```

## 📁 Files

| File | Purpose |
|---|---|
| `diagram.json` | Wokwi circuit diagram — defines all components and wiring |
| `sketch.ino` | ESP32 Arduino firmware — sensor reading, health scoring, LCD display, LED/buzzer output, HTTP POST |
| `wokwi.toml` | Wokwi project configuration |
| `libraries.txt` | Arduino library dependencies for the simulator |

## 🔌 Pin Mapping

| Sensor / Output | GPIO Pin | Type |
|---|---|---|
| pH Sensor (Potentiometer) | GPIO 34 | Analog Input (ADC) |
| Turbidity Sensor (Potentiometer) | GPIO 35 | Analog Input (ADC) |
| TDS Sensor (Potentiometer) | GPIO 32 | Analog Input (ADC) |
| Temperature Sensor (DS18B20) | GPIO 4 | Digital (OneWire) |
| LCD SDA | GPIO 21 | I2C Data |
| LCD SCL | GPIO 22 | I2C Clock |
| Green LED (Good) | GPIO 25 | Digital Output |
| Yellow LED (Fair) | GPIO 26 | Digital Output |
| Red LED (Poor/Unsafe) | GPIO 27 | Digital Output |
| Buzzer (Alert) | GPIO 14 | Digital Output |

## 🧪 Sensor Simulation

Since Wokwi doesn't have native pH/Turbidity/TDS sensor components, **potentiometers** are used as stand-ins:

| Potentiometer | Simulates | ADC Range (0–4095) | Real Value Range |
|---|---|---|---|
| `pot-ph` | pH Sensor | 0 → 4095 | 0.00 → 14.00 |
| `pot-turbidity` | Turbidity Sensor | 0 → 4095 | 0 → 100 NTU |
| `pot-tds` | TDS Meter | 0 → 4095 | 0 → 2000 ppm |

The **DS18B20** temperature sensor is natively supported and can be adjusted by clicking on it during simulation.

## 📊 Health Score Algorithm

The firmware implements the **exact same scoring algorithm** as the backend's `health_score.py`:

| Parameter | Excellent (25 pts) | Good (18 pts) | Poor (8 pts) |
|---|---|---|---|
| pH | 6.5 – 8.5 | 6.0–6.5 or 8.5–9.0 | Outside range |
| Turbidity | ≤ 5 NTU | ≤ 10 NTU | > 10 NTU |
| Temperature | 20 – 30 °C | 15 – 35 °C | Outside range |
| TDS | ≤ 300 ppm | ≤ 500 ppm | > 500 ppm |

**Total Score → Status:**
- **90–100** → Excellent 🟢
- **75–89** → Good 🟢
- **50–74** → Fair 🟡
- **25–49** → Poor 🔴 + Buzzer
- **0–24** → Unsafe 🔴 + Buzzer

## 🚀 How to Run

### Option A: Wokwi Web Editor
1. Go to [wokwi.com](https://wokwi.com/)
2. Create a new **ESP32** project
3. Copy the contents of `sketch.ino` into the code editor
4. Replace the default `diagram.json` with this project's `diagram.json`
5. Add the libraries from `libraries.txt` using the Library Manager
6. Click **▶ Start Simulation**

### Option B: VS Code + Wokwi Extension
1. Install the [Wokwi for VS Code](https://marketplace.visualstudio.com/items?itemName=Wokwi.wokwi-vscode) extension
2. Open this `wokwi` folder in VS Code
3. Press `F1` → **"Wokwi: Start Simulator"**

## 🔗 Backend Integration

The firmware POSTs sensor data to the AquaGuardian FastAPI backend. Update the `API_ENDPOINT` constant in `sketch.ino` with your server's URL:

```cpp
const char* API_ENDPOINT = "http://YOUR_SERVER_IP:8000/api/v1/sensor-readings/";
```

The JSON payload matches the backend's `SensorReadingCreate` schema:
```json
{
  "device_id": "AQ-ESP32-001",
  "ph": 7.25,
  "turbidity": 3.50,
  "temperature": 26.50,
  "tds": 280
}
```

## 💡 Interactive Controls

During simulation in Wokwi:
- **Click and drag** potentiometer knobs to change pH, Turbidity, and TDS values
- **Click** the DS18B20 sensor to set the temperature
- Watch the **LCD display** cycle through sensor readings every 5 seconds
- Observe **LED indicators** change color based on water quality
- Hear the **buzzer** beep when health score drops below 50
