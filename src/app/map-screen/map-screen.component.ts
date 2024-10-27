import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import * as maplibregl from 'maplibre-gl';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';

interface DeviceData {
  id: number;
  name: string;
  isExpanded?: boolean;
}

interface TrackingPoint {
  lat: number;
  lng: number;
}

interface DeviceLastLocation extends TrackingPoint {
  id: number;
  name: string;
}

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.scss'],
})
export class MapScreenComponent implements OnInit {
  devicesData: DeviceData[] = [];
  polylineCoordinates: [number, number][] = [];
  map: any = null;
  devicesLastLocation: DeviceLastLocation[] = [];
  trackingData: TrackingPoint[] | null = null;
  routeData: TrackingPoint[] = [];
  initialCoordinates: [number, number] = [6.957793682813644, 50.9422874785674];
  markers: maplibregl.Marker[] = [];
  directionalMarkers: maplibregl.Marker[] = [];
  clientMarker: maplibregl.Marker | null = null;

  constructor(
    private apiService: ApiService,
    private menuCtrl: MenuController,
    private router: Router,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === '/map') {
      } else {
        this.router.navigate(['/map']);
      }
    });
    this.getClientsLocation();
    this.loadDevices();
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: this.initialCoordinates,
      zoom: 4,
    });

    this.map.on('error', (err: string) => {
      console.error('Map failed to load.');
    });
  }

  fitMap() {
    if (this.map?.getLayer('route-line')) {
      this.map.removeLayer('route-line');
      this.cleardirectionalMarkers();
      this.map.removeSource('route');
    }
    this.loadDevices();
    this.getClientsLocation();
    this.closeMenu();
    this.map?.flyTo({
      center: this.initialCoordinates,
      essential: true,
      zoom: 4,
    });
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  toggleSubMenu(device: DeviceData) {
    device.isExpanded = !device.isExpanded;
  }

  fetchRouteData(deviceId: number) {
    if (this.map?.getLayer('route-line')) {
      this.map.removeLayer('route-line');
      this.cleardirectionalMarkers();
      this.map.removeSource('route');
    }
    this.removeMarkers();
    this.closeMenu();
    this.apiService.getTrackingData(deviceId).subscribe(
      (response: { success: TrackingPoint[] }) => {
        if (response && response.success) {
          this.routeData = response.success;
          this.addRouteToMap();
        }
      },
      (error) => {
        console.error('Error fetching route data', error);
      }
    );
  }

  addRouteToMap() {
    if (this.routeData.length === 0) return;

    const coordinates = this.routeData.map((point) => [point.lng, point.lat] as [number, number]);
    this.map?.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
      },
    });

    this.map?.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#007cbf',
        'line-width': 4,
      },
    });

    this.addDirectionalMarkers(coordinates);
  }

  addDirectionalMarkers(coordinates: [number, number][]) {
    coordinates.forEach((coordinate, index) => {
      const color = index === 0 ? 'green' : index === coordinates.length - 1 ? 'red' : 'yellow';

      const marker = new maplibregl.Marker({ color })
        .setLngLat(coordinate)
        .addTo(this.map as maplibregl.Map);

      const popupText = index === 0 ? 'Start' : index === coordinates.length - 1 ? 'End' : null;
      if (popupText) {
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`<h5 style='color: black'>${popupText}</h5>`);
        marker.setPopup(popup).togglePopup();
      }

      this.directionalMarkers.push(marker);
    });
    this.map?.flyTo({
      center: coordinates[0],
      essential: true,
      zoom: 12,
    });
  }

  cleardirectionalMarkers() {
    this.directionalMarkers.forEach((marker) => marker.remove());
    this.directionalMarkers = [];
  }

  loadDevices() {
    this.apiService.getDevices().subscribe((response: { success: DeviceData[] }) => {
      this.devicesData = response.success.map((device) => ({
        id: device.id,
        name: device.name,
        isExpandable: false,
      }));

      this.devicesData.forEach((device) => {
        this.loadTrackingData(device.id, device.name);
      });
    });
  }

  loadTrackingData(deviceId: number, deviceName: string) {
    this.apiService.getTrackingData(deviceId).subscribe((response: { success: TrackingPoint[] }) => {
      const trackingData = response.success;

      if (trackingData.length > 0) {
        const deviceLastLocation: DeviceLastLocation = {
          id: deviceId,
          name: deviceName,
          lat: trackingData[0].lat,
          lng: trackingData[0].lng,
        };
        this.devicesLastLocation.push(deviceLastLocation);
        this.addMarker(deviceLastLocation);
      }
    });
  }

  addMarker(deviceLastLocation: DeviceLastLocation) {
    const { name, lng, lat } = deviceLastLocation;
    const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
      `<h3 style='color: black;'>${name}</h3><p style='color: black;'>Last seen at [${lng}, ${lat}]</p>`
    );
    const marker = new maplibregl.Marker()
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(this.map as maplibregl.Map);
    this.markers.push(marker);
  }

  removeMarkers() {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }

  flyToCoordinates(deviceId: number, deviceName: string): null {
    this.loadTrackingData(deviceId, deviceName);
    if (this.map?.getLayer('route-line')) {
      this.map.removeLayer('route-line');
      this.cleardirectionalMarkers();
      this.map.removeSource('route');
    }
    this.closeMenu();
    const device = this.devicesLastLocation.find((d) => d.id === deviceId);
    if (device) {
      this.map?.flyTo({
        center: [device.lng, device.lat],
        essential: true,
        zoom: 12,
      });
    } else {
      console.error(`Device with ID ${deviceId} not found.`);
    }
    return null;
  }

  async getClientsLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    const popup = new maplibregl.Popup({ offset: 25 }).setHTML("<h5 style='color: black'>Your Location</h5>");
    this.clientMarker = new maplibregl.Marker({
      element: this.createCustomMarkerElement('../../assets/your-location.webp'),
    })
      .setLngLat([coordinates.coords.longitude, coordinates.coords.latitude])
      .setPopup(popup)
      .addTo(this.map as maplibregl.Map)
      .togglePopup();
  }

  createCustomMarkerElement(iconUrl: string): HTMLElement {
    const markerElement = document.createElement('div');
    markerElement.className = 'client-marker';
    markerElement.style.backgroundImage = `url(${iconUrl})`;
    markerElement.style.width = '40px';
    markerElement.style.height = '40px';
    markerElement.style.backgroundSize = 'cover';
    return markerElement;
  }

  removeClientMarker() {
    if (this.clientMarker) {
      this.clientMarker.remove();
      this.clientMarker = null;
    }
    this.closeMenu();
  }

  addClientMarker() {
    if (!this.clientMarker) {
      this.getClientsLocation();
    }
    this.closeMenu();
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}
