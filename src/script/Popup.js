export class Popup {
    constructor(popup, openClass, closeButton) {
        this.popup = popup;
        this.openClass = openClass;
        this.closeButton = closeButton;
        this.setEventListener()
    }

    open() {
        this.popup.classList.add(this.openClass);
    }

    close() {
        this.popup.classList.remove(this.openClass);
    }

    setEventListener() {
        this.closeButton.addEventListener('click', () => this.close());
   
    }
}
