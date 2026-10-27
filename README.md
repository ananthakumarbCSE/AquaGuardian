# AquaGuardian 
### Intelligent Water Quality Monitoring and Early Warning System

AquaGuardian is an IoT-based water quality monitoring platform designed to collect sensor readings, monitor water-quality indicators, detect abnormal measurements, and provide actionable alerts through a web dashboard.

The system combines an ESP32-based sensor node, a FastAPI backend, a PostgreSQL database hosted on Supabase, and a React dashboard to provide a foundation for real-time monitoring and historical analysis.

> **Project status:** Prototype under development. Some water-quality parameters may use simulated data when the corresponding physical sensors are unavailable. Simulated values are not presented as actual sensor measurements.

---

## 📌 Problem Statement

Water-quality monitoring often relies on periodic manual testing or isolated sensor readings. These approaches can make it difficult to identify changing conditions, recognize unreliable sensor measurements, and maintain a useful history of water-quality indicators.

AquaGuardian aims to address these challenges through an affordable IoT monitoring system that collects measurements, stores historical data, identifies configured threshold violations, and helps users investigate unusual readings.

## 🎯 Objectives

- Monitor water-quality indicators using an ESP32-based sensor system.
- Collect and transmit sensor readings to a backend service.
- Store historical readings for analysis and visualization.
- Calculate an indicative Water Health Score using configured rules.
- Generate alerts when configured water-quality thresholds are violated.
- Identify potentially missing, frozen, or abnormal sensor readings.
- Explore historical trend analysis and predictive maintenance.
- Provide a simple dashboard for monitoring devices and reviewing alerts.

## ✨ Key Features

### 1. IoT-Based Monitoring
Collect sensor readings from an ESP32-based device, including temperature and TDS measurements where supported by the connected hardware.

### 2. Water Health Score
Calculate an indicative score from configured water-quality parameters and rules. The score is intended for monitoring purposes and is not a drinking-water safety certification.

### 3. Alert Management
Generate alerts when supported measurements violate configured thresholds. Store alert details so users can review detected events.

### 4. Sensor Anomaly Detection
Provide a foundation for identifying missing, frozen, or implausible measurements to help distinguish potential sensor faults from water-quality changes.

### 5. Historical Data Visualization
Store timestamped measurements and present available historical trends through the dashboard.

### 6. Predictive Analysis
Explore historical trends to estimate possible changes in selected indicators. Forecast accuracy and predictive capabilities must be evaluated against observed data before operational use.

### 7. Modular Architecture
Separate the firmware, backend, dashboard, and simulation components to support independent development and testing.

---

## 🏗️ System Architecture

```text
       ESP32 + Water Sensors
                 |
                 v
       Sensor Data Collection
                 |
                 v
          FastAPI Backend
                 |
        +--------+---------+
        |        |         |
        v        v         v
    Validation  Scoring   Alert Rules
        |        |         |
        +--------+---------+
                 |
                 v
       Supabase PostgreSQL
                 |
                 v
         React Dashboard
                 |
                 v
       Monitoring and Analysis
```

The firmware collects measurements, the backend validates incoming data and processes configured rules, the database stores readings and alerts, and the dashboard presents the available information.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Microcontroller | ESP32 |
| Firmware | Arduino framework / C++ |
| Backend | Python, FastAPI |
| API documentation | Swagger UI, OpenAPI |
| Database | PostgreSQL with Supabase |
| Frontend | React, JavaScript |
| Data visualization | Dashboard charting components |
| Simulation | Wokwi, where applicable |
| Version control | Git and GitHub |

The exact libraries and versions depend on the current project configuration.

## 🔌 Hardware Components

The prototype is designed around the following components, depending on availability and implementation status.

| Component | Purpose |
|---|---|
| ESP32 development board | Sensor data collection and connectivity |
| Temperature sensor | Measure water temperature |
| TDS sensor | Estimate total dissolved solids |
| OLED display | Display selected readings locally |
| Breadboard and jumper wires | Prototype circuit connections |
| pH sensor | Optional pH measurement |
| Turbidity sensor | Optional water clarity measurement |

**Hardware note:** Only connected and tested sensors should be described as operational. Any parameter generated by software must be identified as simulated.

## 💻 Software Requirements

- Python 3.11 or another version supported by the backend dependencies.
- Node.js and npm compatible with the dashboard.
- Git.
- Arduino IDE and the appropriate ESP32 board package, if building firmware.
- A Supabase project with the required database tables.
- A Wokwi account, if using the simulator.

Use the Python and Node.js versions specified by the project's dependency and configuration files when available.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ananthakumarbCSE/AquaGuardian.git
cd AquaGuardian
```

### 2. Configure the backend

Open the backend directory:

```bash
cd backend
```

Create and activate a virtual environment.

**Windows PowerShell**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies using the project's dependency file. For example, if `requirements.txt` exists:

```bash
pip install -r requirements.txt
```

Configure the required environment variables for the database connection and other backend settings.

Create a local `.env` file using the variables expected by the application. Never commit database credentials, API keys, or other secrets to GitHub.

### 3. Configure the database

Create or select a Supabase project and configure PostgreSQL connectivity.

Ensure the required tables and relationships are available, including the device, sensor-reading, and alert tables where applicable.

Use the database schema and migrations provided by the project, if available. Verify that the backend can connect successfully before starting the application.

### 4. Start the backend

From the backend directory, use the entry point defined in the repository.

For the current FastAPI application, if `app/main.py` exposes the application object:

```bash
python -m uvicorn app.main:app --reload
```

Open the interactive API documentation:

- API: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`

