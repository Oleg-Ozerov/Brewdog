import { getBeers} from "./api.js";
import { Beer } from "./Beer.js";
import {inputFilterReg, wrongInputValue} from "./constanses.js";

export class BeerList {
    container;
    searchBar;
    recentSearchesBlock;
    inputElement;
    inputValue;
    beerList;
    recentSearches = [];
    filtredBeers;
    loadMoreButton;

    constructor() {
        this.parentElement = document.querySelector('.body');
    }

    createContainer() {
        this.container = document.createElement('main');
        this.container.classList.add('container')
        this.parentElement.appendChild(this.container);
        this.createSearchBar();
        this.createRecentSearchesBlock();
    }

    createSearchBar() {
        this.searchBar = document.createElement('section');
        this.searchBar.classList.add('searchBar');
        this.container.appendChild(this.searchBar)
        this.createInput();
        this.createSearchButton();

    }

    createInput() {
        this.inputElement = document.createElement('input');

        this.inputElement.classList.add('searchBar__input');
        this.inputElement.placeholder = 'Search...'
        this.searchBar.appendChild(this.inputElement);
        this.addInputListeners(this.inputElement);
    }

    addInputListeners (element) {
        element.addEventListener('change', event => {
            this.inputValue = event.target.value;
        })

        element.addEventListener('keyup', (event) => {
            if (event.keyCode === 13 ) {
                this.validateInput(this.inputElement)
                if(this.inputElement.classList.contains(wrongInputValue)) {
                    return;
                }
                this.removeBeerList();
                this.createBeerList();
            }
        })
    }

    validateInput (inputElement) {
        !inputFilterReg.test(this.inputValue)
            ? inputElement.classList.add(wrongInputValue)
            : inputElement.classList.remove(wrongInputValue);

    }

    createSearchButton () {
        const newSearchButton = document.createElement('button');

        newSearchButton.classList.add('searchBar__button')
        this.searchBar.appendChild(newSearchButton);
        this.addSearchButtonListeners(newSearchButton);

    }

    addSearchButtonListeners(element) {
        element.addEventListener('click', () => {
            this.validateInput(this.inputElement)
            if(this.inputElement.classList.contains(wrongInputValue)) {
                return;
            }
            this.removeBeerList();
            this.createBeerList();
        })
    }

    createRecentSearchesBlock () {
        this.recentSearchesBlock = document.createElement('section');
        this.recentSearchesBlock.classList.add('recentSearches');
        this.recentSearchesBlock.innerHTML = `<p class="recentSearches__title">Recent searches:</p>`;
        this.container.appendChild(this.recentSearchesBlock);
        this.createRecentSearchesList();
    }

    createRecentSearchesList () {
        const searchList = document.createElement('ul');

        this.recentSearches.forEach(el => {
            const newItem = document.createElement('li');

            newItem.innerText = el;
            searchList.appendChild(newItem);
        })
        searchList.classList.add('recentSearches__list');
        this.recentSearchesBlock.appendChild(searchList);
    }

    removeRecentSearchesBlock () {
        if (this.recentSearchesBlock) {
            const oldBlock = document.querySelector('.recentSearches');

            oldBlock.parentNode.removeChild(oldBlock);
        }
    }

    async createBeerList () {
        const allBeers = await getBeers();
        let counter = 0;

        this.beerList = document.createElement('section');
        this.filtredBeers = allBeers.filter(beer => beer.name.toLowerCase().includes(this.inputValue.toLocaleLowerCase()));

        if (this.filtredBeers.length === 0 ) {
            this.addError(this.beerList);
        } else {
            this.recentSearches = [this.inputValue, ...this.recentSearches];
            this.removeRecentSearchesBlock();
            this.createRecentSearchesBlock();
        }

        this.beerList.classList.add('beerList');
        this.container.appendChild(this.beerList);
        this.firstBeerListRender();


    }

    firstBeerListRender () {
        this.filtredBeers.slice(0, 5).forEach((beer) => {
            const newCard = new Beer(beer['image_url'], beer.name, beer.description);

            this.beerList.appendChild(newCard.createBeerCard());
        })
        this.createLoadMoreButton();
        this.createScrollButton();
        this.beerList.firstChild.setAttribute('id', 'forScroll');
        this.scrollToFirstCard();
    }

    loadMoreItems () {
        while (this.beerList.hasChildNodes()) {
            this.beerList.removeChild(this.beerList.firstChild);
        }

        this.filtredBeers.forEach((beer) => {
            const newCard = new Beer(beer['image_url'], beer.name, beer.description);

            this.beerList.appendChild(newCard.createBeerCard());
        })
        this.beerList.firstChild.setAttribute('id', 'forScroll');

        this.createScrollButton();
    }

    addError (el) {
        const error = document.createElement('p');

        error.innerText = 'There were no properties found for the given location.';
        el.appendChild(error);
    }

    scrollToFirstCard () {
        document.querySelector('#forScroll').scrollIntoView({behavior: "smooth"});
    }

    removeBeerList () {
        if (this.beerList) {
            const oldList = document.querySelector('.beerList')

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
        element.addEventListener('click', () => {
            element.style.display = 'none';
            this.filtredBeers.length < 6 ? this.noMoreItemsMessege() : this.loadMoreItems();
        })
    }

    createScrollButton () {
        const scrollButton = document.createElement('div');

        scrollButton.innerText = '🠕';
        scrollButton.classList.add('beerList__scrollButton');
        scrollButton.addEventListener('click', () => {
            this.scrollToFirstCard();
        })

        this.beerList.appendChild(scrollButton);
    }

    noMoreItemsMessege () {
        const warningMessege = document.createElement('div');

        warningMessege.classList.add('beerList__warning')
        warningMessege.innerText = 'There were no properties found for the given beer.';
        this.beerList.appendChild(warningMessege);
    }

    initialRender () {
        this.createContainer();
    }

}