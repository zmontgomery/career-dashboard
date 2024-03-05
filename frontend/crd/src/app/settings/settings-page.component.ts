import { Component } from '@angular/core';
import {Endpoints} from "../util/http-helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ProfileImageModalComponent} from "../file-upload/profile-image-modal/profile-image-modal.component";
import {AuthService} from "../security/auth.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {LangUtils} from "../util/lang-utils";
import {ArtifactService} from "../file-upload/artifact.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.less']
})
export class SettingsPageComponent {

  profileURL: string | null = null;

  constructor(
    public matDialog: MatDialog,
    private authService: AuthService,
    private artifactService: ArtifactService,
  ) {
    this.authService.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
      if (LangUtils.exists(user)) {
        this.artifactService.getProfilePicture()
          .subscribe((url) => {
            this.profileURL = url;
          });
      }
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

    modalDialog.afterClosed().subscribe(result => {
      // TODO update image?
    })
  }
}
