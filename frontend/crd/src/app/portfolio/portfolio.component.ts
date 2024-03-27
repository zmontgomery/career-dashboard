import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import { AuthService } from '../security/auth.service';
import { LangUtils } from '../util/lang-utils';
import { User } from '../security/domain/user';
import {ArtifactService} from "../file-upload/artifact.service";
import { TaskService } from '../util/task.service';
import { SubmissionService } from '../submissions/submission.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, mergeMap, takeUntil, tap, zipWith } from 'rxjs';
import { UserService } from '../security/user.service';
import { Job } from 'src/domain/Job';
import {MilestoneService} from "../milestones-page/milestones/milestone.service";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent implements OnInit {

  user: User = User.makeEmpty();
  external: boolean = false;
  profileURL: string | null = null;
  completedMilestones: string[] = []

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly artifactService: ArtifactService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly milestoneService: MilestoneService,
  ) { }

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
      tap(([_, url]) => {
        let hasFaculty = false;
        url.forEach((segment) => {
          if (segment.path === 'faculty') {
            hasFaculty = true;
          }
        });
        if (!this.external && hasFaculty) this.router.navigate(['']);
      }),
      map(([user, _]) => user)
    ).subscribe((user) => {
      if (LangUtils.exists(user)) {
        this.user = user!;
        this.loadProfilePicture();
        this.milestoneService.getCompletedMilestones(user!.id).subscribe((milestones) => {
          this.completedMilestones = milestones.map((it) => it.name)
        })
      }
    });
  }

  loadProfilePicture() {
    this.artifactService.getArtifactFile(this.user.profilePictureId)
      .subscribe((blob) => {
        this.user.profilePictureURL = URL.createObjectURL(blob);
      });
  }

  goToLinkedIn() {
    location.href = this.user.linkedin;
  }

  majors(): string[] {
    return (this.user.studentDetails?.degreePrograms ?? [])
      .filter((d) => !d.isMinor)
      .map((d) => d.name);
  }

  minors(): string[] {
    return (this.user.studentDetails?.degreePrograms ?? [])
      .filter((d) => d.isMinor)
      .map((d) => d.name);
  }

  skills(): string[] {
    return (this.user.studentDetails?.skills ?? [])
      .filter((s) => !s.isLanguage)
      .map((s) => s.name);
  }

  jobs(): Job[] {
    return (this.user.studentDetails?.jobs ?? [])
      .filter((s) => !s.isCoop)
  }

  coops(): Job[] {
    return (this.user.studentDetails?.jobs ?? [])
      .filter((s) => s.isCoop)
  }

  languages(): string[] {
    return (this.user.studentDetails?.skills ?? [])
      .filter((s) => s.isLanguage)
      .map((s) => s.name);
  }

  formatDate(date: Date){
    return date.toLocaleString("en-US", {month: "long", year: "numeric", day: "numeric"});
  }

}
