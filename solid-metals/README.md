# Solid Metals
## Frontend
This widget will call a backend piece to retrieve spot prices for gold, silver and platinum and display them in tabular form, allowing the user to refresh on demand (with a limit).

## Backend
Backend will provide a single endpoint to retrieve quotes (or error)

```
/prices
```

Response will be of type:

```js
{
  ts: number
  au: number
  ag: number
  pt: number
  status: number
}
``` 

To get the prices, the backend will periodically call the gold api (see below) to retrieve an updated price.

## Gold API
### Get Quotes
Using goldapi.io to get metal spot prices call `https://www.goldapi.io/api/XAU/USD`

Where:
* `XAU` is for gold
* `XAG` is for silver
* `XPT` is for platinum

And, 'USD' is for the currency, for this widget, USD will be used.

#### Javascript
```js
var myHeaders = new Headers();
myHeaders.append("x-access-token", "<token>");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://www.goldapi.io/api/XAU/USD", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```


#### Curl
```bash
curl -X GET 'https://www.goldapi.io/api/XAU/USD' -H 'x-access-token: <token>'
```

#### Response 

```js
{
  "timestamp": 1767477179,
  "metal": "XAU",
  "currency": "USD",
  "exchange": "FOREXCOM",
  "symbol": "FOREXCOM:XAUUSD",
  "prev_close_price": 4319.375,
  "open_price": 4319.375,
  "low_price": 4310.085,
  "high_price": 4402.385,
  "open_time": 1767312000,
  "price": 4332.32,
  "ch": 12.94,
  "chp": 0.3,
  "ask": 4332.8,
  "bid": 4331.84,
  "price_gram_24k": 139.2873,
  "price_gram_22k": 127.68,
  "price_gram_21k": 121.8764,
  "price_gram_20k": 116.0728,
  "price_gram_18k": 104.4655,
  "price_gram_16k": 92.8582,
  "price_gram_14k": 81.2509,
  "price_gram_10k": 58.0364
}
```

### Check usage stats

Call `https://www.goldapi.io/api/stat`

#### Javascript
```js
var myHeaders = new Headers();
myHeaders.append("x-access-token", "<token>");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://www.goldapi.io/api/stat", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```


#### Curl
```bash
curl -X GET 'https://www.goldapi.io/api/stat' -H 'x-access-token: <token>'
```

#### Response 

```js
{
  "requests_today": 1,
  "requests_yesterday": 0,
  "requests_month": 1,
  "requests_last_month": 1
}
```

# Putting token in env for local usage

```bash
export AU_API_TOKEN=$(more app.env)
```