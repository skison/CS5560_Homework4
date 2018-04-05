import Stock from '../models/stock';
import BaseCtrl from './base';

export default class StocksCtrl extends BaseCtrl {
  model = Stock;
  
 // Get all stocks for a user
  getAll = (req, res) => {
	  console.log("returning stocks from owner:");
	  console.log(req.body.owner);
    this.model.find({"owner": req.body.owner}, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  }

  // Count all stocks for a user
  count = (req, res) => {
	  console.log("counting stocks from owner:");
	  console.log(req.body.owner);
    this.model.count({"owner": req.body.owner}, (err, count) => {
      if (err) { return console.error(err); }
      res.status(200).json(count);
    });
  }

  // Insert stock from a user
  insert = (req, res) => {
	console.log("inserting stock:");
	console.log(req.body);
	  
    const obj = new this.model(req.body);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      res.status(200).json(item);
    });
  }

  //get current value of the stock
  getValue = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }

      console.log("finding value of " + item.stocksymbol);

      var json;
      var endpoint = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + item.stocksymbol + '&interval=1min&apikey=EA5MI7P2B0D1N83Y';
      var request = require("request");
      //var retVal = this.http.get<string>("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=demo");

      //console.log("Got value:");
      //console.log(retVal);
      //https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=demo
      //res.status(200).json(retVal);

      request.get(endpoint, (error, response, body) => {
          try
          {
            json = JSON.parse(body);
            var jsonMeta = json['Meta Data']; //make sure this exists in the json before continuing
  
            if(jsonMeta != null)
            {
              var curTime = jsonMeta['3. Last Refreshed']; //timestamp used to find the most recent stock info
  
              console.log("Got value of " + item.stocksymbol + " at " + curTime);
  
              var curInfo = json['Time Series (1min)'][curTime];
  
              //console.log(curInfo);
  
              var curPrice = curInfo['4. close']; //get close info (the very last measured value)
  
              console.log(item.stocksymbol + " close value: " + curPrice);
  
              res.status(200).json({ 'value': curPrice });
            }
            else
            {
              console.log("Symbol " + item.stocksymbol + " does not exist!");
              res.status(200).json(null); //return null if no entry exists
            }
          }catch(e) //server error, respond with an error message
          {
            res.sendStatus(500); //server error
          }
         
      });
    });
  }

}