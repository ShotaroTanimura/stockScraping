'use strict'
import request from 'request'
import { secret } from './secret.js'
const ALPHA_VANTAGE_API_KEY = secret.apiKey;

function getStock(ticker) {
  return new Promise((resolve, reject) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=15min&apikey=${ALPHA_VANTAGE_API_KEY}`;
  
    request.get(
      {
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' },
      },
      (err, res, data) => {
        if (err) {
          reject(err);
        } else if (res.statusCode !== 200) {
          reject(`Status: ${res.statusCode}`);
        } else {
          let timeSeries = data['Time Series (15min)'];
          let lowPrice = '3. low';
  
          let firstKey = Object.keys(timeSeries)[0];
          let firstObject = timeSeries[firstKey];
          resolve(firstObject[lowPrice]);
        }
      }
    );
  });
}

export { getStock }