import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Stock } from '../shared/models/stock.model';
//for unique users
import { AuthService } from '../services/auth.service';

@Injectable()
export class StocksService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  //get stocks, specify the username
  getAllStocks(): Observable<Stock[]> {
	  //console.log({"user": this.auth.currentUser.username});
    return this.http.post<Stock[]>('/api/stocks', {"owner": this.auth.currentUser.username});
  }

  //count the stocks, specify the username
  countStocks(): Observable<number> {
    return this.http.post<number>('/api/stocks/count', {"owner": this.auth.currentUser.username});
  }

  //Add stock, specify which user this stock belongs to
  addStock(stock: Stock): Observable<Stock> {
	  stock.owner = this.auth.currentUser.username;
	  console.log(stock);
    return this.http.post<Stock>('/api/stocks/insert', stock);
  }

  //get stock, TODO: make sure user id matches
  getStock(stock: Stock): Observable<Stock> {
    return this.http.get<Stock>(`/api/stocks/get/${stock._id}`);
  }

  //get stock's current value, TODO: make sure user id matches
  getStockValue(id: String): Observable<String>{
    //return this.http.get<string>(`/api/stocks/getvalue/${id}`);
    var endpoint = "/api/stocks/getvalue/" + id;

    return this.http.get<String>(endpoint);
  }

  //edit stock, TODO: make sure user id matches
  editStock(stock: Stock): Observable<string> {
    return this.http.put(`/api/stocks/update/${stock._id}`, stock, { responseType: 'text' });
  }

  //delete stock, TODO: make sure user id matches
  deleteStock(stock: Stock): Observable<string> {
    return this.http.delete(`/api/stocks/delete/${stock._id}`, { responseType: 'text' });
  }

}
