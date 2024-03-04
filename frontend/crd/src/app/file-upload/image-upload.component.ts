import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import { LangUtils } from '../util/lang-utils';
import {ImageCroppedEvent} from "ngx-image-cropper";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

/**
 * Component to upload artifacts to the server
 */
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.less']
})
export class ImageUploadComponent implements OnInit {
  status: "initial" | "uploading" | "success" | "error" | "cropping" = "initial"; // Variable to store file status
  rawFile: File | undefined; // Variable to store file
  croppedFile: Blob | undefined | null = null; // Variable to store file
  croppedImageUrl: SafeUrl = '';

  private maxSizeMegaBytes = 10;
  private maxSizeBytes = this.maxSizeMegaBytes * 1024 * 1024; // 10 MB

  @Output() artifactIdEmitter: EventEmitter<number> = new EventEmitter();
  @Output() closeEmitter: EventEmitter<number> = new EventEmitter();
  @Input() uploadStrategy: null | ((formData: FormData) => Observable<number>)  = null;

  protected acceptedFileTypes: string = ".png, .jpeg";

  constructor(
    private sanitizer: DomSanitizer,
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
        this.status = "cropping";
        this.rawFile = file;
      }
    }
  }

  /**
   * Deletes the artifact
   */
  onCancel() {
    this.status = "initial";
    this.rawFile = undefined;
    this.croppedFile = null
  }

  /**
   * Uploads a file to the server and returns the artifact id of the newly created
   * artifact
   */
  onUpload() {
    if (this.croppedFile != null && this.rawFile != undefined) {
      const formData = new FormData();

      formData.append('file', this.croppedFile, this.rawFile.name);

      if (this.uploadStrategy != null) {
        let upload$: Observable<number>;
        upload$ = this.uploadStrategy(formData);

        this.status = 'uploading';

        upload$.pipe(
          // FIXME this does not seem to work so added check for null below
          catchError(error => {
            this.status = 'error';
            console.log(error);
            return of(0);
          })
        ).subscribe((artifactId) => {
          if (artifactId == null) {
            this.status = 'error';
            console.log('fail');
          } else {
            this.artifactIdEmitter.next(artifactId);
            this.status = 'success';
            this.closeModal(1000);
          }
        });
      } else {
        this.status = 'error';
        console.error("Upload strategy not set");
      }
    }
  }

  /**
   * Formats the string based on the size of the file
   */
  formatBytes(): string {
    if (!LangUtils.exists(this.rawFile)) return '0 bytes';
    if (this.rawFile!.size > 1000000) return `${(this.rawFile!.size / 1000000).toFixed(2)} mb`
    else if (this.rawFile!.size > 1000) return `${(this.rawFile!.size / 1000).toFixed(2)} kb`
    else return `${this.rawFile!.size} bytes`;
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl != null) {
      this.croppedImageUrl = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      this.croppedFile = event.blob;
    }
  }

  doneCropping() {
    this.status = 'initial'
  }

  closeModal(waitTime: number = 0) {
    this.closeEmitter.emit(waitTime);
  }
}

export enum UploadType {
  EventImage,
  ProfileImage
}
