const fetch = require('node-fetch')

const baseUrl = 'https://api.themoviedb.org/3'
const apiKey = 'ebb87b3c3ccf067a0867ba65db09dab4'
const apiPageCount = 20;
const uiPageCount = 8;

function getApiPages(uiPage) {
    let result = new Set()

    let apiResultsEndIndex = uiPage * uiPageCount;
    let apiPageEndIndex = apiResultsEndIndex % apiPageCount;
    let apiResultsStartIndex = apiResultsEndIndex - uiPageCount;
    let apiPageStartIndex = apiResultsStartIndex % apiPageCount;
    let startPage = getStartPage(apiResultsStartIndex, apiPageStartIndex)
    let endPage = getEndPage(apiResultsEndIndex, apiPageEndIndex)

    if (startPage === endPage) {
        result.add({number: startPage, startIndex: apiPageStartIndex, endIndex: apiPageEndIndex})
    } else {
        for (let i = startPage; i <= endPage; i++) {
            if (i === startPage) {
                result.add({number: i, startIndex: apiPageStartIndex, endIndex: 20})
            } else if (i === endPage) {
                result.add({number: i, startIndex: 0, endIndex: apiPageEndIndex})
            } else {
                result.add({number: i, startIndex: 0, endIndex: 20})
            }
        }
    }
    return result
}

function getStartPage(apiResultsStartIndex, apiPageStartIndex) {
    if (apiPageStartIndex > 0) {
        return Math.trunc(apiResultsStartIndex / apiPageCount) + 1
    }
    return apiResultsStartIndex / apiPageCount
}

function getEndPage(apiResultsEndIndex, apiPageEndIndex) {
    if (apiPageEndIndex > 0) {
        return Math.trunc(apiResultsEndIndex / apiPageCount) + 1
    }
    return apiResultsEndIndex / apiPageCount
}

async function getMovies(uiPage) {
    let result = [];
    let apiPages = getApiPages(uiPage)
    for (const apiPage of apiPages) {
        let response = await fetch(`${baseUrl}/trending/movie/day?api_key=${apiKey}&page=${apiPage.number}`)
            .then(res => res.json())
        let movies = response.results.slice(apiPage.startIndex, apiPage.endIndex)
        for (const movie of movies) {
            result.push(movies)
        }
    }
    return result
}

getMovies(13)
    .then(res => console.log(res.length))