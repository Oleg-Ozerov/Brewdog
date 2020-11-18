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

function setFavourites () {
    if (localStorage.getItem('favourites')) {
        const localItems = JSON.parse(localStorage.getItem('favourites'));

        window.favourites = localItems.map(item => {
            const itemWithClass = new Beer({
                id: item.id,
                photo: item.photo,
                title: item.title,
                description: item.description
            })

            return itemWithClass;
        })
    } else window.favourites = [];
}

function favouritesButtonToggler () {
    if (window.favourites.length === 0) {
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

    if (window.favourites.length > 0) {
        const headerButton = document.querySelector('.header__button');

        headerButton.removeAttribute('disabled');
    }
})