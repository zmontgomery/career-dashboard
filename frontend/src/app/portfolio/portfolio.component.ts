import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, map, mergeMap, tap, zipWith } from 'rxjs';
import { Job } from 'src/domain/Job';
import { ArtifactService } from '../file-upload/artifact.service';
import { MilestoneService } from '../milestones-page/milestones/milestone.service';
import { AuthService } from '../security/auth.service';
import { User } from '../security/domain/user';
import { UserService } from '../security/user.service';
import { LangUtils } from '../util/lang-utils';
import { ScreenSizeService } from '../util/screen-size.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less'],
})
export class PortfolioComponent implements OnInit {
  user: User = User.makeEmpty();
  external: boolean = false;
  profileURL: string | null = null;
  completedMilestones: string[] = [];
  isMobile$: Observable<boolean>;
  personalSectionResize$: Observable<boolean>;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly artifactService: ArtifactService,
    private readonly screenSizeSvc: ScreenSizeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly milestoneService: MilestoneService
  ) {
    this.isMobile$ = screenSizeSvc.isMobile$;

    // Add the mobile styling to personal section because it gets squished around 1200.
    // At 1000 resume is moved downward and there is more space so go back to normal
    // styling until regular mobile kicks in.
    this.personalSectionResize$ = screenSizeSvc.screenSize$.pipe(
      map((it) => it < 1200 && it > 1000)
    );
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
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
      )
      .subscribe((user) => {
        if (LangUtils.exists(user)) {
          this.user = user!;
          this.loadProfilePicture();
          this.milestoneService
            .getCompletedMilestones(user!.id)
            .subscribe((milestones) => {
              this.completedMilestones = milestones.map((it) => it.name);
            });
        }
      });
  }

  loadProfilePicture() {
    this.artifactService
      .getArtifactFile(this.user.profilePictureId)
      .subscribe((blob) => {
        this.user.profilePictureURL = URL.createObjectURL(blob);
      });
  }

  goToLinkedIn() {
    location.href = this.user.linkedin;
  }

  skills(): string[] {
    return (this.user.studentDetails?.skills ?? [])
      .filter((s) => !s.isLanguage)
      .map((s) => s.name);
  }

  jobs(): Job[] {
    return (this.user.studentDetails?.jobs ?? []).filter((s) => !s.isCoop);
  }

  coops(): Job[] {
    return (this.user.studentDetails?.jobs ?? []).filter((s) => s.isCoop);
  }

  languages(): string[] {
    return (this.user.studentDetails?.skills ?? [])
      .filter((s) => s.isLanguage)
      .map((s) => s.name);
  }

  dateHeader(header: string): string {
    return this.isMobile$ ? `${header}:` : `${header} Date:`;
  }

  formatDate(date: Date) {
    return this.isMobile$
      ? date.toLocaleString('en-US', {
          month: 'numeric',
          year: 'numeric',
          day: 'numeric',
        })
      : date.toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
          day: 'numeric',
        });
  }
}
