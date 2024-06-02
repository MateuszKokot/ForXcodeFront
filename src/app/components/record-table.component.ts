import { Component, OnInit, inject, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ComponentState } from './component-state.type';

@Component({
  selector: 'app-record-table',
  imports: [CommonModule],
  standalone: true,
  template: `
     <button class="button-29" role="button" (click)="getRecordsFromApi()">Get Records</button>
    <table>
      <thead>
        <tr>
          <th>Currency</th>
          <th>Name</th>
          <th>Date</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of data">
          <td>{{ item.currency }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.parsedDate }}</td>
          <td>{{ item.value }}</td>
        </tr>
      </tbody>
    </table>
    <h5 class="loading-info" *ngIf="componentState.state === 'loading'">Loading data...</h5>
  `,
  styleUrls:['./record-table.component.scss'] 
})
export class RecordTableComponent {

  componentState: ComponentState<any> = { state: "idle"};

  @Output() errorEmitter: EventEmitter<string>  = new EventEmitter<string>();

  uriRequest: string = "http://localhost:8080/currencies/requests";

  data: Array<{ currency: string; name: string; parsedDate: Date; value: number }> = [];

  private http = inject(HttpClient);


  getRecordsFromApi(): void {
    this.componentState.state = "loading";
    this.http.get(this.uriRequest).subscribe(
      {
        next: (response) => {
          this.data = (response as any[]).map(record => ({
            ...record,
            parsedDate: new Date(record.date)
          }));
        },
        complete: () => {
          this.componentState.state = "idle";
          console.log('Fetch completed');
        },
        error: (err) => {
          this.componentState.state = "idle";
          console.error('Error fetching records:', err);
          this.errorEmitter.emit("We are having a temporary problem downloading data. Please try again later.");
        },
      });
  }

  
}
