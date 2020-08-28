export class CardList {
    constructor(container, createCard) {
        this.container = container;
        this.createCard = createCard;
        this.addCard = this.addCard;
    }

    addCard(placeCard) {
        this.container.appendChild(placeCard);
    }

    render(array) {
        array.forEach(element => {
            const card = this.createCard(element)
            this.addCard(card.create());

        });
    }
}

