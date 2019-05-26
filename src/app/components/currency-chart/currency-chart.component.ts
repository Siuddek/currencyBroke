import { Component, OnInit} from '@angular/core';
import { CurrencyService } from 'src/app/services/currency.service';
import { queryTimePeriod, jsonTimePeriod, DataRange } from 'src/app/models/apiQueryEnums';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-currency-chart',
  templateUrl: './currency-chart.component.html',
  styleUrls: ['./currency-chart.component.css']
})
export class CurrencyChartComponent implements OnInit {
  public chartType: string = 'line';
  private from:string;
  private to:string;
  //stock value weekly returned by alpha vantage
  private stockData:Object;
  //list of dates as key for stockData
  private dates:Array<string>
  private openStockValues:Array<number>;
  private chartValues:Array<any>;
  private dataDownloaded:boolean;
  //enum for api url get query
  private queryTimePeriod:queryTimePeriod;
  //for json format got from api query
  private jsonTimePeriod:jsonTimePeriod;
  private dataRange:DataRange;
  private regression:Array<number>;

  constructor(private currencyInfo:CurrencyService){}

  ngOnInit(): void {
    this.dataDownloaded = false;
    this.from = "EUR";
    this.to = "PLN";
    this.queryTimePeriod = queryTimePeriod.daily;
    this.jsonTimePeriod = jsonTimePeriod.day;
    this.dates = new Array();
    this.openStockValues = new Array();
    this.chartValues = new Array();
    this.regression = new Array();
    this.getCurrencyData();
    this.dataRange = DataRange.year;
  }

  public getCurrencyData(){
    //have to clear array before pushing keys
    this.dataDownloaded = false;
    this.dates = [];
    this.chartValues = [];
    this.openStockValues = [];
    this.currencyInfo.getExchangeCurrency(this.from, this.to, this.queryTimePeriod).subscribe(data => {
      if(data[`Time Series FX (${this.jsonTimePeriod})`] == null && typeof data[`Time Series FX (${this.jsonTimePeriod})`] === 'undefined'){
        window.alert("Such a conversion does not exist");
        return;
      }
      this.stockData = data[`Time Series FX (${this.jsonTimePeriod})`];

      for(const [key, value] of Object.entries(this.stockData)){
        //keys for dictionary of currency stock values
        this.dates.push(key);
      }

      this.formDataForDisplay();

      this.regression = [];
      var datesLength = Math.floor(this.dates.length);
      var numberOfSlices = 30;
      var sliceLength = Math.floor(datesLength/numberOfSlices);
      var begin;
      var end;
      for(var i = 0; i < numberOfSlices; i++){
        begin = i*sliceLength;
        end = (i+1)*sliceLength;
        Array.prototype.push.apply(this.regression, this.calculateRegression(begin, end));
      }
      
      this.applyChartValues();

      this.dataDownloaded = true;
      });
  }

  applyChartValues():void{
    this.chartValues = [
      { data: this.openStockValues, label: `${this.from} to ${this.to}` },
      {data:this.regression, lineTension: 0, label:'Linear Regression'}
      ];
  }

  formDataForDisplay():void{
    //putting data from left to right on chart
    this.dates.reverse();
    //getting last N elements of array
    this.dates = this.dates.slice(this.dates.length - this.dataRange, this.dates.length - 1);

    for(var _i = 0; _i < this.dates.length; _i++){
      this.openStockValues.push(this.stockData[this.dates[_i]]['1. open']);
    }
  }

  parseStockValueToNumber(value):number{
    return parseFloat(value.toString());
  }

  public calculateRegression(begin:number, end:number):Array<number>{
    var sum_x:number = 0;
    var sum_y:number = 0;
    var sum_xy:number = 0;
    var sum_xx:number = 0;
    var count:number = end - begin;

    for(var i = begin; i < end; i++){
      //x axis is of date type, so we will assume data as index in array
      sum_x += i;
      sum_y += this.parseStockValueToNumber(this.openStockValues[i]);
      sum_xx += i*i;
      sum_xy += i* this.parseStockValueToNumber(this.openStockValues[i]);
    }

    //y = a*x + b
    //calculating coefficients
    var a = ((count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x));
    var b = (sum_y/count) - (a*sum_x)/count;

    var result = [];
    for(var i = begin; i < end; i++){
      result.push(a*i + b);
    }

    return result;
  }

  //colors for charts
  public chartColors: Array<any> = [
    {
      //stock value colors
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
    {
      //linear regression colors
      borderColor: 'rgba(0, 255, 132, .7)',
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true,
  };

  public checkCheckBoxvalue(event){
    console.log(event.checked);
  }

  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

}
