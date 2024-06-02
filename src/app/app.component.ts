import { Component } from '@angular/core';
import { CurrencyFormComponent } from './components/currency-form.component';
import { RecordTableComponent } from './components/record-table.component';
import { ComponentState } from './components/component-state.type';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CurrencyFormComponent, RecordTableComponent, CommonModule],
  template: `
    <div class="error-container" *ngIf="componentState.state === 'error'" ><h1>{{ recivedError }}</h1></div>
    <app-currency-form (errorEmitter)="receiveData($event)"/>
    <br/>
    <br/>
    <app-record-table (errorEmitter)="receiveData($event)" />
    
    `,
    styleUrls:['./app.component.scss'] 
})
export class AppComponent {

  componentState: ComponentState<any> = { state: "idle"};

  title = 'xCodeClint';
  recivedError: string | undefined;

  receiveData(err: string) {
    this.componentState.state = "error"
    this.recivedError = err;
    setTimeout(() => {
      this.componentState.state = 'idle';
      this.recivedError = undefined;
    }, 5000);
  }
  
  
}
