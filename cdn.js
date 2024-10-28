// Função para carregar dinamicamente uma biblioteca de uma CDN
function loadCDN(libraryUrl, callback) {
    const script = document.createElement('script');
    script.src = libraryUrl;
    script.onload = callback;
    script.onerror = () => {
        console.error('Erro ao carregar a CDN:', libraryUrl);
    };
    document.head.appendChild(script);
}

// Exemplo de como usar a função loadCDN para carregar uma biblioteca
loadCDN('https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js', function() {
    console.log('Biblioteca Axios carregada!');
    
    // Agora você pode usar a biblioteca carregada (Axios, neste exemplo)
    axios.get('https://api.github.com/users').then(response => {
        console.log(response.data);
    });
    axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo')
  .then(response => {
    console.log(response.data);
  });
  axios.get('https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_API_KEY')
  .then(response => {
    console.log(response.data);
  });
  axios.get('https://cloud.iexapis.com/stable/stock/aapl/quote?token=YOUR_API_KEY')
  .then(response => {
    console.log(response.data);
  });
  axios.get('https://api.polygon.io/v1/last/crypto/BTC/USD?apiKey=YOUR_API_KEY')
  .then(response => {
    console.log(response.data);
  });
  axios.get('https://globalcurrencies.xignite.com/xGlobalCurrencies.json/GetRealTimeRate?Symbol=EURUSD&_token=YOUR_API_KEY')
  .then(response => {
    console.log(response.data);
  });
  axios.get('https://api.tiingo.com/tiingo/daily/aapl/prices?token=YOUR_API_KEY')
  .then(response => {
    console.log(response.data);
  });
  axios.get('https://www.quandl.com/api/v3/datasets/WIKI/AAPL/data.json?api_key=YOUR_API_KEY')
  .then(response => {
    console.log(response.data);
  });
  axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=YOUR_API_KEY')
  .then(response => {
    console.log(response.data);
  });
  axios.get('https://api-v2.intrinio.com/securities/AAPL/summary?api_key=YOUR_API_KEY')
  .then(response => {
    console.log(response.data);
  });
axios.get('https://api-v2.intrinio.com/securities/AAPL/summary?api_key=YOUR_API_KEY')
  .then(response => {
    console.log(response.data);
  });
  axios.get('https://webz.io/api/v1/news/all?source=finance&token=YOUR_API_KEY')
  .then(response => {
    console.log(response.data);
  });

});
