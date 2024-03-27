import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PortfolioComponent } from './portfolio.component';
import {MockComponent} from "ng-mocks";
import {MilestonesComponent} from "../milestones-page/milestones/milestones.component";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AuthService } from '../security/auth.service';
import { UserService } from '../security/user.service';
import { ActivatedRoute, Router, UrlSegment, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { userJSON } from '../security/auth.service.spec';
import { User } from '../security/domain/user';
import { ResumeComponent } from './resume/resume.component';
import {MilestoneService} from "../milestones-page/milestones/milestone.service";
import {Milestone} from "../../domain/Milestone";
import {milestone1JSON} from "../milestones-page/milestones/milestones.component.spec";

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;


  type SpyObj<T> = jasmine.SpyObj<T>;
  let authServiceSpy: SpyObj<AuthService>;
  let userServiceSpy: SpyObj<UserService>;
  let routeSpy: SpyObj<ActivatedRoute>;
  let router: SpyObj<Router>;
  let milestoneServiceSpy: SpyObj<MilestoneService>;

  const user = new User(userJSON);

  function setupSpies() {
    authServiceSpy = jasmine.createSpyObj('AuthService', [''], {user$: of(user)});
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    milestoneServiceSpy = jasmine.createSpyObj('MilestoneService', ['getCompletedMilestones']);

    userServiceSpy.getUser.and.returnValue(of(new User({...userJSON, id: 'id-2'})));
    milestoneServiceSpy.getCompletedMilestones.and.returnValue(of([new Milestone(milestone1JSON), new Milestone(milestone1JSON)]))
  }

  function createTestBed(external: boolean, faculty: boolean) {
    setupSpies();
    routeSpy = jasmine.createSpyObj('ActivatedRoute', [''],
      {
        paramMap: of(convertToParamMap(external ? {'id': 'id'} : {})),
        url: of(faculty ? [new UrlSegment('faculty', {})] : [new UrlSegment('', {})])
      }
    );


    TestBed.configureTestingModule({
      declarations: [
        PortfolioComponent,
        MockComponent(MilestonesComponent),
        MockComponent(ResumeComponent)
      ],
      imports: [
        MatCardModule,
        MatIconModule,
        HttpClientTestingModule,
        PdfViewerModule
      ],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        {provide: UserService, useValue: userServiceSpy},
        {provide: ActivatedRoute, useValue: routeSpy},
        {provide: Router, useValue: router},
        {provide: MilestoneService, useValue: milestoneServiceSpy},
      ]
    });
    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createTestBed(false, false);
    expect(component).toBeTruthy();
  });

  it('should get the user if external', fakeAsync(() => {
    createTestBed(true, true);
    tick(1000);
    expect(component.external).toBeTrue();
    expect(userServiceSpy.getUser).toHaveBeenCalled();
    expect(component.user).toEqual(new User({...userJSON, id: 'id-2'}));
  }));

  it('should not get the user if interal', fakeAsync(() => {
    createTestBed(false, false);
    tick(1000);
    expect(component.external).toBeFalse();
    expect(userServiceSpy.getUser).not.toHaveBeenCalled();
    expect(component.user).toEqual(user);
  }));

  it('should redirect if internal but faculty', fakeAsync(() => {
    createTestBed(false, true);
    tick(1000);
    expect(component.external).toBeFalse();
    expect(userServiceSpy.getUser).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  }));
});
