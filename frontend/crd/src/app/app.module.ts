import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {MatCardModule} from "@angular/material/card";
import {DashboardModule} from "./dashboard/dashboard.module";
import {PortfolioModule} from "./portfolio/portfolio.module";
import { ApiDocumentationsComponent } from './api-documentations/api-documentations.component';

@NgModule({
  declarations: [
    AppComponent,
    ApiDocumentationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DashboardModule,
    PortfolioModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
