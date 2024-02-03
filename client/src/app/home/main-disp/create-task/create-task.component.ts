import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment.dev';
import { SharedService } from 'src/app/shared.service';
import { Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconSnackBarComponent } from 'src/app/lib/icon-snack-bar/icon-snack-bar.component';
import { dateToStr } from 'src/app/lib/dateTransform';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent {
  globalStateValue: any;
  globalStateValueForm: any;
  taskList: any;
  groupList: any;
  createTaskForm!: FormGroup;
  formData: any;
  teamList: any;

  targetDatetime: any;
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private sharedService: SharedService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) { 
      this.createTaskForm = this.formBuilder.group({
        // Task details from task_details table
        taskNumber: {value: '', disabled: true},
        taskName: '',
        taskState: {value: 'New', disabled: true},
        taskDescription: '',
        taskImportance: 'Low',
        referenceTask: null,
        assignTo: this.sharedService.getGlobalState('userPreference')?.[0]?.user_id || null,

        // Workspace details from workspace_details table
        workspaceName: {value: this.sharedService.getGlobalState('workspace')?.workspace_id, disabled: true},

        // Group details from group_details table
        groupName: this.sharedService.getGlobalState('filterOptions')?.group_ids?.[0] || null,
      })
   }

  onChangeDatetime(event: any) {
    this.targetDatetime = event
  }

  initializeForm() {
    this.sharedService.globalState$.subscribe((state) => {
      this.createTaskForm = this.formBuilder.group({

        // Task details from task_details table
        taskNumber: [{value: '', disabled: true}],
        taskName: '',
        taskState: [{value: 'New', disabled: true}],
        taskDescription: '',
        taskImportance: 'Low',
        referenceTask: null,
        assignTo: state.userPreference?.[0]?.user_id || null,
  
        // Workspace details from workspace_details table
        workspaceName: [{value: state.workspace?.workspace_id, disabled: true}],
  
        // Group details from group_details table
        groupName: state.filterOptions?.group_ids?.[0] || null,
  
      })
    })
  }

  onCreateTask() {

    const targetDatetime = this.targetDatetime;

    const body = new URLSearchParams();

    const taskName: any = this.createTaskForm.value.taskName;
    const taskDescription: any = this.createTaskForm.value.taskDescription;
    const assignedTo: any = this.createTaskForm.value.assignTo;
    const taskImportance: any = this.createTaskForm.value.taskImportance;
    if(this.createTaskForm.value.referenceTask!=null){
      const referenceTask: any = this.createTaskForm.value.referenceTask;
      body.set('reference_task', referenceTask);
    }
    
    const workspaceId: any = this.sharedService.getGlobalState('workspace').workspace_id;
    const groupId: any = this.createTaskForm.value.groupName;

    body.set('task_name', taskName);
    body.set('task_description', taskDescription);
    body.set('assigned_to', assignedTo);
    body.set('task_importance', taskImportance);
    body.set('target_datetime', targetDatetime);
    body.set('workspace_id', workspaceId);
    body.set('task_group_id', groupId);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.http.post(environment.apiUrl+'/task/create', body.toString(), {headers, withCredentials: true})
      .subscribe(response => {
        this.sharedService.handleFilterChange(groupId);
        this.router.navigate(['/home/task/'+response])
        this._snackBar.openFromComponent(IconSnackBarComponent, {
          data: {
            message: `Task created successfully!`,
            icon: 'check_circle'
          },
          duration: 3000
        })
      });
  }

  ngOnInit() {
    this.sharedService.globalState$.subscribe((state) => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        });
        // Update the component's property when the state changes
        this.globalStateValue = state.data; // Replace with the appropriate key from your state
        this.globalStateValueForm = state;
        if(state.workspace?.workspace_id && state.userInfo){
          for(let i=0; i<state.userInfo.length; i++){
            if(state.userInfo[i].workspace_id==state.workspace.workspace_id){
              this.groupList=state.userInfo[i];
            }
          }
          this.http.get(environment.apiUrl+'/task/workspace/'+state.workspace.workspace_id, {headers, withCredentials: true})
            .subscribe((response) => {
              this.taskList=response;
            })
        }
        if(state.workspace?.team_members){
          this.teamList = state.workspace.team_members;
          console.log(this.teamList)
        }
    });
    
    this.initializeForm();
  }
}