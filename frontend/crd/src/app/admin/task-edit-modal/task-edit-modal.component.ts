import { Component, Inject, Injectable, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TaskEditModalConfig } from './task-edit-modal.config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { YearLevel } from 'src/domain/Milestone';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Task } from 'src/domain/Task';
import { FloatLabelType } from '@angular/material/form-field';
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-task-edit-modal',
  templateUrl: './task-edit-modal.component.html',
  styleUrls: ['./task-edit-modal.component.less']
})
@Injectable()
export class TaskEditModalComponent implements OnInit {

  public taskName: string = '';
  tYearLevel: YearLevel = YearLevel.Freshman; //default
  public currentTask: Task | undefined;

  taskForm!: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<TaskEditModalComponent>,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
  ) {

    if (this.modalData.task) {
      this.taskName = this.modalData.name;
      this.currentTask = this.modalData.task;
      this.tYearLevel = this.modalData.task.yearLevel;
    }
    else {
      this.tYearLevel = this.modalData.name;
      this.taskName = '';
    }
  }

  ngOnInit() { 
    this.createForm();
  }

  createForm() {
    console.log("creating form for");
    console.log(this.taskName);
    console.log(this.tYearLevel);

    if (this.currentTask) {
      this.taskForm = this.formBuilder.group({
        name: [this.taskName],   //this field is hidden if the task already exists
        description: [this.currentTask.description],
        taskType: ['artifact' as FloatLabelType], 
        artifactName: [null],
        artifactType: [null],
        event: [null]
      });

      //TODO: once we can differentiate artifact tasks and event tasks
      // if (this.currentTask.needsArtifact) {
      //   this.taskForm.get('taskType')?.setValue('artifact');
      // }
      // else {
      //   this.taskForm.get('taskType')?.setValue('event');
      // }
    }

    else {
      this.taskForm = this.formBuilder.group({
        name: [null, Validators.required],   //this field is hidden if the task already exists
        description: [null],
        taskType: ['artifact' as FloatLabelType], 
        artifactName: [null],
        artifactType: [null],
        event: [null]
      });
    }

  }

  getTaskType(): string {
    return this.taskForm.get('taskType')?.value || 'artifact';
  }

  saveTask() {

    if (this.currentTask) {
      const updateData: any = {};

      updateData.id = this.currentTask.id as unknown as number;
      if (this.taskForm.get('description')) {
        updateData.description = this.taskForm.get('description')!.value;
      }
      //TODO: add the rest of the fields

      const url = constructBackendRequest(Endpoints.EDIT_TASK)
      this.http.post(url, updateData).subscribe(data => {
        console.log("task has been updated");
        console.log(data);
      })
    }

    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }

}

