import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {MatCardModule} from "@angular/material/card";
import {DashboardModule} from "./dashboard/dashboard.module";
import {PortfolioModule} from "./portfolio/portfolio.module";
import { NavbarComponent } from './navbar/navbar.component';
import {MatTabsModule} from "@angular/material/tabs";
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ProfileModule} from "./profile/profile.module";
import {MilestonesPageModule} from "./milestones-page/milestones-page.module";
import {OswegoLogoModule} from "./oswego-logo/oswego-logo.module";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DashboardModule,
    PortfolioModule,
    ProfileModule,
    MilestonesPageModule,
    MatCardModule,
    MatTabsModule,
    RouterModule,
    BrowserAnimationsModule,
    OswegoLogoModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
