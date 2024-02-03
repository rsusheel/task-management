import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment.dev';
import { SharedService } from 'src/app/shared.service';
import { ActivatedRoute, Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconSnackBarComponent } from 'src/app/lib/icon-snack-bar/icon-snack-bar.component';
import { dateToStr } from 'src/app/lib/dateTransform';

@Component({
  selector: 'app-create-sub-task',
  templateUrl: './create-sub-task.component.html',
  styleUrls: ['./create-sub-task.component.css']
})
export class CreateSubTaskComponent {
  globalStateValue: any;
  globalStateValueForm: any;
  taskList: any;
  groupList: any;
  createTaskForm!: FormGroup;
  formData: any;
  teamList: any;
  userId: any;

  targetDatetime: any;
  meridian: any = {
    targetMeridian: 'PM',
  }

  subTaskNetCallOnce: boolean = true;
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) { 
      this.createTaskForm = this.formBuilder.group({
        // Task details from task_details table
        taskNumber: {value: this.route.snapshot.queryParamMap.get('task_number'), disabled: true},
        subTaskNumber: {value: '', disabled: true},
        subTaskName: '',
        subTaskState: {value: 'New', disabled: true},
        subTaskDescription: '',
        assignedTo: {value: this.userId, disabled: false},
        subTaskImportance: 'Low',
        referenceTask: null,
        targetDatetime: '',

        // Workspace details from workspace_details table
        workspaceName: {value: this.route.snapshot.queryParamMap.get('workspace_id'), disabled: true},

        // Group details from group_details table
        groupName: {value: this.route.snapshot.queryParamMap.get('task_group_id'), disabled: true},
      })
   }

  changeMeridian(value: any) {
    if(this.meridian[value]=='AM'){
      this.meridian[value]='PM';
    }else{
      this.meridian[value]='AM';
    }
  }
  inputValueHour: any = '';
  inputValueMinutes: any = '';
  checkHours(){
    if(this.inputValueHour>12 || this.inputValueHour<0){
      this.inputValueHour='';
    }
  }
  checkMinutes(){
    if(this.inputValueMinutes>59 || this.inputValueMinutes<0){
      this.inputValueMinutes='';
    }
  }

  initializeForm() {
    this.sharedService.globalState$.subscribe((state) => {
      this.createTaskForm = this.formBuilder.group({

        // Task details from task_details table
        taskNumber: {value: this.route.snapshot.queryParamMap.get('task_number'), disabled: true},
        subTaskNumber: [{value: '', disabled: true}],
        subTaskName: '',
        subTaskState: [{value: 'New', disabled: true}],
        subTaskDescription: '',
        assignedTo: [{ value: this.userId, disabled: false }],
        subTaskImportance: 'Low',
        referenceTask: null,
        targetDatetime_date: '',
        targetDatetime_hours: '',
        targetDatetime_minutes: '',
  
        // Workspace details from workspace_details table
        workspaceName: {value: this.route.snapshot.queryParamMap.get('workspace_id'), disabled: true},
  
        // Group details from group_details table
        groupName: {value: this.route.snapshot.queryParamMap.get('task_group_id'), disabled: true},
  
      })
    })
  }

  onCreateSubTask() {
    const targetDatetime = dateToStr(this.createTaskForm.get('targetDatetime_date')?.value,
                                this.createTaskForm.get('targetDatetime_hours')?.value, 
                                this.createTaskForm.get('targetDatetime_minutes')?.value,
                                this.createTaskForm.get('targetDatetime_meridian')?.value)

    const body = new URLSearchParams();

    const taskNumber: any = this.route.snapshot.queryParamMap.get('task_number');
    const subTaskName: any = this.createTaskForm.value.subTaskName;
    const subTaskDescription: any = this.createTaskForm.value.subTaskDescription;
    const assignedTo: any = this.createTaskForm.value.assignedTo;
    const subTaskImportance: any = this.createTaskForm.value.subTaskImportance;
    if(this.createTaskForm.value.referenceTask!=null){
      const referenceTask: any = this.createTaskForm.value.referenceTask;
      body.set('reference_task', referenceTask);
    }
    const workspaceId: any = this.route.snapshot.queryParamMap.get('workspace_id')
    const groupId: any = this.route.snapshot.queryParamMap.get('task_group_id')

    body.set('task_number', taskNumber);
    body.set('sub_task_name', subTaskName);
    body.set('sub_task_description', subTaskDescription);
    body.set('assigned_to', assignedTo);
    body.set('sub_task_importance', subTaskImportance);
    body.set('target_datetime', targetDatetime);
    body.set('workspace_id', workspaceId);
    body.set('sub_task_group_id', groupId);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.http.post(environment.apiUrl+'/subtask/create', body.toString(), {headers, withCredentials: true})
      .subscribe(response => {
        this.sharedService.handleFilterChange(groupId);
        this.router.navigate(['/home/task/'+taskNumber])
        // this._snackBar.open('Sub-task created successfully!', 'Dismiss', {duration: 3000})
        this._snackBar.openFromComponent(IconSnackBarComponent, {
          data: {
            message: `Sub-task created successfully!`,
            icon: 'check_circle'
          },
          duration: 3000
        })
      });
  }

  onBackBtnClick() {
    this.router.navigate(['/home/task/'+this.route.snapshot.queryParamMap.get('task_number')])
  }

  ngOnInit() {
    this.sharedService.globalState$.subscribe((state) => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        });
        // Update the component's property when the state changes
        this.globalStateValue = state.data; // Replace with the appropriate key from your state
        this.globalStateValueForm = state;

        if(state.workspace){
          this.groupList=state.workspace;
        }

        if(state.workspace?.workspace_id) {
          for(let i=0; i<state.userInfo.length; i++){
            if(state.userInfo[i].workspace_id==state.workspace.workspace_id){
              this.teamList=state.workspace.team_members;
            }
          }
        }

        this.userId = state?.userPreference?.[0]?.user_id;

        if(this.subTaskNetCallOnce){
          
          this.subTaskNetCallOnce = false;
          this.http.get(environment.apiUrl+'/subtask/list/'+this.route.snapshot.queryParamMap.get('task_number'), {headers, withCredentials: true})
            .subscribe((response) => {
              this.taskList=response;
            })
        }

        
    });
    
    this.initializeForm();

  }
}
