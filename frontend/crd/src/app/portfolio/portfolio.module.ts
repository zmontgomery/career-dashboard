import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import {PortfolioComponent} from "./portfolio.component";
import {MilestonesModule} from "../milestones-page/milestones/milestones.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FileUploadModule} from "../file-upload/file-upload.module";
import {MatDialogModule} from "@angular/material/dialog";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DeleteResumeConfirmationDialogModule } from './delete-resume-confirmation-dialog/delete-resume-confirmation-dialog.module';

@NgModule({
  declarations: [
    PortfolioComponent,
  ],
  exports: [
  ],
    imports: [
      CommonModule,
      MatCardModule,
      MilestonesModule,
      MatButtonModule,
      MatIconModule,
      FileUploadModule,
      MatDialogModule,
      PdfViewerModule,
      DeleteResumeConfirmationDialogModule
    ]
})
export class PortfolioModule { }
