import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PortfolioComponent} from "./portfolio/portfolio.component";
import {ProfileComponent} from "./profile/profile.component";
import {MilestonesPageComponent} from "./milestones-page/milestones-page.component";
import {ApiDocumentationsComponent} from "./api-documentations/api-documentations.component";
import { LoginPageComponent } from './security/login-page/login-page.component';
import { authGuard, noAuthGuard } from './security/auth-guard';

const routes: Routes = [
  {path: 'login', component: LoginPageComponent, canActivate: [noAuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
  {path: 'dashboard/hello', component: ApiDocumentationsComponent, canActivate: [authGuard]},
  {path: 'portfolio', component: PortfolioComponent, canActivate: [authGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
  {path: 'milestones', component: MilestonesPageComponent, canActivate: [authGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'swagger', component: ApiDocumentationsComponent, canActivate: [authGuard]},
  {path: '**', component: ApiDocumentationsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
