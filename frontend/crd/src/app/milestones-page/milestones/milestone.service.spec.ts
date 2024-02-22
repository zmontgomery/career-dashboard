import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MilestoneService } from "./milestone.service";
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';

describe('MilestoneService', () => {
  let service: MilestoneService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [MilestoneService], 
    });
    service = TestBed.inject(MilestoneService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getMilestones should return list of milestones', (done) => {
    const milestoneJSON = {
      name: "name",
      yearLevel: YearLevel.Freshman,
      id: 1,
      description: "sample",
      active: true,
      events: [{
        name: "name",
        description: "description",
        date: new Date().toDateString(),
        id: 1,
        recurring: true,
        organizer: "organizer",
        location: "location"
      }],
      tasks: [{
        name: 'task name',
        description: "description",
        id: 1,
        isRequired: true,
        submission: 'submission',
        yearLevel: YearLevel.Freshman,
        milestoneID: 1,
        taskType: 'artifact',
        artifactName: 'test artifact'
      }],
    }

    const milestones = Array(new Milestone(milestoneJSON));
    service.getMilestones().subscribe((result: any) => {
      expect(result).toEqual(milestones);
      done();
    });

    const request = httpMock.expectOne(constructBackendRequest(Endpoints.MILESTONES));
    expect(request.request.method).toEqual('GET');
    request.flush(Array(milestoneJSON));
  });

  it('getMilestones should return list of milestones if cached and not call http', (done) => {
    const milestoneJSON = {
      name: "name",
      yearLevel: YearLevel.Freshman,
      id: 1,
      description: "sample",
      active: true,
      events: [{
        name: "name",
        description: "description",
        date: new Date().toDateString(),
        id: 1,
        recurring: true,
        organizer: "organizer",
        location: "location"
      }],
      tasks: [{
        name: 'task name',
        description: "description",
        id: 1,
        isRequired: true,
        submission: 'submission',
        yearLevel: YearLevel.Freshman,
        milestoneID: 1,
        taskType: 'artifact',
        artifactName: 'test artifact'
      }],
    }    
    // @ts-ignore
    service.hasBeenRequested = true;

    service.getMilestones().subscribe((result: any) => {
      expect(result).toEqual(milestones);
      done();
    });

    const milestones = Array(new Milestone(milestoneJSON));
    httpMock.expectNone(constructBackendRequest(Endpoints.MILESTONES));

    // @ts-ignore
    service.milestoneCache.next(milestones);
  });

  it('getMilestones should attempt refetch on http error', (done) => {
    service.getMilestones().subscribe((result: any) => {
      expect(result).toEqual([]);
      // @ts-ignore
      expect(service.hasBeenRequested).toBeFalse();
      done();
    });

    const errorResponse = { status: 401, statusText: 'Unauthorized.' };
    const request = httpMock.expectOne(constructBackendRequest(Endpoints.MILESTONES));
    expect(request.request.method).toEqual('GET');
    request.flush('Unauthorized.', errorResponse);
  });
})
