import { getBeers } from "./api.js";
import { Beer } from "./Beer.js";
import {
    BLUEVIOLET_COLOR,
    ENTER_KEY,
    INPUT_FILTER_REG,
    RECENT_SEARCHES,
    RED_COLOR, REMOVE_BUTTON_VALUE, SCROLL_ID,
    WRONG_INPUT_VALUE
} from "./constanses.js";
import {BeerModal} from "./BeerModal.js";

export class BeerList {
    container;
    searchBar;
    recentSearchesBlock;
    inputElement;
    inputValue;
    beerList;
    recentSearches = [];
    loadMoreButton;
    allBeers;
    oldList;
    page = 1;

    constructor() {
        this.parentElement = document.querySelector('.body');
    }

    createContainer() {
        this.container = document.createElement('main');
        this.container.classList.add('container');
        this.parentElement.appendChild(this.container);
        this.createSearchBar();
        this.createRecentSearchesBlock();
    }

    createSearchBar() {
        this.searchBar = document.createElement('section');
        this.searchBar.classList.add('searchBar');
        this.container.appendChild(this.searchBar);
        this.createInput();
        this.createSearchButton();
    }

    createInput() {
        this.inputElement = document.createElement('input');
        this.inputElement.classList.add('searchBar__input');
        this.inputElement.placeholder = 'Search...';
        this.searchBar.appendChild(this.inputElement);
        this.addInputListeners(this.inputElement);
    }

    addInputListeners (element) {
        element.addEventListener('change', ({ target: { value } }) => {
            this.inputValue = value;
            this.page = 1;
        });

        element.addEventListener('keyup', ({ code }) => {
            if (code === ENTER_KEY) {
                this.beerListCreator();
            }
        })
    }

    isInputHasClass (name) {
        return this.inputElement.classList.contains(name);
    }

    validateInput (inputElement) {
        !INPUT_FILTER_REG.test(this.inputValue)
            ? inputElement.classList.add(WRONG_INPUT_VALUE)
            : inputElement.classList.remove(WRONG_INPUT_VALUE);
    }

    createSearchButton () {
        const newSearchButton = document.createElement('button');

        newSearchButton.classList.add('searchBar__button');
        this.searchBar.appendChild(newSearchButton);
        this.addSearchButtonListeners(newSearchButton);
    }

    beerListCreator () {
        this.validateInput(this.inputElement);

        if (!this.isInputHasClass(WRONG_INPUT_VALUE)) {
            this.removeBeerList();
            this.createBeerList();
        }
    }

    addSearchButtonListeners(element) {
        element.addEventListener('click', () => {
            this.page = 1;
            this.beerListCreator();
        })
    }

    createRecentSearchesBlock () {
        this.recentSearchesBlock = document.createElement('section');
        this.recentSearchesBlock.classList.add(RECENT_SEARCHES);
        this.recentSearchesBlock.innerHTML = `<p class="${RECENT_SEARCHES}__title">Recent searches:</p>`;
        this.container.appendChild(this.recentSearchesBlock);
        this.createRecentSearchesList();
    }

    createRecentSearchesList () {
        const searchList = document.createElement('ul');

        this.recentSearches.forEach(searchItem => {
            this.createSearchList(searchItem, searchList);
        });
        searchList.classList.add(`${RECENT_SEARCHES}__list`);
        this.recentSearchesBlock.appendChild(searchList);
    }

    createSearchList (searchItem, searchList) {
        const newItem = document.createElement('li');

        newItem.classList.add(`${RECENT_SEARCHES}__list-item`);
        newItem.innerText = searchItem;
        newItem.addEventListener('click', () => {
            this.page = 1;
            this.inputValue = searchItem;
            this.inputElement.value = searchItem;
        });
        this.addSearchButtonListeners(newItem);
        searchList.appendChild(newItem);
    }

    removeRecentSearchesBlock () {
        if (this.recentSearchesBlock) {
            const oldBlock = document.querySelector(`.${RECENT_SEARCHES}`);

            oldBlock.parentNode.removeChild(oldBlock);
        }
    }

    rescentSearchesBlockRender() {
        if (!this.allBeers.length) {
            this.addError(this.beerList);
        } else {
            this.recentSearches = this.recentSearches.filter( item => item !== this.inputValue);
            this.recentSearches = [this.inputValue, ...this.recentSearches];
            localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
            this.removeRecentSearchesBlock();
            this.createRecentSearchesBlock();
        }
    }

