import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss'],
})
export class LoginScreen {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: ApiService, private alertController: AlertController) { }

  async onLogin() {
    if (!this.email || !this.password) {
      this.showAlert('Please enter both email and password.');
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      async (response) => {
        if (response && response.success.token) {
          this.authService.setToken(response.success.token);
          await this.router.navigate(['/map'], { replaceUrl: true });
        } else {
          this.showAlert('Login failed. Please check your credentials.');
        }
      },
      (error) => {
        console.error('Login error:', error);
        this.showAlert('Login failed. Please try again.');
      }
    );
  }

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Login Error',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
