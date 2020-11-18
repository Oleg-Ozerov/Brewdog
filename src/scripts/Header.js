import {Favourites} from "./Favourites.js";

export class Header {
    newHeader;

    constructor() {
        this.parentElement = document.querySelector('.body')
    }

    createHeaderMarkup (favourites) {
        this.newHeader = document.createElement('header');
        this.newHeader.innerHTML = `<p class="header__title">Brewdog beer</p>
                                    <button type="button" class="header__button" disabled>Favourites [${favourites.length}]</button>`;
        this.parentElement.appendChild(this.newHeader);
        this.parentElement.insertBefore(this.newHeader, this.parentElement.firstChild);
        this.newHeader.classList.add('header');
    }

    createHeader (favourites) {
        this.createHeaderMarkup(favourites);

        const headerButton = document.querySelector('.header__button');

        headerButton.addEventListener('click', () => {
            const newFavourites = new Favourites();

            newFavourites.createFavModal();
        })
    };

    removeHeader() {
        this.newHeader.parentNode.removeChild(this.newHeader);
    }

    initialRender (favourites) {
        this.createHeader(favourites);
    }
}


