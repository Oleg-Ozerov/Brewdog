const BASE_URL = 'https://api.punkapi.com/v2/beers';

export const getBeers = (name, page) => fetch(`${BASE_URL}?beer_name=${name}&per_page=5&page=${page}`)
    .then(response => response.json());

export const getSingleBeer = (id) => fetch(`${BASE_URL}/${id}`)
    .then(response => response.json());
