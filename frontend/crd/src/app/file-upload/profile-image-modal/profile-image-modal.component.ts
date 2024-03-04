import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable} from "rxjs";
import {ArtifactService} from "../artifact.service";


@Component({
  selector: 'app-image-upload-modal',
  templateUrl: './profile-image-modal.component.html',
  styleUrls: ['./profile-image-modal.component.less']
})
@Injectable()
export class ProfileImageModalComponent implements OnInit {
  uploadStrategy: ((formData: FormData) => Observable<number>) | null;

  constructor(
    public dialogRef: MatDialogRef<ProfileImageModalComponent>,
    private artifactService: ArtifactService,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
  ) {
    this.uploadStrategy = (data) => {
      return this.artifactService.uploadProfilePicture(data);
    }
    this.uploadStrategy.bind(this);
  }

  ngOnInit() {

  }

  closeModal(waitTime: number) {
    setTimeout(() => this.dialogRef.close(), waitTime);
  }
}
