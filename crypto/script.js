var btc = document.getElementById("bitcoin");
var eth = document.getElementById("ethereum");
var doge = document.getElementById("dogecoin");

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,DOGE&tsyms=USD,EUR",
    "method": "GET",
    "headers": {}
}

$.ajax(settings).done(function(response) {
    btc.innerHTML = response.BTC.USD;
    eth.innerHTML = response.ETH.USD;
    doge.innerHTML = response.DOGE.USD;
});
