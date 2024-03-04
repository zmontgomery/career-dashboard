import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { SettingsPageComponent } from './settings-page.component';
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    SettingsPageComponent,
  ],
    imports: [
        CommonModule,
        MatButtonModule,
        NgOptimizedImage,
    ],
})
export class SettingsPageModule { }
