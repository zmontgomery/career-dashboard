import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioComponent } from './portfolio.component';
import {MockComponent} from "ng-mocks";
import {MilestonesComponent} from "../milestones-page/milestones/milestones.component";
import {MatDialog} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {constructBackendRequest, Endpoints} from "../util/http-helper";
import {FileUploadComponent} from "../file-upload/file-upload.component";
import {ArtifactService} from "../file-upload/artifact.service";
import {of} from "rxjs";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Artifact} from "../../domain/Artifact";

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;
  let matDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed'])
  matDialogRef.afterClosed.and.returnValue(of())
  let matDialog = jasmine.createSpyObj('MatDialog', ['open']);
  matDialog.open.and.returnValue(matDialogRef)
  let artifactSvc = jasmine.createSpyObj('ArtifactService', ['getPortfolioArtifacts']);
  const artifact1JSON = {
    fileName: "string",
    id: 1,
    submissionDate: new Date(),
    submission: 1,
  }
  const artifact1 = new Artifact(artifact1JSON);
  artifactSvc.getPortfolioArtifacts.and.returnValue(of(
    [artifact1,]
  ))
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PortfolioComponent,
        MockComponent(MilestonesComponent),
      ],
      imports: [
        MatCardModule,
        MatIconModule,
        HttpClientTestingModule,
      ],
      providers: [
        {provide: MatDialog, useValue: matDialog},
        {provide: ArtifactService, useValue: artifactSvc},
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('open dialog', () => {
    component.openDialog();
    expect(matDialog.open).toHaveBeenCalledWith(FileUploadComponent,
      {data: {url: constructBackendRequest(Endpoints.RESUME)} }
    )
  });

  it('update Artifacts', () => {
    expect(component.showUploadButton).toBeTrue();
    const url = constructBackendRequest(`${Endpoints.PORTFOLIO}/${artifact1.artifactID}`)
    const request = httpMock.expectOne(url);
    expect(request.request.method).toEqual('GET');
    const mockPdfBlob = new Blob(['fake PDF content'], { type: 'application/pdf' });
    request.flush(mockPdfBlob);
    component.openDialog();
    expect(matDialog.open).toHaveBeenCalledWith(FileUploadComponent,
      {data: {url: constructBackendRequest(Endpoints.RESUME)} }
    )
    expect(component.showUploadButton).toBeFalse();
    expect(component.pdfURL).toBeTruthy();
  });
});
