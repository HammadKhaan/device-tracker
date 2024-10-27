import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreen } from './login-screen.component';

const routes: Routes = [{
  path: '',
  component: LoginScreen
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginScreenRoutingModule { }
