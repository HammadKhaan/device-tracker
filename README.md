# Device Tracking Application Using MapLibre GL

## 🛠️ Overview
This repository contains a demo application created for device tracking using a mapping library MapLibre GL. The project integrates the **PAJ GPS API** to provide an interactive experience for managing GPS devices and visualizing tracking data.

Quickly have a look of the app on this link: https://hammadkhaan.github.io/device-tracker/login
- Email: testkunde@paj-gps.de
- Password: App123%23%23%23...

## ✨ Features
- **🔒 Login Integration**: Secure OAuth login using the PAJ GPS API.
- **📋 Device Management**:
  - List all devices associated with the account.
  - Navigate to a device’s last known location with a smooth transition.
- **🗺️ Map Visualization**:
  - Display the last known positions of all devices using markers.
  - Show tracking routes with polylines and directional markers.
  - Display the client’s current location.
- **🎨 Enhanced UI/UX**:
  - Custom splash screen.
  - Mobile responsiveness using Ionic.

## 🚀 Tools and Technologies
- **Framework**: [Angular](https://angular.io/) with [Ionic](https://ionicframework.com/).
- **Mapping Library**: [MapLibre GL](https://maplibre.org/).
- **API Communication**: OAuth-based authentication with the **PAJ GPS API**.

## 📡 API Endpoints
- **Login**: Get an OAuth token.
  - `POST https://connect.paj-gps.de/api/v1/login`
- **Get All Devices**: Retrieve the list of devices associated with the account.
  - `GET https://connect.paj-gps.de/api/device`
- **Get Tracking Data**: Fetch the last 50 tracking points for a specific device.
  - `GET https://connect.paj-gps.de/api/trackerdata/[DEVICE_ID]/last_points?lastPoints=50`

## 🛠️ How to Run the Application
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/HammadKhaan/device-tracker.git
   cd device-tracker
2. **Install Dependencies**:
    ```bash
   npm install
3. **Run the Development Server**:
    ```bash
    ionic serve
4. **Access the App**:
   - Open your browser and navigate to your local host, where your app is running
     
5. **Login Credentials**:
   - **Email**: testkunde@paj-gps.de
   - **Password**: App123%23%23%23...
