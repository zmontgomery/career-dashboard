import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import { LangUtils } from '../util/lang-utils';
import { ArtifactService } from './artifact.service';

/**
 * Component to upload artifacts to the server
 */
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.less']
})
export class ImageUploadComponent implements OnInit {
  status: "initial" | "uploading" | "success" | "fail" | "bad-ratio" = "initial"; // Variable to store file status
  file: File | null = null; // Variable to store file
  filePreviewUrl: string = ''
  artifactId: number = 1;

  private maxSizeMegaBytes = 10;
  private maxSizeBytes = this.maxSizeMegaBytes * 1024 * 1024; // 10 MB

  @Output() artifactIdEmitter: EventEmitter<number> = new EventEmitter();
  @Input() uploadType: UploadType = UploadType.EventImage;
  @Input() uploadID: number | null = null;

  protected acceptedFileTypes: string = "png,jpeg";

  constructor(
    private readonly artifactService: ArtifactService
  ) { }

  ngOnInit() {

  }

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
        this.filePreviewUrl = URL.createObjectURL(file);

        const img = new Image();
        img.src = this.filePreviewUrl;

        img.onload = () => {
          const aspectRatio = img.width / img.height;

          if (isNaN(aspectRatio)){
            console.error('Unable to get image aspect ratio')
            this.status = 'bad-ratio';
          }
          else if(Math.round(aspectRatio * 2) !== 5) {
            console.error(`photo should be 5 / 2 ration, but was ${aspectRatio}`);
            this.status = 'bad-ratio';
          }
        };
      }
    }
  }

  /**
   * Deletes the artifact
   */
  onCancel() {
    this.status = "initial";
    this.file = null;
    this.filePreviewUrl = '';
  }

  /**
   * Uploads a file to the server and returns the artifact id of the newly created
   * artifact
   */
  onUpload() {
    if (this.file) {
      const formData = new FormData();

      formData.append('file', this.file, this.file.name);

      let upload$: Observable<number>;
      switch (this.uploadType) {
        case UploadType.EventImage:
          if (this.uploadID == null) {
            console.error('No ID for event');
            this.status = 'fail';
            upload$ = of(0);
          } else {
            upload$ = this.artifactService.uploadEventImage(formData, this.uploadID);
          }
          break;
        case UploadType.ProfileImage:
          upload$ = this.artifactService.uploadProfilePicture(formData)
          break;
      }

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
        // TODO close after successful upload
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

export enum UploadType {
  EventImage,
  ProfileImage
}
