import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MilestoneService } from "./milestone.service";
import {Milestone, MilestoneJSON, YearLevel} from "../../../domain/Milestone";
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import { taskJSON } from 'src/app/util/task.service.spec';
import {EventJSON} from "../../../domain/Event";

export const event1JSON = {
  name: "name",
  description: "description",
  date: new Date().toDateString(),
  id: 1,
  recurring: true,
  organizer: "organizer",
  location: "location",
  eventLink: "sample link",
  buttonLabel: "test",
  imageId: 1,
}

export const milestone1JSON: MilestoneJSON = {
  name: "name",
  yearLevel: YearLevel.Freshman,
  id: 1,
  description: "sample",
  events: [event1JSON],
  tasks: [taskJSON],
}

export const event2JSON: EventJSON = {
  ...event1JSON,
  buttonLabel: "sample",
  eventLink: "sample",
}

export const milestone2JSON: MilestoneJSON = {
  ...milestone1JSON,
  events: [event2JSON],
}

export const milestone3JSON: MilestoneJSON = {
  ...milestone1JSON,
  tasks: [],
}

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
    const milestones = Array(new Milestone(milestone1JSON));
    service.getMilestones().subscribe((result: any) => {
      expect(result).toEqual(milestones);
      done();
    });

    const request = httpMock.expectOne(constructBackendRequest(Endpoints.MILESTONES));
    expect(request.request.method).toEqual('GET');
    request.flush(Array(milestone1JSON));
  });

  it('getMilestones should return list of milestones if cached and not call http', (done) => {
    // @ts-ignore
    service.hasBeenRequested = true;

    service.getMilestones().subscribe((result: any) => {
      expect(result).toEqual(milestones);
      done();
    });

    const milestones = Array(new Milestone(milestone2JSON));
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

    const request = httpMock.expectOne(constructBackendRequest(Endpoints.MILESTONES));
    expect(request.request.method).toEqual('GET');
    request.flush(null);
  });

  it('getMilestones should not return empty milestones without getAll', (done) => {
    service.getMilestones().subscribe((result: any) => {
      expect(result).toEqual([]);
      done();
    });

    const request = httpMock.expectOne(constructBackendRequest(Endpoints.MILESTONES));
    expect(request.request.method).toEqual('GET');
    request.flush(Array(milestone3JSON));
  });

  it('getMilestones should return empty milestones with getAll', (done) => {
    const milestones = Array(new Milestone(milestone3JSON));
    service.getMilestones(undefined, true).subscribe((result: any) => {
      expect(result).toEqual(milestones);
      done();
    });

    const request = httpMock.expectOne(constructBackendRequest(Endpoints.MILESTONES));
    expect(request.request.method).toEqual('GET');
    request.flush(Array(milestone3JSON));
  });

  it('getMilestones should return list of milestones', (done) => {
    const milestones = Array(new Milestone(milestone1JSON));
    service.getCompletedMilestones("test").subscribe((result: any) => {
      expect(result).toEqual(milestones);
      done();
    });

    const request = httpMock.expectOne(constructBackendRequest(Endpoints.MILESTONES_COMPLETE, {key: "userId", value: 'test'}));
    expect(request.request.method).toEqual('GET');
    request.flush(Array(milestone1JSON));
  });
})
