import {MatIconModule} from "@angular/material/icon";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { OswegoLogoModule } from "../oswego-logo/oswego-logo.module";



@NgModule({
  declarations: [
    FooterComponent,
  ],
  exports: [
  FooterComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    OswegoLogoModule,
  ]

})
export class FooterModule { }
