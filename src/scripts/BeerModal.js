import {getSingleBeer} from "./api.js";
import {ESCAPE_KEY} from "./constanses.js";

export class BeerModal {
    beerCard;
    modalWindow;

    constructor(newCard) {
        this.card = newCard;
    }

    async createModal () {
        this.beerCard = await getSingleBeer(this.card.id);

        const item = this.beerCard[0];

        this.modalWindow = document.createElement('section');
        this.modalWindow.classList.add('favourites');
        this.modalWindow.appendChild(this.card.createBeerCard());

        const description = this.modalWindow.querySelector('.beerList__card-description');

        description.innerText = `${item.description}`;
        this.addWindowListeners();

        return this.modalWindow;
    }

    addWindowListeners () {
        window.addEventListener('click', (event) => {
            if (event.target === this.modalWindow) {
                this.removeModal();
            }
        })

        window.addEventListener('keyup', (event) => {
            if (event.keyCode === ESCAPE_KEY) {
                this.removeModal();
            }
        })
    }

    removeModal () {
        this.modalWindow.parentNode.removeChild(this.modalWindow);
    }

}
