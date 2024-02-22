import { Component } from '@angular/core';
import {TasksService} from "./tasks.service";
import {Task} from "../../domain/Task";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TasksModalComponent } from '../tasks-modal/tasks-modal.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.less']
})
export class TasksComponent {

  constructor(
    private tasksService: TasksService,
    public matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.tasksService.getTasks().subscribe((tasks: Task[]) => {
      this.tasksList = tasks;
    });
  }

  openLogoutModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      name: "logout",
      title: "Are you sure you want to logout?",
      description: "Pretend this is a convincing argument on why you shouldn't logout :)",
      actionButtonText: "Logout",
    }
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(TasksModalComponent, dialogConfig);
  }

  openDeleteProductModal() {
    const productId = "prod01";
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      name: "deleteProduct",
      title: "Are you sure you want to delete this product?",
      description: "If you continue, the product with ID " + productId + " will be deleted.",
      actionButtonText: "Delete",
      productId: productId
    }
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(TasksModalComponent, dialogConfig);
  }

  openTask(task: any) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "80%";
    dialogConfig.width = "60%";
    dialogConfig.data = {
      name: task.name,
      title: "TASK",
      description: task.description,
      actionButtonText: "Complete",
      productId: task.id
    }
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(TasksModalComponent, dialogConfig);
  }

  tasksList: Array<Task> = []
}
