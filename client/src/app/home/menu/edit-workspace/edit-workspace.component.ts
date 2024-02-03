import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ManageWorkspaceComponent } from '../manage-workspace/manage-workspace.component';

@Component({
  selector: 'app-edit-workspace',
  templateUrl: './edit-workspace.component.html',
  styleUrls: ['./edit-workspace.component.css']
})
export class EditWorkspaceComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditWorkspaceComponent>,
    private dialog: MatDialog,
  ) { }

  onCloseDialog() {
    this.dialogRef.close();
    this.dialog.open(ManageWorkspaceComponent);
  }

  ngOnInit() {

  }

}
