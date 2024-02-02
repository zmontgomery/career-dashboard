import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TasksService} from "./tasks.service";
import {Task} from "../../domain/Task";
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';

describe('TasksService', () => {
  let service: TasksService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // If your service makes HTTP requests
      providers: [TasksService], // Include the service to be tested
    });
    service = TestBed.inject(TasksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('getMilestones should return list of milestones', () => {
  //   const tasksJSON = {
  //     tasks: [{
  //       name: 'task name',
  //       description: "description",
  //       needsArtifact: true,
  //       id: "id",
  //       isRequired: true,
  //       submission: 'submission'
  //     }],
  //   }
  //
  //   const tasks = Array(new Task(tasksJSON));
  //   service.getTasks().subscribe(result => {
  //     expect(result).toEqual(tasks);
  //   });
  //   const request = httpMock.expectOne(constructBackendRequest(Endpoints.TASKS));
  //   expect(request.request.method).toEqual('GET');
  //   request.flush(Array(tasksJSON));
  // });


})
