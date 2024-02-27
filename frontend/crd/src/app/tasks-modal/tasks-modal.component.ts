import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
@Component({
  selector: 'tasks-modal',
  templateUrl: './tasks-modal.component.html',
  styleUrls: ['./tasks-modal.component.less']
})
export class TasksModalComponent implements OnInit{
  showUploadButton: boolean = true;
  pdfURL: any = '';
  constructor(
    public dialogRef: MatDialogRef<TasksModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected modalData: any,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() { }

  actionFunction() {
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }

}
