import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { OswegoLogoComponent } from './oswego-logo.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    OswegoLogoComponent,
  ],
  exports: [
    OswegoLogoComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatButtonModule
  ]
})
export class OswegoLogoModule { }
