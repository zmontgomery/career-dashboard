import { Component, Inject, Injectable, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TaskEditModalConfig } from './task-edit-modal.config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { YearLevel } from 'src/domain/Milestone';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Task } from 'src/domain/Task';
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import { HttpClient } from '@angular/common/http';
import { EventService } from 'src/app/dashboard/events/event.service';
import { Event } from 'src/domain/Event';


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
  public eventList!: Event[];

  taskForm!: FormGroup;
  dataLoaded: boolean = false;


  constructor(
    public dialogRef: MatDialogRef<TaskEditModalComponent>,
    private formBuilder: FormBuilder,
    public http: HttpClient,
    private eventService: EventService,
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
    this.eventService.getEvents().subscribe(events => {
      this.eventList = events;
      this.dataLoaded = true; // prevents creating the form until we have the events
      this.createForm();
    })
  }

  /**
   * Creates the FormGroup using the provided task data or left blank
   */
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
        name: [null, Validators.required],
        description: [null],
        taskType: ['artifact'], // default type 
        artifactName: [null],
        event: [null]
      });
    }
  }

  /**
   * Used to determine whether to display the artifact name textbox or event selection
   */
  getTaskType(): string {
    return this.taskForm.get('taskType')?.value || 'artifact';
  }

  /**
   * Takes task data from the form and sends the POST request
   * Either update task or create task, depending on whether there is a currentTask
   */
  saveTask() {
    if (this.currentTask) {
      const updateData: any = {};

      updateData.id = this.currentTask.taskID as unknown as number;
      if (this.taskForm.get('description')) {
        updateData.description = this.taskForm.get('description')!.value;
      }

      // verify that task type specific fields are filled in
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

      // only include the task type specific fields
      if (this.taskForm.get('taskType')!.value == 'artifact') {
        updateData.taskType = this.taskForm.get('taskType')!.value;
        updateData.artifactName = this.taskForm.get('artifactName')!.value;
      }
      else if (this.taskForm.get('taskType')!.value == 'event') {
        updateData.taskType = this.taskForm.get('taskType')!.value;
        updateData.event = "" + this.taskForm.get('event')!.value;  //endpoint expects string
      }

      const url = constructBackendRequest(Endpoints.EDIT_TASK)
      this.http.post(url, updateData).subscribe(data => {
        if (!data) {
          window.alert("Something went wrong editing task");
          return;
        }
        window.alert("Task saved");
        this.closeModal();
      })
    }
    else {
      const newData: any = {};

      if (!this.taskForm.get('name')?.value) {
        window.alert("Please add a task name");
        return;
      }

      newData.name = this.taskForm.get('name')!.value;
      newData.yearLevel = this.tYearLevel;
      newData.isRequired = true; // for now
      if (this.taskForm.get('description')) {
        newData.description = this.taskForm.get('description')!.value;
      }

      // verify that task type specific fields are filled in
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

      // only include the task type specific fields
      if (this.taskForm.get('taskType')!.value == 'artifact') {
        newData.taskType = this.taskForm.get('taskType')!.value;
        newData.artifactName = this.taskForm.get('artifactName')!.value;
      }
      else if (this.taskForm.get('taskType')!.value == 'event') {
        newData.taskType = this.taskForm.get('taskType')!.value;
        newData.event = "" + this.taskForm.get('event')!.value;
      }

      const url = constructBackendRequest(Endpoints.CREATE_TASK);
      this.http.post(url, newData).subscribe(data => {
        if (!data) {
          window.alert("Something went wrong creating task");
          return;
        }
        window.alert("Task created");
        this.closeModal();
      })
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

}

