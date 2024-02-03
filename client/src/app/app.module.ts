import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter, MomentDateModule } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip' 
import { MatDialogModule } from '@angular/material/dialog';
import { NgFor } from '@angular/common';

import { MAT_DATE_FORMATS } from '@angular/material/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth/auth-guard.service';
import { AuthGuardLoggedIn } from './auth/auth-guard-logged-in';
import { AuthService } from './auth/auth.service';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { TopBarComponent } from './home/top-bar/top-bar.component';
import { TaskBarComponent } from './home/task-bar/task-bar/task-bar.component';
import { TaskListComponent } from './home/task-bar/task-list/task-list.component';
import { MainDispComponent } from './home/main-disp/main-disp/main-disp.component';
import { TaskDetailsComponent } from './home/main-disp/task-details/task-details/task-details.component';
import { TaskAuditComponent } from './home/main-disp/task-details/task-audit/task-audit.component';
import { TaskFormComponent } from './home/main-disp/task-details/task-form/task-form.component';
import { CreateTaskComponent } from './home/main-disp/create-task/create-task.component';
import { WorkgroupListComponent } from './home/task-bar/workgroup-list/workgroup-list.component';
import { CreateGroupComponent } from './home/main-disp/create-group/create-group.component';
import { CreateWorkspaceComponent } from './home/main-disp/create-workspace/create-workspace.component';
import { CreateSubTaskComponent } from './home/main-disp/create-sub-task/create-sub-task.component';
import { IconSnackBarComponent } from './lib/icon-snack-bar/icon-snack-bar.component';
import { FilterOptionsComponent } from './home/task-bar/filter-options/filter-options.component';
import { InviteDialogComponent } from './home/invite/invite-dialog/invite-dialog.component';
import { ManageInvitesComponent } from './home/invite/manage-invites/manage-invites.component';
import { MoreMenuComponent } from './home/menu/more-menu/more-menu.component';
import { ManageSentInvitesComponent } from './home/invite/manage-sent-invites/manage-sent-invites.component';
import { InviteHistoryComponent } from './home/invite/invite-history/invite-history.component';
import { MembersListComponent } from './home/menu/members-list/members-list.component';
import { ManageWorkspaceComponent } from './home/menu/manage-workspace/manage-workspace.component';
import { EditWorkspaceComponent } from './home/menu/edit-workspace/edit-workspace.component';
import { TaskSummaryComponent } from './home/main-disp/task-summary/task-summary.component';
import { DatetimeComponent } from './lib/datetime/datetime.component';

const MY_DATE_FORMAT = {
  parse: {
    // dateInput: 'MM/DD/YYYY', // this is how your date will be parsed from Input
    dateInput: 'DD MMM YYYY',
  },
  display: {
    dateInput: 'DD MMM YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    PageNotFoundComponent,
    HomePageComponent,
    TopBarComponent,
    TaskBarComponent,
    TaskListComponent,
    MainDispComponent,
    TaskDetailsComponent,
    TaskAuditComponent,
    TaskFormComponent,
    CreateTaskComponent,
    WorkgroupListComponent,
    CreateGroupComponent,
    CreateWorkspaceComponent,
    CreateSubTaskComponent,
    IconSnackBarComponent,
    FilterOptionsComponent,
    InviteDialogComponent,
    ManageInvitesComponent,
    MoreMenuComponent,
    ManageSentInvitesComponent,
    InviteHistoryComponent,
    MembersListComponent,
    ManageWorkspaceComponent,
    EditWorkspaceComponent,
    TaskSummaryComponent,
    DatetimeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MomentDateModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDialogModule,
    NgFor,
  ],
  providers: [
    AuthService,
    AuthGuard,
    AuthGuardLoggedIn,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }