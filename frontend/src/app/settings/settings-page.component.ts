import {Component, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ProfileImageModalComponent} from "../file-upload/profile-image-modal/profile-image-modal.component";
import {UserService} from "../security/user.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-settings',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.less']
})
export class SettingsPageComponent implements OnDestroy {

  profileURL: string | null = null;
  private destroyed$ = new Subject<any>();

  constructor(
    public matDialog: MatDialog,
    private userService: UserService,
  ) {
    this.updateProfilePicture();
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }

  private updateProfilePicture(forceRefresh: boolean = false) {
    this.userService.getProfilePicture(forceRefresh)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((url) => {
        this.profileURL = url;
      });
  }

  openProfilePicture() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "75%";
    dialogConfig.width = "500px";
    dialogConfig.data = {

    }

    const modalDialog = this.matDialog.open(ProfileImageModalComponent, dialogConfig);

    modalDialog.afterClosed().subscribe(update => {
      if (update) {
        this.updateProfilePicture(true);
      }
    })
  }
}
