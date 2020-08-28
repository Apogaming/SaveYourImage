import './pages/index.css' ;
import {Api} from './script/Api';
import {Card} from './script/Card';
import {CardList} from './script/CardList';
import {FormValidator} from './script/FormValidator';
import {Popup} from './script/Popup';
import {PopupWithImage} from './script/PopupWithImage';
import {UserInfo} from './script/UserInfo';


(function () {

    const placesList = document.querySelector('.places-list');
  
    const formAddCard = document.querySelector('.popup__form');
    const formEditProfile = document.querySelector('.edit-profile__form');
    const formEditPhoto = document.querySelector('.edit-photo__form');
  
    const userInfoButton = document.querySelector('.user-info__button');
    const editInfoButton = document.querySelector('.edit-info__button');
    const openPhotoButton = document.querySelector('.user-info__photo');
  
    const popupButton = document.querySelector('.popup__button');
    const editProfileButton = document.querySelector('.edit-profile__button');
    const editPhotoButton = document.querySelector('.edit-photo__button');
  
    const editPhotoInput = document.querySelector('.edit-photo__input')
  
    const userInfoName = document.querySelector('.user-info__name');
    const userInfoJob = document.querySelector('.user-info__job');
    const userPhoto = document.querySelector('.user-info__photo');
  
    const editProfileInputTypeName = document.querySelector('.edit-profile__input_type_name');
    const editProfileInputTypeAbout = document.querySelector('.edit-profile__input_type_about');
  
    const name = document.querySelector('.popup__input_type_name');
    const link = document.querySelector('.popup__input_type_link-url');
  
    const popupClose = document.querySelector('.popup__close');
    const popup = document.querySelector('.popup');
  
    const editProfileClose = document.querySelector('.edit-profile__close');
    const editProfile = document.querySelector('.edit-profile');
  
    const editPhotoClose = document.querySelector('.edit-photo__close');
    const editPhoto = document.querySelector('.edit-photo');
  
    const errorMessages = {
      empty: 'Это обязательное поле',
      wrongLength: 'Должно быть от 2 до 30 символов',
      wrongUrl: 'Здесь должна быть ссылка',
      wrongPattern: 'Введите данные в верном формате',
    }
    const new_URL = NODE_ENV === 'production' ? 'https://praktikum.tk' : 'http://praktikum.tk';
    const config = {
      url: `${new_URL}/cohort12`,
      headers: {
        authorization: 'cacf7a18-bc6a-41db-9acc-f6413a098b5c',
        'Content-Type': 'application/json',
      }
    }
    const api = new Api(config);
    const picture = document.querySelector('.picture');
    const pictureClose = document.querySelector('.picture__close');
  
    const user = new UserInfo(api, userInfoName, userInfoJob, userPhoto);
  
    const formAddCardValidator = new FormValidator(formAddCard, userInfoButton, errorMessages);
    const formEditProfileValidator = new FormValidator(formEditProfile, editProfileButton, errorMessages);
    const formEditPhotoValidator = new FormValidator(formEditPhoto, editPhotoButton, errorMessages)
  
    const createCard = (cardData) => new Card(cardData, openImagePopup, api)
    const cardList = new CardList(placesList, createCard);
  
    const popupPicture = new PopupWithImage(picture, 'picture_is-opened', pictureClose);
  
    function openImagePopup(urlImage) {
      popupPicture.open(urlImage);
    }
  
    const popupAdd = new Popup(popup, 'popup_is-opened', popupClose);
    const popupEdit = new Popup(editProfile, 'edit-profile_is-opened', editProfileClose);
    const popupPhoto = new Popup(editPhoto, 'edit-photo_is-opened', editPhotoClose);
  
    function getInitialData() {
      Promise.all([
        api.getServerInfoUser(),
        api.getServerInitialCards()
      ]).then((values) => {
        const [userData, initialCards] = values;
        user.setUserInfo(userData)
        const cardsByUserId = initialCards;
        cardsByUserId.forEach(element => element.userId = userData._id)
        cardList.render(cardsByUserId);
      })
        .catch((err) => {
          console.log(err)
        })
    };
  
    function renderLoading(isLoading, button) {
      if (isLoading) {
        button.textContent = 'Загрузка...'
      } else {
        button.textContent = 'Сохранить'
      }
    }
    //Card
    function addNewCard(event) {
      event.preventDefault();
      renderLoading(true, popupButton);
      api.sendNewCardToServer(name.value, link.value)
        .then((obj) => {
          const objCard = obj;
          objCard.userId = obj.owner._id;
          const card = createCard(objCard);
          cardList.addCard(card.create());
          popupAdd.close();
          formAddCard.reset()
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          renderLoading(false, popupButton);
        })
    }
    //user
    function changeProfile(event) {
      event.preventDefault()
      renderLoading(true, editProfileButton)
      api.updateServerInfoUser(editProfileInputTypeName.value, editProfileInputTypeAbout.value)
        .then((res) => {
          user.setUserInfo(res)
          popupEdit.close();
          formEditProfile.reset()
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          renderLoading(false, editProfileButton);
        })
    }
  
    function changeProfilePhoto(event) {
      event.preventDefault()
      renderLoading(true, editPhotoButton)
      api.changeProfilePhoto(editPhotoInput.value)
        .then((res) => {
          user.setUserInfo(res)
          popupPhoto.close()
          formEditPhoto.reset()
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          renderLoading(false, editPhotoButton);
        })
    }
    function openEditForm() {
      formAddCardValidator.setSubmitButtonState(false);
      formAddCardValidator.resetError();
      popupAdd.open();
      formAddCard.reset();
    }
  
    function openUserForm() {
      editProfileInputTypeName.value = userInfoName.textContent;
      editProfileInputTypeAbout.value = userInfoJob.textContent;
      formAddCardValidator.setSubmitButtonState(true);
      formEditProfileValidator.resetError();
      popupEdit.open();
    }
  
    function openPhotoForm() {
      formEditPhotoValidator.setSubmitButtonState();
      formEditPhotoValidator.resetError();
      popupPhoto.open();
      formEditPhoto.reset();
    }
  
    formAddCard.addEventListener('submit', addNewCard);
    formEditProfile.addEventListener('submit', changeProfile);
    formEditPhoto.addEventListener('submit', changeProfilePhoto);
  
  
    userInfoButton.addEventListener('click', openEditForm);
    editInfoButton.addEventListener('click', openUserForm);
    openPhotoButton.addEventListener('click', openPhotoForm);
  
    getInitialData()
  
  })();