import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from 'src/domain/Task';
import { YearLevel } from 'src/domain/Milestone';
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import { HttpClientModule } from '@angular/common/http';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule], // If your service makes HTTP requests
      providers: [TaskService], // Include the service to be tested
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTasks should return list of tasks', () => {
    const taskJSON = {
        name: 'task name',
        description: "description",
        needsArtifact: true,
        taskID: 1,
        isRequired: true,
        submission: null,
        yearLevel: YearLevel.Freshman,
        milestoneID: 1,
        taskType: 'artifact',
        artifactName: 'sample'
    }

    const tasks = Array(new Task(taskJSON));
    service.getTasks().subscribe((result: any) => {
      expect(result).toEqual(tasks);
    });
    const request = httpMock.expectOne(constructBackendRequest(Endpoints.TASKS));
    expect(request.request.method).toEqual('GET');
    request.flush(Array(taskJSON));
  });


})
