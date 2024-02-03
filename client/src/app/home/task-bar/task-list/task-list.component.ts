import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment.dev';
import { SharedService } from 'src/app/shared.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit{
  taskList: any;

  private workspaceSubscription: Subscription = new Subscription();
  private groupSubscription: Subscription = new Subscription();
  private filterOptionSubscription: Subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService,
  ) { }

  isArray(object: any): boolean{
    return Array.isArray(object);
  }

  onTaskSelect(workspace_id: any, task_number: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();

    body.set('workspace_id', workspace_id)
    // body.set('task_number', task_number)

    this.http.post(environment.apiUrl+'/task/'+task_number, body.toString(),{headers, withCredentials: true})
      .subscribe(response => {
        this.router.navigate(['/home/task/'+task_number]);
      });
  }

  ngOnInit() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.filterOptionSubscription = this.sharedService.getFilterChangeObservable()
      .subscribe((group) => {
        const filterOptions = this.sharedService.getGlobalState('filterOptions')
        if(filterOptions){
          const body = new URLSearchParams();
        
          body.set('workspace_id', this.sharedService.getGlobalState('filterOptions').workspace_id);
          body.set('group_ids', this.sharedService.getGlobalState('filterOptions').group_ids);
          body.set('task_states', this.sharedService.getGlobalState('filterOptions').task_states);
          body.set('task_importance', this.sharedService.getGlobalState('filterOptions').importance);
          body.set('has_sub_task', this.sharedService.getGlobalState('filterOptions').has_sub_task);
          body.set('creation_datetime', this.sharedService.getGlobalState('filterOptions').creation_datetime.datetime);
          body.set('creation_datetime_operator', this.sharedService.getGlobalState('filterOptions').creation_datetime.operator);
          body.set('target_datetime', this.sharedService.getGlobalState('filterOptions').target_datetime.datetime);
          body.set('target_datetime_operator', this.sharedService.getGlobalState('filterOptions').target_datetime.operator);
          body.set('order_field', this.sharedService.getGlobalState('filterOptions').order.field);
          body.set('order_sequence', this.sharedService.getGlobalState('filterOptions').order.sequence);

          this.http.post(environment.apiUrl+'/task/filter', body.toString(), {headers, withCredentials: true})
            .subscribe((response) => {
              this.taskList=response;
            })
        }
    })
  }

  ngOnDestroy() {
    if(this.workspaceSubscription){
      this.workspaceSubscription.unsubscribe();
    }

    if(this.groupSubscription){
      this.groupSubscription.unsubscribe();
    }

    if(this.filterOptionSubscription){
      this.filterOptionSubscription.unsubscribe();
    }
  }
}
