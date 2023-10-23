import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './views/test/test.component';
import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
  {path: 'test', component: TestComponent},
  {path: 'auth', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
