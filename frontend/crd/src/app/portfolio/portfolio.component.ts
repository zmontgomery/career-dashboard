import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import { AuthService } from '../security/auth.service';
import { LangUtils } from '../util/lang-utils';
import { User } from '../security/domain/user';
import {ArtifactService} from "../file-upload/artifact.service";
import { TaskService } from '../util/task.service';
import { SubmissionService } from '../submissions/submission.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, mergeMap, tap, zipWith } from 'rxjs';
import { UserService } from '../security/user.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent implements OnInit {

  user: User = User.makeEmpty();
  external: boolean = false;

  constructor(
    public dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
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
      }
    });
  }

  formatDate(date: Date){
    return date.toLocaleString("en-US", {month: "long", year: "numeric", day: "numeric"});
  }

}
