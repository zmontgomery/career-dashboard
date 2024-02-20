import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PortfolioComponent} from "./portfolio/portfolio.component";
import {ProfileComponent} from "./profile/profile.component";
import {MilestonesPageComponent} from "./milestones-page/milestones-page.component";
import {ApiDocumentationsComponent} from "./api-documentations/api-documentations.component";
import { LoginPageComponent } from './security/login-page/login-page.component';
import {adminRoleGuard, authGuard, facultyRoleGuard, noAuthGuard} from './security/auth-guard';
import { MilestoneEditComponent } from './admin/milestone-edit/milestone-edit.component';
import { MilestoneMainPageComponent } from './admin/milestone-main-page/milestone-main-page.component';
import { TaskMainPageComponent } from './admin/task-main-page/task-main-page.component';
import { EventMainPageComponent } from './admin/event-main-page/event-main-page.component';

const routes: Routes = [
  {path: 'login', component: LoginPageComponent, canActivate: [noAuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
  {path: 'portfolio', component: PortfolioComponent, canActivate: [authGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
  {path: 'milestones', component: MilestonesPageComponent, canActivate: [authGuard]},
  {path: 'faculty/users', component: MilestoneMainPageComponent, canActivate: [authGuard, facultyRoleGuard]}, // TODO student search page
  {path: 'admin', redirectTo: '/admin/milestones', pathMatch: 'full'},  //TODO: admin home page
  {path: 'admin/milestones', component: MilestoneMainPageComponent, canActivate: [authGuard, adminRoleGuard]},
  {path: 'admin/milestone-edit/:name', component: MilestoneEditComponent, canActivate: [authGuard, adminRoleGuard]},
  {path: 'admin/tasks', component: TaskMainPageComponent, canActivate: [authGuard, adminRoleGuard]},
  {path: 'admin/events', component: EventMainPageComponent, canActivate: [authGuard, adminRoleGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'swagger', component: ApiDocumentationsComponent, canActivate: [authGuard, adminRoleGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
