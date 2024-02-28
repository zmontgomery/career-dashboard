import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import { LangUtils } from '../util/lang-utils';
import { ArtifactService } from './artifact.service';
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
  status: "initial" | "uploading" | "success" | "fail" | "cropping" = "initial"; // Variable to store file status
  rawFile: File | undefined; // Variable to store file
  croppedFile: Blob | undefined | null = null; // Variable to store file
  croppedImageUrl: SafeUrl = '';

  private maxSizeMegaBytes = 10;
  private maxSizeBytes = this.maxSizeMegaBytes * 1024 * 1024; // 10 MB

  @Output() artifactIdEmitter: EventEmitter<number> = new EventEmitter();
  @Output() closeEmitter: EventEmitter<number> = new EventEmitter();
  @Input() uploadType: UploadType = UploadType.EventImage;
  @Input() uploadID: number | null = null;

  protected acceptedFileTypes: string = "png,jpeg";

  constructor(
    private readonly artifactService: ArtifactService,
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

      let upload$: Observable<number>;
      switch (this.uploadType) {
        case UploadType.EventImage:
          if (this.uploadID == null) {
            console.error('No ID for event');
            this.status = 'fail';
            return
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
        this.artifactIdEmitter.next(artifactId);
        this.status = 'success';
        this.closeModal(1000);
      });
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