    async createBeerList () {
        this.allBeers = await getBeers(this.inputValue, this.page);
        this.beerList = document.createElement('section');
        this.rescentSearchesBlockRender();
        this.beerList.classList.add('beerList');
        this.container.appendChild(this.beerList);
        this.firstBeerListRender();
    }

    isItemAlreadyInFavourites (newCard) {
        return window.favourites.find(item => item.id === newCard.id)
    }

    addListenersOnCard(newCard) {
        const button = document.querySelector(`#button${newCard.id}`);

        if (this.isItemAlreadyInFavourites(newCard)) {
            button.innerText = REMOVE_BUTTON_VALUE;
            button.style.backgroundColor = RED_COLOR;
        }

        newCard.addButtonListener(button);

        const cardTitle = document.querySelector(`#title${newCard.id}`);

        cardTitle.addEventListener('click',async () => {
            await this.createSingleBearModal(newCard, button);
        })
    }

    async createSingleBearModal (newCard, button) {
        const singleBeerModal = new BeerModal(newCard);
        const markup = await singleBeerModal.createModal();

        this.parentElement.appendChild(markup);

        const modalButton = markup.querySelector(`#button${newCard.id}`);

        modalButton.innerText = button.innerText;
        modalButton.style.backgroundColor = button.style.backgroundColor;
        singleBeerModal.card.addButtonListener(modalButton);

        modalButton.addEventListener('click', () => {
            button.innerText = modalButton.innerText;
            button.style.backgroundColor === RED_COLOR
                ? button.style.backgroundColor = BLUEVIOLET_COLOR
                : button.style.backgroundColor = RED_COLOR;
        })
    }

    createBeerCardForEach () {
        this.allBeers.forEach((beer) => {
            const newCard = new Beer({
                id : beer.id,
                photo: beer['image_url'],
                title: beer.name,
                description: beer.description
            });

            this.beerList.appendChild(newCard.createBeerCard());
            this.addListenersOnCard(newCard);
        })
    }

    firstBeerListRender () {
        this.createBeerCardForEach();

        if (this.allBeers.length) {
            this.createLoadMoreButton();
            this.createScrollButton();
            this.beerList.firstChild.setAttribute('id', SCROLL_ID);
            this.scrollToFirstCard();
        }

        this.page++;
    }

    async loadMoreItems () {
        this.allBeers = await getBeers(this.inputValue, this.page);
        this.createBeerCardForEach();

        if (this.allBeers.length === this.oldList.length) {
            this.createLoadMoreButton();
        }

        this.createScrollButton();
        this.page++;
    }

    addError (domElement) {
        const error = document.createElement('p');

        error.innerText = 'There were no properties found for the given location.';
        domElement.appendChild(error);
    }

    scrollToFirstCard () {
        document.querySelector(`#${SCROLL_ID}`).scrollIntoView({behavior: "smooth"});
    }

    removeBeerList () {
        if (this.beerList) {
            const oldList = document.querySelector('.beerList');

            oldList.parentNode.removeChild(oldList);
        }
    }

    createLoadMoreButton () {
        this.loadMoreButton = document.createElement('button');
        this.loadMoreButton.innerText = 'Load more';
        this.loadMoreButton.classList.add('beerList__button');
        this.addButtonListener(this.loadMoreButton);
        this.beerList.appendChild(this.loadMoreButton);
    }

    addButtonListener (element) {
        element.addEventListener('click', async () => {
            this.oldList = this.allBeers;

            element.style.display = 'none';
            await this.loadMoreItems();

            if (this.allBeers.length !== this.oldList.length) {
                this.noMoreItemsMessege();
            }
        })
    }

    createScrollButton () {
        const scrollButton = document.createElement('div');

        scrollButton.innerText = '🠕';
        scrollButton.classList.add('beerList__scrollButton');
        scrollButton.addEventListener('click', () => {
            this.scrollToFirstCard();
        });
        this.beerList.appendChild(scrollButton);
    }

    noMoreItemsMessege () {
        const warningMessege = document.createElement('div');

        warningMessege.classList.add('beerList__warning');
        warningMessege.innerText = 'There were no properties found for the given beer.';
        this.beerList.appendChild(warningMessege);
    }

    initialRender () {
        this.createContainer();
    }

}
