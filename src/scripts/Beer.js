export class Beer {
    constructor(photo, title, description) {
        this.photo = photo;
        this.title = title;
        this.description = description;
    }

    createBeerCard() {
        const beerCard = document.createElement('div');

        beerCard.classList.add('beerList__card')
        beerCard.innerHTML = `<img class="beerList__card-photo" src="${this.photo}">
                              <div class="beerList__card-content">
                                <p class="beerList__card-title">${this.title}</p>
                                <p class="beerList__card-description">${this.description}</p>
                              </div>`;

        return beerCard;
    }

}