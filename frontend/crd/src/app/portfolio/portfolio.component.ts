import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FileUploadComponent} from "../file-upload/file-upload.component";
import {constructBackendRequest, Endpoints} from "../util/http-helper";
import { AuthService } from '../security/auth.service';
import { LangUtils } from '../util/lang-utils';
import { User } from '../security/domain/user';
import {ArtifactService} from "./artifact.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent implements OnInit{
  constructor(
    public dialog: MatDialog, 
    public authService: AuthService,
    private readonly artifactService: ArtifactService,
    private http: HttpClient,
    ) {
      this.updateArtifacts();
    }

  user: User = User.makeEmpty();
  showUploadButton: boolean = true;
  pdfURL: any = '';

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (LangUtils.exists(user)) {
        this.user = user!;
      }
    });
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

  openDialog(): void {
    this.dialog.open(FileUploadComponent, {
      data: {url: constructBackendRequest(Endpoints.RESUME)}
    })
      // this could definitely be optimized, but for now we can do this
      .afterClosed().subscribe(this.updateArtifacts.bind(this))
  }
}
