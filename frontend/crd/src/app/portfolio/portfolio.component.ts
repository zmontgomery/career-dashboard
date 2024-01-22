import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FileUploadComponent} from "../file-upload/file-upload.component";
import {constructBackendRequest, Endpoints} from "../util/http-helper";
import {ArtifactService} from "./artifact.service";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent {
  showUploadButton: boolean = true;
  pdfURLBase = 'http://localhost:8080/api/portfolio/';
  pdfURL: string = '';

  constructor(
    public dialog: MatDialog,
    private readonly artifactService: ArtifactService
  ) {
    this.artifactService.getPortfolioArtifacts().subscribe((artifacts) => {
      // need different way to get resume since the name is defined by the user
      const resume = artifacts.find((artifact) => artifact.name == "resume.pdf")

      if (resume !== undefined) {
        this.pdfURL = this.pdfURLBase + resume.id;
        this.showUploadButton = false;
      }
    });
  }

  openDialog(): void {
    this.dialog.open(FileUploadComponent, {
      data: {url: constructBackendRequest(Endpoints.RESUME)}
    });
  }
}
