import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MilestonesPageComponent } from './milestones-page.component';
import {MilestonesModule} from "./milestones/milestones.module";

@NgModule({
  declarations: [
    MilestonesPageComponent,
  ],
    imports: [
        CommonModule,
        MilestonesModule,
    ],
})
export class MilestonesPageModule { }
