// Função para buscar dados do Ibovespa usando a API
async function fetchIbovespaData() {
    const apiKey = 'L3F8TF51FVSLFPKG';  // Substitua pela sua chave de API válida
    const symbol = '^BVSP';  // Ticker do Ibovespa
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const timeSeries = data["Time Series (Daily)"];
        const latestDate = Object.keys(timeSeries)[0];
        const latestData = timeSeries[latestDate];
        console.log(`Ibovespa Data: ${latestDate} - Open: ${latestData["1. open"]}, Close: ${latestData["4. close"]}`);
        return `Ibovespa (${latestDate}): Open: ${latestData["1. open"]}, Close: ${latestData["4. close"]}`;
    } catch (error) {
        console.error('Erro ao buscar dados do Ibovespa:', error);
    }
}

// Função para buscar dados da Wikipedia
async function fetchWikipediaData(articleTitle) {
    const url = `https://pt.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&titles=${articleTitle}&origin=*`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const page = data.query.pages[Object.keys(data.query.pages)[0]];
        console.log(`Wikipedia Extract: ${page.extract}`);
        return page.extract;
    } catch (error) {
        console.error('Erro ao buscar dados da Wikipedia:', error);
    }
}

// Função para buscar dados de jogos na API RAWG
async function fetchGamesData(gameName) {
    const url = `https://api.rawg.io/api/games?key=YOUR_API_KEY&search=${gameName}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results[0] ? data.results[0].name + ": " + data.results[0].rating : "Jogo não encontrado.";
    } catch (error) {
        console.error('Erro ao buscar dados de jogos:', error);
    }
}

// Função para buscar dados de futebol na API-Sports
async function fetchFootballFixtures() {
    const url = `https://v3.football.api-sports.io/fixtures`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-apisports-key': 'YOUR_FOOTBALL_API_KEY',
                'x-rapidapi-host': 'v3.football.api-sports.io'
            }
        });
        const data = await response.json();
        return data.response[0] ? data.response[0].league.name + ": " + data.response[0].score.fulltime : "Dados de futebol não encontrados.";
    } catch (error) {
        console.error('Erro ao buscar dados de futebol:', error);
    }
}

// Função principal para coordenar múltiplas chamadas de API
async function getAllData(userQuery) {
    const wikipediaData = await fetchWikipediaData(userQuery);
    const gameData = await fetchGamesData(userQuery);
    const footballData = await fetchFootballFixtures();
    const ibovespaData = await fetchIbovespaData();

    return {
        wikipedia: wikipediaData,
        game: gameData,
        football: footballData,
        ibovespa: ibovespaData
    };
}

export { getAllData };
