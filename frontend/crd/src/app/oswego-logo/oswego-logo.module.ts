import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { OswegoLogoComponent } from './oswego-logo.component';



@NgModule({
  declarations: [
    OswegoLogoComponent,
  ],
  exports: [
    OswegoLogoComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage
  ]
})
export class OswegoLogoModule { }
