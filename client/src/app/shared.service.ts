import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private globalStateSubject = new BehaviorSubject<any>({});
  globalState$: Observable<any> = this.globalStateSubject.asObservable();

  private workspaceChangeSubject = new Subject<string>();
  private groupChangeSubject = new Subject<string>();
  private createTaskSubject = new Subject<string>();
  private filterChangeSubject = new Subject<string>();

  setGlobalState(key: string, value: any) {
    const currentState = this.globalStateSubject.value;
    currentState[key] = value;
    this.globalStateSubject.next({ ...currentState });
  }

  getGlobalState(key: string) {
    const currentState = this.globalStateSubject.value;
    return currentState[key];
  }

  handleWorkspaceChange(workspace: any): void {
    this.setGlobalState('workspace', workspace);
    this.workspaceChangeSubject.next(workspace);
  }

  getWorkspaceChangeObservable() {
    return this.workspaceChangeSubject.asObservable();
  }

  handleFilterChange(group: any): void {
    this.filterChangeSubject.next(group);
  }

  getFilterChangeObservable() {
    return this.filterChangeSubject.asObservable();
  }

  getEntireGlobalState() {
    return this.globalStateSubject.value;
  }
}
