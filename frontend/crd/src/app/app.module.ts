import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { GoogleLoginProvider, SocialLoginModule } from '@abacritt/angularx-social-login';
import { MatCardModule } from "@angular/material/card";
import { DashboardModule } from "./dashboard/dashboard.module";
import { PortfolioModule } from "./portfolio/portfolio.module";
import { ApiDocumentationsComponent } from './api-documentations/api-documentations.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MilestonesPageModule } from "./milestones-page/milestones-page.module";
import { OswegoLogoModule } from "./oswego-logo/oswego-logo.module";
import { AuthInterceptor } from './security/interceptors/auth-interceptor';
import { TasksModule } from './tasks/tasks.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { LoginPageModule } from './security/login-page/login-page.module';
import { UserMenuModule } from './security/user-menu/user-menu.module';
import { AuthService } from './security/auth.service';
import { MilestoneMainPageModule } from './admin/milestone-main-page/milestones-main-page.module';
import { MilestoneEditModule } from './admin/milestone-edit/milestone-edit.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { TaskMainPageModule } from './admin/task-main-page/task-main-page.module';
import { TaskEditModalModule } from './admin/task-edit-modal/task-edit-modal.module';
import { EventMainPageModule } from './admin/event-main-page/event-main-page.module';
import { MilestoneCreateModalModule } from './admin/milestone-main-page/milestone-create-modal/milestone-create-modal.module';
import { UsersPageModule } from "./users-page/users-page.module";
import { SignupPageModule } from './security/signup-page/signup-page.module';
import {EventImageModalModule} from "./admin/event-image-modal/event-image-modal.module";
import { TasksModalModule } from './tasks-modal/tasks-modal.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { NotFoundComponent } from './not-found/not-found.component';
import {SettingsPageModule} from "./settings/settings-page.module";
import {ProfileImageModalModule} from "./file-upload/profile-image-modal/profile-image-modal.module";

@NgModule({
  declarations: [
    AppComponent,
    ApiDocumentationsComponent,
    NavbarComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: "ce4bbce1-ee95-4991-8367-c180902da560", // Application (client) ID from the app registration
          authority:
            "https://login.microsoftonline.com/24e2ab17-fa32-435d-833f-93888ce006dd", // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
          redirectUri: environment.redirectURI, // This is your redirect URI
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: false, // Set to true for Internet Explorer 11
        },
      }),
      {
        interactionType: InteractionType.Redirect
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map(),
      }
    ),
    SocialLoginModule,
    UserMenuModule,
    DashboardModule,
    PortfolioModule,
    MilestonesPageModule,
    UsersPageModule,
    MatCardModule,
    MatTabsModule,
    TasksModule,
    RouterModule,
    BrowserAnimationsModule,
    OswegoLogoModule,
    LoginPageModule,
    CarouselModule,
    MilestoneMainPageModule,
    MilestoneEditModule,
    MatGridListModule,
    MatListModule,
    TaskMainPageModule,
    TaskEditModalModule,
    EventMainPageModule,
    MilestoneCreateModalModule,
    MilestoneCreateModalModule,
    MatButtonModule,
    MatDialogModule,
    TasksModalModule,
    SignupPageModule,
    EventImageModalModule,
    ProfileImageModalModule,
    SettingsPageModule,
  ],
  providers: [
    provideHttpClient(),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true, //keeps the user signed in
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              "10084452653-c2867pfh6lvpgoq09aoe4i71ijeshej6.apps.googleusercontent.com",
              {
                oneTapEnabled: false,
              }
            ) // your client id
          }
        ]
      }
    },
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => authService.loadUser(),
      multi: true,
      deps: [AuthService]
    },
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }

