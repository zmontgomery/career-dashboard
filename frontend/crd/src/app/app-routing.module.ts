import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PortfolioComponent } from "./portfolio/portfolio.component";
import { ProfileComponent } from "./profile/profile.component";
import { MilestonesPageComponent } from "./milestones-page/milestones-page.component";
import { MilestoneMainPageComponent } from './admin/milestone-main-page/milestone-main-page.component';
import { MilestoneEditComponent } from './admin/milestone-edit/milestone-edit.component';
import { TaskMainPageComponent } from './admin/task-main-page/task-main-page.component';
import { ApiDocumentationsComponent } from "./api-documentations/api-documentations.component";

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'portfolio', component: PortfolioComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'milestones', component: MilestonesPageComponent},
  {path: 'admin', redirectTo: '/admin/milestones', pathMatch: 'full'},  //TODO: admin home page
  {path: 'admin/milestones', component: MilestoneMainPageComponent},
  {path: 'admin/milestone-edit/:name', component: MilestoneEditComponent},
  {path: 'admin/tasks', component: TaskMainPageComponent},
  //{path: 'admin/task-edit/:name', component: TaskEditComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'swagger', component: ApiDocumentationsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
