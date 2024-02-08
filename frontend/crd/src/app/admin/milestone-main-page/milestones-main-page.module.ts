import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MilestoneMainPageComponent } from './milestone-main-page.component';
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatGridListModule } from '@angular/material/grid-list';


@NgModule({
  declarations: [
    MilestoneMainPageComponent,
  ],
    imports: [
        CommonModule,
        MatCardModule,
        RouterLink,
        MatButtonModule,
        MatTabsModule,
        MatExpansionModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatGridListModule
    ],
})
export class MilestoneMainPageModule { }
