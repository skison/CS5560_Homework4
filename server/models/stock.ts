import * as mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  stocksymbol: String,
  stockamount: Number,
  stockprice: Number,
  owner: String
});

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
