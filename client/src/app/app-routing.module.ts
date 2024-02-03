import { NgModule } from "@angular/core";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { HomePageComponent } from "./home/home-page/home-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { AuthGuard } from "./auth/auth-guard.service";
import { AuthGuardLoggedIn } from "./auth/auth-guard-logged-in";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { GlobalStateResolver } from "./global-state.resolver";
import { MainDispComponent } from "./home/main-disp/main-disp/main-disp.component";
import { CreateTaskComponent } from "./home/main-disp/create-task/create-task.component";
import { TaskDetailsComponent } from "./home/main-disp/task-details/task-details/task-details.component";
import { CreateGroupComponent } from "./home/main-disp/create-group/create-group.component";
import { CreateWorkspaceComponent } from "./home/main-disp/create-workspace/create-workspace.component";
import { CreateSubTaskComponent } from "./home/main-disp/create-sub-task/create-sub-task.component";
import { TaskSummaryComponent } from "./home/main-disp/task-summary/task-summary.component";

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home',
      component: HomePageComponent,
      title: 'Home Page',
      children: [
        { path: 'dashboard', title: 'Dashboard', component: HomePageComponent },
        { 
          path: 'tasks', 
          title: 'Task Summary',
          component: TaskSummaryComponent
        },
        { 
          path: 'task',
          title:'Task',
          component: MainDispComponent,
          children: [
            {
              path: 'create',
              title: 'Create Task',
              component: CreateTaskComponent,
            },
            {
              path: ':taskId',
              title: 'Task Details',
              component: TaskDetailsComponent,
            },
          ]
        },
        {
          path: 'subtask',
          title: 'Sub Task',
          component: MainDispComponent,
          children: [
            {
              path: 'create',
              title: 'Create Sub Task',
              component: CreateSubTaskComponent
            }
          ]
        },
        {
          path: 'group',
          title: 'Group',
          component: MainDispComponent,
          children: [
            {
              path: 'create',
              title: 'Create Group',
              component: CreateGroupComponent,
            }
          ]
        },
        {
          path: 'workspace',
          title: 'Workspace',
          component: MainDispComponent,
          children: [
            {
              path: 'create',
              title: 'Create Workspace',
              component: CreateWorkspaceComponent,
            }
          ]
        }
      ],
      canActivate: [AuthGuard],
      resolve: {
        globalState: GlobalStateResolver
      }
    },
    { path: 'login', title: 'Login Page', component: LoginPageComponent, canActivate: [AuthGuardLoggedIn] },
    { path: 'unauthorized', title: 'Unauthorized Access', component: PageNotFoundComponent },
    { path: '**', title: 'Page Not Found', component: PageNotFoundComponent}
  ]; 

@NgModule({
    imports: [
      RouterModule.forRoot(routes),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule{ }