import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MapComponent } from '@maplibre/ngx-maplibre-gl';

import { MapScreenRoutingModule } from './map-screen-routing.module';
import { MapScreenComponent } from './map-screen.component';
import { ApiService } from '../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [MapScreenComponent],
  imports: [
    CommonModule,
    IonicModule,
    MapScreenRoutingModule,
    MapComponent,
    HttpClientModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ApiService],
})
export class MapScreenModule { }
