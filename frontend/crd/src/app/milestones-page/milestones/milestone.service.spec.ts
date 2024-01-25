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
      id: "id",
      active: true,
      events: [{
        name: "name",
        description: "description",
        date: new Date().toDateString(),
        eventID: "id",
        isRecurring: true,
        organizer: "organizer",
        location: "location",
        isRequired: true,
      }],
      tasks: [{
        name: 'task name',
        description: "description",
        needsArtifact: true,
        id: "id",
        isRequired: true,
        submission: 'submission',
        yearLevel: YearLevel.Freshman,
        milestoneID: "id"
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
