import { Header } from "./Header.js";
import { BeerList } from "./BeerList.js";
import {Beer} from "./Beer.js";

export const changeFavouritesList = new Event('changeFav', {bubbles: true});

let header;

window.addEventListener('load', () => {
    setFavourites();
    createHeader();
    favouritesButtonToggler();
    createBearList();
})

function createItemsWithClass () {
    const localItems = JSON.parse(localStorage.getItem('favourites'));

    window.favourites = localItems.map(({ id, photo, title, description }) => {
        return new Beer({
            id,
            photo,
            title,
            description,
        })
    })
}

function setFavourites () {
    localStorage.getItem('favourites')
        ? createItemsWithClass()
        : window.favourites = [];
}

function favouritesButtonToggler () {
    if (!window.favourites.length) {
        const headerButton = document.querySelector('.header__button');

        headerButton.setAttribute('disabled', 'disabled');
    }
}

function createHeader() {
    header = new Header();

    header.initialRender(window.favourites);
}

function createBearList() {
    const newBearList = new BeerList();

    if (localStorage.getItem('recentSearches')) {
        newBearList.recentSearches = [...JSON.parse(localStorage.getItem('recentSearches'))];
    }

    newBearList.initialRender();

}

document.addEventListener('changeFav', () => {
    header.removeHeader();
    createHeader();

    if (window.favourites.length) {
        const headerButton = document.querySelector('.header__button');

        headerButton.removeAttribute('disabled');
    }
})