These URLs assume the backend is running locally on port 8000.

### 5. Start the dashboard

Open a separate terminal and navigate to the dashboard directory:

```bash
cd dashboard
npm install
npm run dev
```

Open the local URL printed by the development server.

Configure the dashboard's API base URL using the environment variable or configuration expected by the frontend. Ensure it points to the running backend.

### 6. Configure the ESP32

1. Open the firmware project in Arduino IDE.
2. Select the appropriate ESP32 board and serial port.
3. Configure the required Wi-Fi credentials and backend endpoint.
4. Check the sensor pin assignments against the actual circuit.
5. Upload the firmware.
6. Open the Serial Monitor and verify that readings are being collected.
7. Confirm that the backend receives and stores the measurements.

Use the appropriate local network address when connecting physical hardware to a backend running on your computer. The ESP32 generally cannot reach the computer through its own `localhost` address.

---

## 🔗 API Overview

The backend provides versioned API routes for device and sensor-data operations.

The following paths reflect the API structure developed for the project. Verify the available methods and request schemas in Swagger UI.

| Endpoint | Purpose |
|---|---|
| `/docs` | Interactive API documentation |
| `/api/v1/` | Versioned API route prefix |
| `/api/v1/sensor-readings/` | Sensor-reading operations |
| `/api/v1/alerts/` | Alert operations |
| Device routes under `/api/v1/` | Device registration and management, as implemented |

For exact request formats, response fields, and supported HTTP methods, refer to the running API documentation.

## 📊 Data Processing Workflow

1. The ESP32 collects readings from the connected sensors.
2. The device transmits the readings to the backend.
3. FastAPI validates the incoming payload and device identity.
4. The backend applies configured scoring and alert rules.
5. Valid readings and generated alerts are stored in PostgreSQL.
6. The dashboard retrieves the available data and presents measurements, trends, and alerts.
7. Historical measurements can be analyzed to identify changes over time.

## 🧪 Testing and Validation

Before treating the prototype as operational, test the following scenarios:

- Valid sensor readings from a registered device.
- Requests containing invalid or missing values.
- Readings from an unknown device.
- Values that cross configured alert thresholds.
- Missing or repeated readings that may indicate sensor problems.
- Database connectivity failures and network interruptions.
- Correct display of stored readings and alerts in the dashboard.
- Forecast performance against held-out historical observations, if forecasting is implemented.

Record the actual results of each test. Do not report accuracy, response times, or detection rates without measuring them.

## 🔒 Security Considerations

- Store secrets in environment variables rather than source code.
- Never expose privileged Supabase credentials in the frontend.
- Apply appropriate database access policies and Row Level Security where applicable.
- Validate incoming data on the backend.
- Restrict device and administrative operations to authorized clients.
- Use HTTPS and appropriate authentication for deployed environments.

## ⚠️ Limitations

- Water-quality measurements depend on sensor calibration, placement, and environmental conditions.
- Simulated measurements do not represent physical measurements.
- TDS, temperature, or pH measurements alone cannot establish that water is safe to drink.
- Threshold-based alerts may produce false positives or miss certain conditions.
- Sensor anomaly detection requires validation against realistic faults.
- Forecasts are estimates and may not generalize beyond the data used to develop them.
- Laboratory testing and appropriate regulatory methods are required for drinking-water safety verification.

## 🔮 Future Enhancements

- Integrate additional calibrated water-quality sensors.
- Improve sensor fault detection using statistical anomaly detection.
- Evaluate forecasting methods against larger historical datasets.
- Add configurable thresholds and device-specific monitoring profiles.
- Introduce notification channels for important alerts.
- Support offline buffering and reliable synchronization after connectivity is restored.
- Add device health monitoring and sensor calibration reminders.
- Evaluate the system across different water sources and operating conditions.

## 🌍 Potential Applications

- Campus and hostel water-storage monitoring.
- Building and facility management.
- Water tank monitoring.
- Preliminary water-quality trend analysis.
- Educational IoT and environmental monitoring projects.

These are potential applications, not claims of validated deployment.

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Commit your changes with clear messages.
5. Open a pull request describing the changes.

## 👨‍💻 Author

**Anantha Kumar B**

GitHub: [@ananthakumarbCSE](https://github.com/ananthakumarbCSE)

## 📄 License

Specify the project's license before redistributing or reusing its code. If you intend to publish the project as open source, add an appropriate `LICENSE` file to the repository.

---

**AquaGuardian: Monitor water-quality indicators. Detect anomalies. Support better decisions.**
