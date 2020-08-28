export class Card {

  constructor(cardData, openImageCallback, api) {
    this.cardData = cardData;
    this.remove = this.remove.bind(this);
    this.openPicture = this.openPicture.bind(this);
    this.openImageCallback = openImageCallback;
    this.api = api;
  }

  like = (event) => {
    this.api.likeCardsServer(this.cardData._id)
      .then((res) => {
        event.target.classList.add('place-card__like-icon_liked');
        this.placeCard.querySelector('.place-card__like-count').textContent = res.likes.length;
      })
      .then(() => {
        this.placeCard.querySelector('.place-card__like-icon').removeEventListener('click', this.like);
        this.placeCard.querySelector('.place-card__like-icon').addEventListener('click', this.unlike);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  unlike = (event) => {
    this.api.unlikeCardsServer(this.cardData._id)
      .then((res) => {
        event.target.classList.remove('place-card__like-icon_liked');
        this.placeCard.querySelector('.place-card__like-count').textContent = res.likes.length;
      })
      .then(() => {
        this.placeCard.querySelector('.place-card__like-icon').removeEventListener('click', this.unlike);
        this.placeCard.querySelector('.place-card__like-icon').addEventListener('click', this.like);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  remove(event) {
    event.stopPropagation()
    if (confirm('Вы действительно хотите удалить эту карточку?')) {
      this.api.deleteCardFromServer(this.cardData._id)
        .then(() => {
          event.target.closest('.place-card').remove()
          this.removeEventListener()
        })
        .catch((err) => {
          console.log(err);
        });
    }

  }

  openPicture() {
    this.openImageCallback(this.cardData.link);
  }

  create() {
    const template = document.createElement("div");
    template.insertAdjacentHTML('beforeend', `
    <div class="place-card">
        <div class="place-card__image"
         data-url=""
          style="background-image: url()">
          <button class="place-card__delete-icon"></button>
        </div>
        <div class="place-card__description">
          <h3 class="place-card__name"></h3>
          <div class="place-card__like-container">
          <button class="place-card__like-icon"></button>
          <p class="place-card__like-count">0</p>
        </div>
        </div>
    </div>`);
    const placeCard = template.firstElementChild;
    placeCard.querySelector(".place-card__name").textContent = this.cardData.name;
    placeCard.querySelector(".place-card__image").style.backgroundImage = `url(${this.cardData.link})`;
    placeCard.querySelector(".place-card__image").dataset.url = this.cardData.link;
    placeCard.querySelector('.place-card__like-count').textContent = this.cardData.likes.length;
    this.placeCard = placeCard;
    this.setEventListener();
    if (this.cardData.userId === this.cardData.owner._id) {
      this.placeCard.querySelector('.place-card__delete-icon').setAttribute('style', 'display:block')
    }

    this.cardData.likes.forEach((element) => {
      if (this.cardData.userId === element._id) {
        this.placeCard.querySelector('.place-card__like-icon').classList.add('place-card__like-icon_liked');
        this.placeCard.querySelector('.place-card__like-icon').addEventListener('click', this.unlike);
        this.placeCard.querySelector('.place-card__like-icon').removeEventListener('click', this.like);
      }
    })
    return placeCard;
  }
  setEventListener() {
    this.placeCard.querySelector(".place-card__like-icon").addEventListener('click', this.like);
    this.placeCard.querySelector(".place-card__delete-icon").addEventListener('click', this.remove);
    this.placeCard.querySelector(".place-card__image").addEventListener('click', this.openPicture);
  }
  removeEventListener() {
    this.placeCard.querySelector(".place-card__like-icon").removeEventListener('click', this.like);
    this.placeCard.querySelector(".place-card__delete-icon").removeEventListener('click', this.remove);
    this.placeCard.querySelector(".place-card__image").removeEventListener('click', this.openPicture);
  }
}