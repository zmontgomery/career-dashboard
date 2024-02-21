import {Component, EventEmitter, Output} from '@angular/core';
import { catchError, of } from 'rxjs';
import { LangUtils } from '../util/lang-utils';
import { ArtifactService } from './artifact.service';

/**
 * Component to upload artifacts to the server
 */
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.less']
})
export class FileUploadComponent {
  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file: File | null = null; // Variable to store file
  artifactId: number = 1;

  private maxSizeMegaBytes = 10;
  private maxSizeBytes = this.maxSizeMegaBytes * 1024 * 1024; // 10 MB

  @Output() artifactIdEmitter: EventEmitter<number> = new EventEmitter();


  constructor(
    private readonly artifactService: ArtifactService
  ) { }

  /**
   * Loads the file
   */
  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      if (file.size > this.maxSizeBytes) {
        alert(`File size exceeds the maximum allowed size (${this.maxSizeMegaBytes} MB).`)
        // Display an error message or perform other actions
        console.error(`File size exceeds the maximum allowed size (${this.maxSizeMegaBytes} MB).`);
      } else {
        // File is within the allowed size, proceed with handling
        this.status = "initial";
        this.file = file;
      }
    }
  }

  /**
   * Deletes the artifact
   */
  onCancel() {
    this.file = null;
    if (this.status === 'success' && this.artifactId !== 1) {
      this.artifactService.deleteArtifact(this.artifactId).subscribe();
    }
    this.artifactIdEmitter.next(0);
  }

  /**
   * Uploads a file to the server and returns the artifact id of the newly created
   * artifact
   */
  onUpload() {
    if (this.file) {
      const formData = new FormData();

      formData.append('file', this.file, this.file.name);

      const upload$ = this.artifactService.uploadArtifact(formData);

      this.status = 'uploading';

      upload$.pipe(
        catchError((error) => {
          this.status = 'fail';
          console.log(error);
          return of(0);
        })
      ).subscribe((artifactId) => {
        this.artifactId = artifactId;
        this.artifactIdEmitter.next(artifactId);
        this.status = 'success';
      });
    }
  }

  /**
   * Formats the string based on the size of the file
   */
  formatBytes(): string {
    if (!LangUtils.exists(this.file)) return '0 bytes';
    if (this.file!.size > 1000000) return `${(this.file!.size / 1000000).toFixed(2)} mb`
    else if (this.file!.size > 1000) return `${(this.file!.size / 1000).toFixed(2)} kb`
    else return `${this.file!.size} bytes`;
  }
}
