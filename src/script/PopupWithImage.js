import {Popup} from "./Popup";

export class PopupWithImage extends Popup {
    constructor(popup, openClass, closeButton) {
        super(popup, openClass, closeButton)//вызываем super с параметрами переданными в конструктор
        this.image = this.popup.querySelector('.picture__image');//ищем изображение
    }

    open(link) {  //расширяем метод open родительского класса
        this.image.src = link;
        super.open();//вызываем у super метод open
    }
}