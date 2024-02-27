import { NgModule } from '@angular/core';
import { TasksModalComponent } from './tasks-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {SubmissionModalModule} from "../submissions/submission-modal/submission-modal.module";
import {TaskSubmitButtonModule} from "../task-submit-button/task-submit-button.module";


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
        SubmissionModalModule,
        TaskSubmitButtonModule
    ]
})
export class TasksModalModule { }
