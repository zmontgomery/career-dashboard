import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { SettingsPageComponent } from './settings-page.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    SettingsPageComponent,
  ],
    imports: [
        CommonModule,
        MatButtonModule,
        NgOptimizedImage,
        MatIconModule,
    ],
})
export class SettingsPageModule { }
