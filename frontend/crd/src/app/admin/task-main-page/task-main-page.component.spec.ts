import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskMainPageComponent } from './task-main-page.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogRef, MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TaskEditModalComponent } from '../task-edit-modal/task-edit-modal.component';


describe('TaskMainPageComponent', () => {
  let component: TaskMainPageComponent;
  let fixture: ComponentFixture<TaskMainPageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskMainPageComponent],
      imports: [
        HttpClientTestingModule, 
        HttpClientModule, 
        MatDialogModule, 
        MatTabsModule,
        MatListModule,
        NoopAnimationsModule
      ],
      providers: [MatDialog]
    });
    fixture = TestBed.createComponent(TaskMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the TaskEditModal in a MatDialog', () => {
    spyOn(component.matDialog,'open').and.callThrough();
    component.openTaskEditModal("testing", null);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      name: "testing",
      task: null
    }

    expect(component.matDialog.open).toHaveBeenCalledWith(TaskEditModalComponent, dialogConfig);
  });

});
