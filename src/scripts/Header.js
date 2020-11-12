export class Header {
    constructor() {
        this.parentElement = document.querySelector('.body')
    }

    createHeader () {
        const newHeader = document.createElement('header');
        newHeader.innerHTML = `<p class="header__title">Brewdog beer</p>
                               <button type="button" class="header__button">Favourites</button>`;
        this.parentElement.appendChild(newHeader);
        newHeader.classList.add('header');
    };



    initialRender () {
        this.createHeader();
    }
}