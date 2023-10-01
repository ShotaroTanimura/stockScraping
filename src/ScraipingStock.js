'use strict'
import request from 'request'
import {secret} from  './secret.js'
const ALPHA_VANTAGE_API_KEY = secret.apiKey; 
function getStock(ticker){
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=15min&apikey=${ALPHA_VANTAGE_API_KEY}`
  
  request.get(
   {
     url: url,
     json: true,
     headers: { 'User-Agent': 'request' },
   },
   (err, res, data) => {
     if (err) {
       console.log('Error:', err)
     } else if (res.statusCode !== 200) {
       console.log('Status:', res.statusCode)
     } else {
       // data is successfully parsed as a JSON object:
       let timeSeries = data['Time Series (15min)']
       let lowPrice = '3. low'
  
       // 最初の一つのオブジェクトを取得
       let firstKey = Object.keys(timeSeries)[0]
       let firstObject = timeSeries[firstKey]
       console.log(firstObject)
       return firstObject[lowPrice]
     }
   },
  )
}
// getStock("EDBL")
export {getStock}

