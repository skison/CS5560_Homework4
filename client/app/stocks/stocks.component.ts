import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

//added to show current user
import { AuthService } from '../services/auth.service';

import { StocksService } from '../services/stocks.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Stock } from '../shared/models/stock.model';

import { D3Service, D3, Selection } from 'd3-ng2-service'; // <-- import the D3 Service, the type alias for the d3 variable and the Selection interface

import { AfterViewInit } from '@angular/core';

//var authUser = AuthService;
//alert(authUser);

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  //template: '<svg width="960" height="600"></svg>',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, AfterViewInit {

  private d3: D3; // <-- Define the private member which will hold the d3 reference
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;

  stock = new Stock();
  stocks: Stock[] = [];
  
  isLoading = true;
  isEditing = false;
  
  addStockForm: FormGroup;
  stocksymbol = new FormControl('', Validators.required);
  stockamount = new FormControl('', Validators.required);
  stockprice = new FormControl('', Validators.required);

  constructor(element: ElementRef, d3Service: D3Service,
              private stocksService: StocksService,
              private formBuilder: FormBuilder,
              public toast: ToastComponent) 
              { 
                this.d3 = d3Service.getD3(); // <-- obtain the d3 object from the D3 Service
                this.parentNativeElement = element.nativeElement;
              }

  ngOnInit() {
    this.getAllStocks();
    this.addStockForm = this.formBuilder.group({
      stocksymbol: this.stocksymbol,
      stockamount: this.stockamount,
      stockprice: this.stockprice
    });
  }

  ngAfterViewInit() 
  {
    this.drawBarChart();
  }

  drawBarChart()
  {
    let d3 = this.d3; // <-- for convenience use a block scope variable
    //let d3ParentElement: Selection<any, any, any, any>; // <-- Use the Selection interface (very basic here for illustration only)
    let d3ParentElement: Selection<HTMLElement, any, null, undefined>;
    let d3Svg: Selection<SVGSVGElement, any, null, undefined>;
    let d3G: Selection<SVGGElement, any, null, undefined>;

    
    // ...
    console.log("got element");
    if (this.parentNativeElement !== null) {
      /*console.log(this.parentNativeElement.children);
      console.log(this.parentNativeElement.children[0]);
      console.log(this.parentNativeElement.children[1]);
      console.log(this.parentNativeElement.children[2]);*/

      //d3ParentElement = d3.select(this.parentNativeElement); // <-- use the D3 select method 
      if(this.parentNativeElement.children[2] == null){return;}
      d3ParentElement = d3.select(this.parentNativeElement.children[2]);
      //d3ParentElement = d3.select(this.parentNativeElement);
      d3Svg = this.d3Svg = d3ParentElement.select<SVGSVGElement>('svg');

      this.d3Svg.selectAll('*').remove(); //remove previous points

      var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = +d3Svg.attr("width") - margin.left - margin.right,
      height = +d3Svg.attr("height") - margin.top - margin.bottom;

      var g = d3Svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);


      /*var exampleStocks: Stock[] = [];
      var exampleStock1 = new Stock(), exampleStock2 = new Stock(), exampleStock3 = new Stock(), exampleStock4 = new Stock();
      exampleStock1.stocksymbol = 'GOOGL BUY';  exampleStock2.stocksymbol = 'GOOGL VAL';  exampleStock3.stocksymbol = 'MSFT BUY';   exampleStock4.stocksymbol = 'MSFT VAL';
      exampleStock1.stockamount = 10;           exampleStock2.stockamount = 10;           exampleStock3.stockamount = 60;           exampleStock4.stockamount = 60;
      exampleStock1.stockprice = 34;            exampleStock2.stockprice = 31;            exampleStock3.stockprice = 50;            exampleStock4.stockprice = 100;
      exampleStocks.push(exampleStock1); exampleStocks.push(exampleStock2); exampleStocks.push(exampleStock3); exampleStocks.push(exampleStock4);*/

      
      var parent = this; //store reference to this namespace
      var index = 0;

      var graphSymbols: string[] = [];
      this.stocks.forEach(function (curStock) {
        graphSymbols.push(curStock.stocksymbol+" BUY");
        graphSymbols.push(curStock.stocksymbol+" CUR");
      });

      var graphAmounts: number[] = [];
      this.stocks.forEach(function (curStock) {
        graphAmounts.push(curStock.stockprice*curStock.stockamount);
        graphAmounts.push(curStock['currentvalue']*curStock.stockamount);
      });

      //x.domain(this.stocks.map(function(s) { return s.stocksymbol+" BUY" }));
      x.domain(graphSymbols.map(function(s) { return s }));
      y.domain([0, d3.max(graphAmounts, function(a) { return a; })]);
      //y.domain([0, d3.max(this.stocks, function(d) { return d.stockprice*d.stockamount; })]);

      g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Frequency");

            this.stocks.forEach(function (point) {
              //console.log(point);
              var value = point.stockamount*point.stockprice;
              var curvalue = point.stockamount*point['currentvalue'];

              console.log(curvalue);

                if(!Number.isNaN(value) && value >= 0) //only render if possible
                {
                  g.append("rect")
                  .attr("class", "bar")
                  .attr("x", function(d) { return x(point.stocksymbol + " BUY"); })
                  .attr("y", function(d) { return y(value); })
                  .attr("fill", "#1059ce")
                  .attr("width", x.bandwidth())
                  .attr("height", function(d) { return height - y(value); });
                }

                  if(!Number.isNaN(curvalue) && curvalue >= 0) //only render if possible
                  {
                    var fillColor = "#b50b0b"; //default red color
                    
                     //get percentage change
                     var curDiff = curvalue-value;
                     var curChange = curDiff/value;
                     var displayChange = parseFloat((curChange*100 + "")).toFixed(2)+"%";
                     if(curChange >= 0){
                       displayChange = "+" + displayChange;
                       fillColor = "#0cb528"; //switch to green
                      }

                      g.append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(point.stocksymbol + " CUR"); })
                    .attr("y", function(d) { return y(curvalue); })
                    .attr("fill", fillColor)
                    .attr("width", x.bandwidth())
                    .attr("height", function(d) { return height - y(curvalue); });

                    //black text outline
                    g.append("text")
                    .attr("x", function(d) { return (x(point.stocksymbol + " CUR") + (x.bandwidth()/2) -20); })
                    .attr("y", function(d) { return y(curvalue)+10; })
                    .attr("dy", ".35em")
                    .attr("stroke", "#000000")
                    .attr("stroke-width", "3")
                    .attr("fill", "black")
                    .text(function(d) { return displayChange; });

                    //white text
                    g.append("text")
                    .attr("x", function(d) { return (x(point.stocksymbol + " CUR") + (x.bandwidth()/2) -20); })
                    .attr("y", function(d) { return y(curvalue)+10; })
                    .attr("dy", ".35em")
                    .attr("fill", "white")
                    .text(function(d) { return displayChange; });
                  }
              

                  //console.log("width: " + x.bandwidth());
                  //console.log("height: " + (height - y(value)));

      });

    } 
  }

  getAllStocks() {
    this.stocksService.getAllStocks().subscribe(
      data => this.stocks = data,
      error => console.log(error),
      () => {this.isLoading = false;
        //set the currentValue of each stock
        console.log("done loading");
        //this.drawBarChart(),
        //console.log(this.stocks);
        this.drawBarChart();
        this.setCurrentValues();
        }
    );
  }

  /*Go through the current stocks and find their current values (set it to stock.currentvalue)*/
  setCurrentValues()
  {
    var parent = this; //store reference to this namespace

    console.log("finding current values!");
    this.stocks.forEach(function (curStock) {
      
        parent.getStockValue(curStock); //get this stock's current value
        /*var stockVal = parent.getStockValue(curStock._id);
        console.log("returned stockValue: "+ stockVal);
        curStock['currentvalue'] = stockVal;*/
    }); 
  }

  /*find the current value of a given stock*/
  getStockValue(curStock)
  {
    var stockVal;

    /*this.stocksService.getStockValue(id).subscribe(
      data => stockVal = data,
      error => console.log(error)
    );*/
    this.stocksService.getStockValue(curStock._id).subscribe(
      data => stockVal = data,
      error => console.log(error),
      () => {
          //console.log(stockVal);
          if(stockVal != null) {curStock['currentvalue'] = stockVal.value;}
          else{curStock['currentvalue'] = -1;} //set to -1 to indicate a failed load (stocks can't be negative)

          this.drawBarChart();
      },
    );

    //console.log("Finding current value of " + id);
    //console.log(stockVal);
    
  }

  addStock() {
    this.stocksService.addStock(this.addStockForm.value).subscribe(
      res => {
		//alert(this.addCredentialsForm.value.name)
		//res.creddomain = "Yahoo.com";
		//res.creddomain = this.domains[this.selectdomain.value].domaininput;
		console.log(res);
		//added to use current username
		//alert(this.auth.currentUser.username);
        this.stocks.push(res);
        this.addStockForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
        this.getStockValue(res); //update this current stock's price
      },
      error => console.log(error)
    );
  }

  enableEditing(stock: Stock) {
    this.isEditing = true;
    this.stock = stock;
  }

  cancelEditing() {
    this.isEditing = false;
    this.stock = new Stock();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the stock to reset the editing
    this.getAllStocks();
  }

  editStock(stock: Stock) {
    this.stocksService.editStock(stock).subscribe(
      () => {
        this.isEditing = false;
        this.stock = stock;
        this.toast.setMessage('item edited successfully.', 'success');
        this.drawBarChart();
      },
      error => console.log(error)
    );
  }

  deleteStock(stock: Stock) {
    if (window.confirm('Are you sure you want to permanently delete this stock?')) {
      this.stocksService.deleteStock(stock).subscribe(
        () => {
          const pos = this.stocks.map(elem => elem._id).indexOf(stock._id);
          this.stocks.splice(pos, 1);
          this.toast.setMessage('stock deleted successfully.', 'success');
          this.drawBarChart();
        },
        error => console.log(error)
      );
    }
  }
  
  valExists(val) { return val != null; }

}
