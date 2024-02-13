import { Component, Inject, Injectable, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TaskEditModalConfig } from './task-edit-modal.config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { YearLevel } from 'src/domain/Milestone';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Task } from 'src/domain/Task';
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
    if (this.currentTask) {
      this.taskForm = this.formBuilder.group({
        name: [this.taskName],   //this field is hidden if the task already exists
        description: [this.currentTask.description],
        taskType: [this.currentTask.taskType], 
        artifactName: [this.currentTask.artifactName],
        event: [this.currentTask.eventID]
      });
    }

    else {
      this.taskForm = this.formBuilder.group({
        name: [null, Validators.required],   //this field is hidden if the task already exists
        description: [null],
        taskType: ['artifact'], 
        artifactName: [null],
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

      updateData.id = this.currentTask.taskID as unknown as number;
      if (this.taskForm.get('description')) {
        updateData.description = this.taskForm.get('description')!.value;
      }
      if (this.taskForm.get('artifactName') && this.taskForm.get('artifactName')!.value.length > 0) {
        updateData.artifactName = this.taskForm.get('artifactName')!.value;
      }
      if (this.taskForm.get('taskType')) {
        updateData.taskType = this.taskForm.get('taskType')!.value;
      }
      if (this.taskForm.get('event')) {
        updateData.event = this.taskForm.get('event')!.value;
      }

      const url = constructBackendRequest(Endpoints.EDIT_TASK)
      this.http.post(url, updateData).subscribe(data => {
        this.closeModal();
      })
    }
    else {
      const newData: any = {};

      if (!this.taskForm.get('name')?.value) {
        window.alert("Please add a task name"); // probably change to a better error message
        return;
      }

      newData.name = this.taskForm.get('name')!.value;
      newData.yearLevel = this.tYearLevel;
      newData.isRequired = true; // for now
      if (this.taskForm.get('description')) {
        newData.description = this.taskForm.get('description')!.value;
      }

      //verify data
      if (this.taskForm.get('taskType')!.value == 'artifact' && (
            !this.taskForm.get('artifactName')?.value ||
            this.taskForm.get('artifactName')?.value.length == 0)) {
        window.alert("Please add an artifact name");
        return;
      }
      else if (this.taskForm.get('taskType')!.value == 'event' && (
          !this.taskForm.get('event')?.value ||
          this.taskForm.get('event')?.value.length == 0)) {
        window.alert("Please select an event");
        return;
      }

      if (this.taskForm.get('taskType')!.value == 'artifact') {
        newData.taskType = this.taskForm.get('taskType')!.value;
        newData.artifactName = this.taskForm.get('artifactName')!.value;
      }
      else if (this.taskForm.get('taskType')!.value == 'event') {
        newData.taskType = this.taskForm.get('taskType')!.value;
        newData.event = this.taskForm.get('event')!.value;
      }

      const url = constructBackendRequest(Endpoints.CREATE_TASK);
      this.http.post(url, newData).subscribe(data => {
        if (!data) {
          window.alert("Something went wrong");
          return;
        }
        this.closeModal();
      })
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

}

