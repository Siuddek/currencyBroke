import { Component, OnInit, ViewEncapsulation, forwardRef, ViewChild } from '@angular/core';
import { exchangeInfo } from './models/exchangeInfo';
import { CurrencyService } from './services/currency.service';
import {MatButtonModule} from '@angular/material/button';
import { CurrencyChartComponent } from './components/currency-chart/currency-chart.component';
import { queryTimePeriod, DataRange } from './models/apiQueryEnums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild(CurrencyChartComponent) Chart;

  private title:string = 'currencyBroker';
  //currencies selected by user
  private sourceValue:string;
  private targetValue:string;
  //list of currencies shortcuts
  private currencyList:Array<string>;
  private avaibleIntervals:Array<string>;
  private userDataRange:string;

  constructor(private currencyInfo:CurrencyService){}

  ngOnInit(){
    //default options
    this.sourceValue = "EUR";
    this.targetValue = "PLN";
    this.currencyList = new Array();
    this.userDataRange = "1 year"
    this.avaibleIntervals = new Array();
    this.currencyInfo.getCurrencyList().subscribe(data => {
        for(const [key, value] of Object.entries(data)){
          this.currencyList.push(key);
        }
       });
    this.avaibleIntervals = ["week", "month", "6 months", "1 year", "2 years", "5 years"];
  }

  sendSelectedCurrencies(){
      this.Chart.from = this.sourceValue;
      this.Chart.to = this.targetValue;
      this.Chart.getCurrencyData();
  }

  sendDataRange(){
    if(this.userDataRange == "week"){
      this.Chart.dataRange = DataRange.week
    }
    else if (this.userDataRange == "month"){
      this.Chart.dataRange = DataRange.month
    }
    else if (this.userDataRange == "6 months"){
      this.Chart.dataRange = DataRange.sixMonths;
    }
    else if (this.userDataRange == "1 year"){
      this.Chart.dataRange = DataRange.year;
    }
    else if (this.userDataRange == "2 years"){
      this.Chart.dataRange = DataRange.twoYers;
    }
    else if (this.userDataRange == "5 years"){
      this.Chart.dataRange = DataRange.fiveYers;
    }
    this.Chart.getCurrencyData();
  }
}


