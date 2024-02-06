import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {MilestoneService} from "./milestone.service";
import {Milestone, YearLevel} from "../../../domain/Milestone";
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';

describe('MilestoneService', () => {
  let service: MilestoneService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // If your service makes HTTP requests
      providers: [MilestoneService], // Include the service to be tested
    });
    service = TestBed.inject(MilestoneService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getMilestones should return list of milestones', () => {
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
    });
    const request = httpMock.expectOne(constructBackendRequest(Endpoints.MILESTONES));
    expect(request.request.method).toEqual('GET');
    request.flush(Array(milestoneJSON));
  });


})
