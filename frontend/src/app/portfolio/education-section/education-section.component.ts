import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, map, mergeMap, zipWith } from 'rxjs';
import { AuthService } from 'src/app/security/auth.service';
import { User } from 'src/app/security/domain/user';
import { UserService } from 'src/app/security/user.service';
import { LangUtils } from 'src/app/util/lang-utils';
import { ScreenSizeService } from 'src/app/util/screen-size.service';
import { EditEducationDialogComponent } from './edit-education-dialog/edit-education-dialog.component';

@Component({
  selector: 'education-section',
  templateUrl: './education-section.component.html',
  styleUrls: ['./education-section.component.less'],
})
export class EducationSectionComponent implements OnInit {
  user: User = User.makeEmpty();
  isMobile$: Observable<boolean>;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly screenSizeSvc: ScreenSizeService,
    private readonly route: ActivatedRoute,
    private readonly editDialog: MatDialog
  ) {
    this.isMobile$ = screenSizeSvc.isMobile$;
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        mergeMap((map: ParamMap) => {
          return map.has('id')
            ? this.userService.getUser(map.get('id')!)
            : this.authService.user$;
        }),
        zipWith(this.route.url),
        map(([user, _]) => user)
      )
      .subscribe((user) => {
        if (LangUtils.exists(user)) {
          this.user = user!;
        }
      });
  }

  openEditDialog(): void {
    const dialogRef = this.editDialog.open(EditEducationDialogComponent);
    dialogRef.componentInstance.defaultValues = {
      universityId: this.user.studentDetails?.universityId ?? '',
      year: this.user.studentDetails?.yearLevel ?? '',
      gpa: String(this.user.studentDetails?.gpa) ?? '',
      majors: this.majors(),
      minors: this.minors(),
    };

    dialogRef.afterClosed().subscribe((result) => {
      // TODO: update user's education
      console.log('Edit dialog closed:', result);
    });
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
}
