import { Component, Input } from '@angular/core';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  @Input('loadingText') loadingText: string;

  ngOnInit() {
    if (!this.loadingText) {
      this.loadingText = 'Loading';
    }
  }
  spinnerColor = 'rgb(0, 82, 204)';
}
