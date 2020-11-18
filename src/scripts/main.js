import { Header } from "./Header.js";
import { BeerList } from "./BeerList.js";

window.favourites = [];

export const changeFavouritesList = new Event('changeFav', {bubbles: true});

let header;

window.addEventListener('load', () => {
    createHeader();
    createBearList();
})


function createHeader() {
    header = new Header();

    header.initialRender(window.favourites);
}

function createBearList() {
    const newBearList = new BeerList();

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