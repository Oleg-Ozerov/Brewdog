import {getSingleBeer} from "./api.js";
import {ESCAPE_KEY} from "./constanses.js";

export class BeerModal {
    beerCard;
    modalWindow;
    escapeListenerBind = this.escapeListener.bind(this);
    modalClickListenerBind = this.modalClickListener.bind(this);

    constructor(newCard) {
        this.card = newCard;
    }

    async createModal () {
        this.beerCard = await getSingleBeer(this.card.id);

        const [ item ] = this.beerCard;

        this.modalWindow = document.createElement('section');
        this.modalWindow.classList.add('favourites');
        this.modalWindow.appendChild(this.card.createBeerCard());

        const description = this.modalWindow.querySelector('.beerList__card-description');

        description.innerText = `${item.description}`;
        this.addWindowListeners();

        return this.modalWindow;
    }

    addWindowListeners () {
        window.addEventListener('click', this.modalClickListenerBind);
        window.addEventListener('keyup', this.escapeListenerBind);
    }

    modalClickListener ({target}) {
        if (target === this.modalWindow) {
            this.removeModal();
            window.removeEventListener('keyup', this.escapeListenerBind);
        }
    }

    escapeListener({code}) {
        if (code === ESCAPE_KEY) {
            this.removeModal();
            window.removeEventListener('keyup', this.escapeListenerBind);
        }
    }

    removeModal () {
        this.modalWindow.parentNode.removeChild(this.modalWindow);
    }

}
