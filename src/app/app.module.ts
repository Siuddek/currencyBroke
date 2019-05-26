import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import {MatSelectModule} from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CurrencyChartComponent } from './components/currency-chart/currency-chart.component';
import { ChartsModule, WavesModule, CollapseModule  } from 'angular-bootstrap-md'
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ButtonsModule, CardsFreeModule } from 'angular-bootstrap-md'


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CurrencyChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSelectModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MDBBootstrapModule.forRoot(),
    ChartsModule,
    WavesModule,
    MatRadioModule,
    FormsModule,
    CollapseModule,
    ButtonsModule,
    CardsFreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
