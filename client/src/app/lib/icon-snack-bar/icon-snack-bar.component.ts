import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-icon-snack-bar',
  templateUrl: './icon-snack-bar.component.html',
  styleUrls: ['./icon-snack-bar.component.css']
})
export class IconSnackBarComponent {
  message: SafeHtml;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {
    this.message = this.sanitizer.bypassSecurityTrustHtml(data.message);
  }
  
  dismiss() {
    this._snackBar.dismiss();
  }
}
