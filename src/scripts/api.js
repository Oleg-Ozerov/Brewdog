const BASE_URL = 'https://api.punkapi.com/v2/beers';

export const getBeers = () => fetch(BASE_URL)
    .then(response => response.json());
