export class BeerList {
    container;
    searchBar;
    recentSearchesBlock;

    constructor() {
        this.parentElement = document.querySelector('.body');
    }

    createContainer() {
        this.container = document.createElement('main');
        this.container.classList.add('container')
        this.parentElement.appendChild(this.container);
        this.createSearchBar();
    }

    createSearchBar() {
        this.searchBar = document.createElement('section');
        this.searchBar.classList.add('searchBar');
        this.container.appendChild(this.searchBar)
        this.createInput();
        this.createSearchButton();

    }

    createInput() {
        const newInput = document.createElement('input');

        newInput.classList.add('searchBar__input');
        newInput.placeholder = 'Search...'
        this.searchBar.appendChild(newInput);
    }

    createSearchButton () {
        const newSearchButton = document.createElement('button');

        newSearchButton.classList.add('searchBar__button')
        this.searchBar.appendChild(newSearchButton);
        this.createRecentSearchesBlock();
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

        searchList.classList.add('recentSearches__list');
        this.recentSearchesBlock.appendChild(searchList);
    }



    initialRender () {
        this.createContainer();
    }

}