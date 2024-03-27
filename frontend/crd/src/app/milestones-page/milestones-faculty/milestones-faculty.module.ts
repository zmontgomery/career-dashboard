import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MilestonesFacultyComponent } from './milestones-faculty.component';
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { TaskSubmitButtonModule } from "../../task-submit-button/task-submit-button.module";



@NgModule({
    declarations: [
        MilestonesFacultyComponent,
    ],
    exports: [
        MilestonesFacultyComponent
    ],
    imports: [
        CommonModule,
        MatCardModule,
        RouterLink,
        MatTabsModule,
        MatExpansionModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        TaskSubmitButtonModule,
        MatButtonModule,
    ]
})
export class MilestonesFacultyModule { }
