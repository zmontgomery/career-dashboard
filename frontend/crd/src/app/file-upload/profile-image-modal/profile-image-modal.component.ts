import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-image-upload-modal',
  templateUrl: './profile-image-modal.component.html',
  styleUrls: ['./profile-image-modal.component.less']
})
@Injectable()
export class ProfileImageModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProfileImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
  ) {
  }

  ngOnInit() {

  }

  closeModal(waitTime: number) {
    setTimeout(() => this.dialogRef.close(), waitTime);
  }
}
