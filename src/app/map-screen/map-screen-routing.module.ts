import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapScreenComponent } from './map-screen.component';

const routes: Routes = [{
  path: '',
  component: MapScreenComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapScreenRoutingModule { }
