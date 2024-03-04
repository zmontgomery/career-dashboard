import { Component } from '@angular/core';
import {Endpoints} from "../util/http-helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ProfileImageModalComponent} from "../file-upload/profile-image-modal/profile-image-modal.component";

@Component({
  selector: 'app-settings',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.less']
})
export class SettingsPageComponent {

  profileURL: string = Endpoints.USERS_PROFILE_PICTURE;

  constructor(
    public matDialog: MatDialog,
  ) {
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
