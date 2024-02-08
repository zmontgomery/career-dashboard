import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutButtonComponent } from './logout-button.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    LogoutButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [LogoutButtonComponent]
})
export class LogoutButtonModule { }
