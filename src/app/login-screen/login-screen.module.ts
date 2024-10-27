import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginScreenRoutingModule } from './login-screen-routing.module';
import { LoginScreen } from './login-screen.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginScreenRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginScreenModule { }
