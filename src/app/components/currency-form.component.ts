import { HttpClient, HttpHeaders, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentState } from './component-state.type';
import { CommonModule } from '@angular/common';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'app-currency-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <form ngNativeValidate (ngSubmit)="submitFormData()">
      <div class="input-group">
        <label for="currency">Currency</label>
        <input required id="currency" type="text" name="currency" placeholder="EUR" maxlength="3" onkeydown="return /[a-zA-Z]/i.test(event.key)" (keyup)="capitalizeInput()" [(ngModel)]="formData.currency" >
      </div>
      <div class="input-group">
        <label for="name">Name</label>
        <input required id="name" type="text" name="name" placeholder="Anthony Hopkins" onkeydown="return /[a-zA-Z]/i.test(event.key)" [(ngModel)]="formData.name" >
      </div>
      <button class="button-29" name="button" type="submit">Check currency</button>
    </form>
    <div *ngIf="componentState.state === 'loading'" class="currency-value">Checking the currency rate...</div>
    <div *ngIf="componentState.state === 'idle'" class="currency-value">
    EXCHANGE RATE: {{ responseData?.value }}
    </div>
  `,
  styleUrls:['./currency-form.component.scss'] 
  
})
export class CurrencyFormComponent {

  @Output() errorEmitter: EventEmitter<string>  = new EventEmitter<string>();
  componentState: ComponentState<any> = { state: "idle"};
  uriCurrencyValue: string = "http://localhost:8080/currencies/get-current-currency-value-command";
  formData = { currency: '', name: '' };
  responseData: any;
  private http = inject(HttpClient);


  submitFormData(): void {
    this.componentState.state = "loading"
    this.http.post(this.uriCurrencyValue, this.formData, { headers: httpOptions.headers, observe: 'response' })
      .subscribe({
        next: (response: HttpResponse<any>) => {
            this.responseData = response.body;
            this.componentState.state = "idle";
        },
        complete: () => {
          console.log('Post completed');
          this.componentState.state = "idle";
        },
        error: (err) => {
          this.componentState.state = "idle";
          if(err.status === HttpStatusCode.NotFound ){
            this.errorEmitter.emit( this.formData.currency + " currency not found");
            console.error(this.formData.currency + " currency not found");
            console.error('Error fetching records:', err);
          } else{
            this.errorEmitter.emit("We are having a temporary connection problem. Please try again later.");
            console.error('Error fetching records:', err);
          }
        },
      });
  }

  capitalizeInput() {
    this.formData.currency = this.formData.currency.toUpperCase();
  }
}
