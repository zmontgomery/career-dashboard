import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable} from "rxjs";
import {ArtifactService} from "../artifact.service";

/**
 * yup
 */
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

  /**
   * Close the modal after a delay. sends update for profile pic if not 0 delay
   * @param waitTime time to delay closing
   */
  closeModal(waitTime: number) {
    setTimeout(() => this.dialogRef.close(waitTime > 0), waitTime);
  }
}
