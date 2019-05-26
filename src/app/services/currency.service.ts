import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { queryTimePeriod } from '../models/apiQueryEnums';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiKey:string = "S4GWGUGGASTYRDDW";
  constructor(private http: HttpClient) { }

  getExchangeCurrency(from: string, to:string, timePeriod:queryTimePeriod): Observable<Object>{
    return this.http.get(`https://www.alphavantage.co/query?function=${timePeriod}&from_symbol=${from}&to_symbol=${to}&outputsize=full&apikey=S4GWGUGGASTYRDDW`);
  }
  //getting currencies shortcuts list
  getCurrencyList(): Observable<Object>{
    return this.http.get<Object>("https://openexchangerates.org/api/currencies.json");
  }
}

