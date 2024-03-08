import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FileUploadComponent} from "../file-upload/file-upload.component";
import {constructBackendRequest, Endpoints} from "../util/http-helper";
import { AuthService } from '../security/auth.service';
import { LangUtils } from '../util/lang-utils';
import { User } from '../security/domain/user';
import {HttpClient} from "@angular/common/http";
import {ArtifactService} from "../file-upload/artifact.service";
import { TaskService } from '../util/task.service';
import { SubmissionModalComponent } from '../submissions/submission-modal/submission-modal.component';
import { SubmissionService } from '../submissions/submission.service';
import { ActivatedRoute, ActivatedRouteSnapshot, ParamMap, Router, UrlSegment } from '@angular/router';
import { map, mergeMap, tap, zipWith } from 'rxjs';
import { UserService } from '../security/user.service';

const RESUME_TASK_ID = 6;

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent implements OnInit{

  user: User = User.makeEmpty();
  external: boolean = false;
  showUploadButton: boolean = true;
  pdfURL: any = '';

  constructor(
    public dialog: MatDialog,
    private readonly artifactService: ArtifactService,
    private readonly submissionService: SubmissionService,
    private readonly taskService: TaskService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.updateArtifacts();
  }

  formatDate(date: Date){
    return date.toLocaleString("en-US", {month: "long", year: "numeric", day: "numeric"});
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      mergeMap((map: ParamMap) => {
        if (map.has('id')) {
          this.external = true;
          return this.userService.getUser(map.get('id')!);
        } else {
          return this.authService.user$;
        }  
      }),
      zipWith(this.route.url),
      tap(([user, url]) => {
        let hasFaculty = false;
        url.forEach((segment) => {
          if (segment.path === 'faculty') {
            hasFaculty = true;
          }
        });
        if (!this.external && hasFaculty) this.router.navigate(['']);
      }),
      map(([user, url]) => user)
    ).subscribe((user) => {
      if (LangUtils.exists(user)) {
        this.user = user!;
      }
    });
  }

  private updateArtifacts() {
    this.submissionService.getLatestSubmission(RESUME_TASK_ID).subscribe((submission) => {
      if (submission.hasFile()) {
        this.artifactService.getArtifactFile(submission.artifactId).subscribe((file) => {
          this.pdfURL = URL.createObjectURL(file);
          this.showUploadButton = false;
        });
      }
    });
  }

  openDialog(): void {
    this.taskService.findById(RESUME_TASK_ID).subscribe((task) => {
      this.dialog.open(SubmissionModalComponent, {
        data: {
          task: task
        }
      })
        // this could definitely be optimized, but for now we can do this
        .afterClosed().subscribe(this.updateArtifacts.bind(this))
    });
  }
}
