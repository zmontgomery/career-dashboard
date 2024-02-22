import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {FileUploadComponent} from "../file-upload/file-upload.component";
import {constructBackendRequest, Endpoints} from "../util/http-helper";
import {ArtifactService} from "../portfolio/artifact.service";
import {HttpClient} from "@angular/common/http";
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
    private readonly artifactService: ArtifactService,
    private http: HttpClient,
  ) {
    console.log(this.modalData);
  }

  ngOnInit() { }

  actionFunction() {
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }
  openDialog(): void {
    this.dialog.open(FileUploadComponent, {
      data: {url: constructBackendRequest(Endpoints.RESUME)}
    })
      // this could definitely be optimized, but for now we can do this
      .afterClosed().subscribe(this.updateArtifacts.bind(this))
  }

  private updateArtifacts() {
    this.artifactService.getPortfolioArtifacts().subscribe((artifacts) => {
      // need different way to get resume since the name is defined by the user
      // const resume = artifacts.find((artifact) => artifact.name == "resume.pdf")
      const resume = artifacts[0]

      if (resume !== undefined) {

        this.http.get(constructBackendRequest(`${Endpoints.PORTFOLIO}/${resume.artifactID}`), { responseType: 'blob'})
          .subscribe((response) => {
            const file = new Blob([response], { type: 'application/pdf' });
            this.pdfURL = URL.createObjectURL(file);
            this.showUploadButton = false;
          })
      }
    });
  }

}
