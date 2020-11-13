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
        this.beerList = document.createElement('section');
        const allBeers = await getBeers();
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

        this.filtredBeers.forEach((beer) => {
            const newCard = new Beer(beer['image_url'], beer.name, beer.description);
            this.beerList.appendChild(newCard.createBeerCard());
        })

        this.beerList.firstChild.setAttribute('id', 'forScroll');
        this.scrollToFirstCard();
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

    initialRender () {
        this.createContainer();
    }

}