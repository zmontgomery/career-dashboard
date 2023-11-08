import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PortfolioComponent} from "./portfolio/portfolio.component";
import {ProfileComponent} from "./profile/profile.component";
import {MilestonesPageComponent} from "./milestones-page/milestones-page.component";
import {ApiDocumentationsComponent} from "./api-documentations/api-documentations.component";

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'portfolio', component: PortfolioComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'milestones', component: MilestonesPageComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'swagger', component: ApiDocumentationsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
