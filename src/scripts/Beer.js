import {changeFavouritesList} from "./main.js";
import {ADD_BUTTON_VALUE, BLUEVIOLET_COLOR, RED_COLOR, REMOVE_BUTTON_VALUE} from "./constanses.js";

export class Beer {
    id;
    photo;
    description;
    title;

    constructor(beer) {
        Object.assign(this, beer);
    }

    createBeerCard() {
        const beerCard = document.createElement('div');

        beerCard.classList.add('beerList__card')
        beerCard.innerHTML = `<img alt="beer" class="beerList__card-photo" src="${this.photo}">
                              <div class="beerList__card-content">
                                <p class="beerList__card-title" id="title${this.id}">${this.title}</p>
                                <p class="beerList__card-description">${this.description.slice(0, 300)}...</p>
                                <button id="button${this.id}" class="beerList__card-button">Add</button>
                              </div>`;
        beerCard.setAttribute('id', `beerCard${this.id}`)

        return beerCard;
    }

    addButtonListener (element) {
        element.addEventListener('click', (event) => {
            this.beerCardButtonHandler(element);
            event.target.dispatchEvent(changeFavouritesList);
        })
    }

    beerCardButtonHandler (element) {
        element.innerText === ADD_BUTTON_VALUE
            ? this.addToFavourites(element)
            : this.removeFromFavourites(element);

        element.innerText === REMOVE_BUTTON_VALUE
            ? element.style.backgroundColor = RED_COLOR
            : element.style.backgroundColor = BLUEVIOLET_COLOR;
    }

    areIdsEqual () {
        return !window.favourites.find(beer => {
            beer.id === this.id;
        })
    }

    addToFavourites (element) {
        if (this.areIdsEqual()) {
            window.favourites = [...window.favourites, this];
            localStorage.setItem('favourites', JSON.stringify(window.favourites));
        }

        element.innerText = REMOVE_BUTTON_VALUE;
    }

    removeFromFavourites (element) {
        window.favourites = window.favourites.filter(beer => !(beer.id === this.id));
        localStorage.setItem('favourites', JSON.stringify(window.favourites));
        element.innerText = ADD_BUTTON_VALUE;
    }
}