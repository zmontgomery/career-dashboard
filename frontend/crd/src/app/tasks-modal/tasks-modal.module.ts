import { NgModule } from '@angular/core';
import { TasksModalComponent } from './tasks-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {PdfViewerModule} from "ng2-pdf-viewer";

@NgModule({
  declarations: [
    TasksModalComponent
  ],
  exports:[
    TasksModalComponent
  ],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    NgIf,
    PdfViewerModule
  ]
})
export class TasksModalModule { }
