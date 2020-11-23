import {changeFavouritesList} from "./main.js";
import {ADD_BUTTON_VALUE, BLUEVIOLET_COLOR, ESCAPE_KEY, RED_COLOR, REMOVE_BUTTON_VALUE} from "./constanses.js";

export class Favourites {
    modalWindow;
    escapeListenerBind = this.escapeListener.bind(this);
    modalCLickListenerBind = this.modalClickListener.bind(this);

    constructor() {
        this.parentElement = document.querySelector('.body');
    }

    createMarkup() {
        this.modalWindow  = document.createElement('section');
        this.modalWindow.innerHTML = `<h3 class="favourites__header">Favourites</h3>
                              <ul class="favourites__list">
                              </ul>`;
        this.modalWindow.classList.add('favourites');
        this.parentElement.appendChild(this.modalWindow);
    }

    filterFavourites (target) {
        window.favourites = window.favourites.filter(element => `button${element.id}` !== target.id);
    }

    buttonSetup (beerList, beerCard) {
        const button = beerList.querySelector(`#button${beerCard.id}`);

        button.innerText = REMOVE_BUTTON_VALUE;
        button.style.backgroundColor = RED_COLOR;
        button.addEventListener('click', ({ target }) => {
            this.filterFavourites(target);
            localStorage.setItem('favourites', JSON.stringify(window.favourites));
            target.dispatchEvent(changeFavouritesList);
            this.refreshModal();
            this.mainListButtonToggler(beerCard);
        })
    }

    refreshModal() {
        if (this.modalWindow) {
            this.removeFavModal();
        }

        this.createFavModal();
    }

    mainListButtonToggler (beerCard) {
        const mainListButton = document.querySelector(`#button${beerCard.id}`);

        if (mainListButton) {
            mainListButton.innerText = ADD_BUTTON_VALUE;
            mainListButton.style.backgroundColor = BLUEVIOLET_COLOR;
        }
    }

    createList() {
        const beerList = document.querySelector('.favourites__list');

        window.favourites.forEach(beerCard => {
            beerList.appendChild(beerCard.createBeerCard());
            this.buttonSetup(beerList, beerCard);
        })
    }

    createFavModal () {
        this.createMarkup();
        this.createList();
        this.addModalClosers();
    }

    removeFavModal () {
        this.modalWindow.parentNode.removeChild(this.modalWindow);
    }

    addModalClosers () {
        window.addEventListener('click', this.modalCLickListenerBind );
        window.addEventListener('keyup', this.escapeListenerBind);
    }

    modalClickListener({target}) {
        if (target === this.modalWindow) {
            this.removeFavModal();
            window.removeEventListener('keyup', this.escapeListenerBind)
        }
    }


    escapeListener({code}) {
        if (code === ESCAPE_KEY) {
            this.removeFavModal();
            window.removeEventListener('keyup', this.escapeListenerBind)
        }
    }
}

