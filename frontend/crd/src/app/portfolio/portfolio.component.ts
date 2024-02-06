import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FileUploadComponent} from "../file-upload/file-upload.component";
import {constructBackendRequest, Endpoints} from "../util/http-helper";
import {User} from "../../domain/User";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    this.dialog.open(FileUploadComponent, {
      data: {url: constructBackendRequest(Endpoints.RESUME)}
    });
  }
}
