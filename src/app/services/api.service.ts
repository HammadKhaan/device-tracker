import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://connect.paj-gps.de/api/v1';
  private token: string | null = null;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/login?email=${email}&password=${password}`;
    return this.http.post(url, {});
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getDevices(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) return new Observable();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/device`, { headers });
  }

  getTrackingData(deviceId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) return new Observable();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.baseUrl}/trackerdata/${deviceId}/last_points?lastPoints=50`, { headers });
  }
}
