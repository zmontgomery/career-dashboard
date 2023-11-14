import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioComponent } from './portfolio.component';
import {MockComponent} from "ng-mocks";
import {MilestonesComponent} from "../milestones-page/milestones/milestones.component";
import {MatDialog} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {constructBackendRequest, Endpoints} from "../util/http-helper";
import {FileUploadComponent} from "../file-upload/file-upload.component";

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;
  let matDialog = jasmine.createSpyObj('MatDialog', ['open']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PortfolioComponent,
        MockComponent(MilestonesComponent),
      ],
      imports: [MatCardModule, MatIconModule],
      providers: [
        {provide: MatDialog, useValue: matDialog}
      ]
    });
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
});
