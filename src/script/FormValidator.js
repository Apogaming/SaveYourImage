export class FormValidator {
    constructor(form, button, errorsText) {
        this.button = button;
        this.form = form;
        this.button = this.form.querySelector('.button');
        this.isFieldValid = this.isFieldValid.bind(this);
        this.isValidate = this.isValidate.bind(this);
        this.checkInputValidity = this.checkInputValidity.bind(this);
        this.setSubmitButtonState = this.setSubmitButtonState.bind(this);
        this.errorsText = errorsText;
        this.setEventListeners()
    }

    checkInputValidity(event) {
        const form = event.target.parentNode;
        const [...inputs] = event.currentTarget.elements;
        this.isFieldValid(event.target);

        if (inputs.every(this.isValidate)) {
            this.setSubmitButtonState(true);
        } else {
            this.setSubmitButtonState(false);
        }
    }
    isFieldValid(input) {
        const errorElem = input.parentNode.querySelector(`#${input.id}-error`);
        const valid = this.isValidate(input);
        errorElem.textContent = input.validationMessage;
        return valid;
    }

    isValidate(input) {
        input.setCustomValidity("");
        if (input.validity.valueMissing) {
            input.setCustomValidity(this.errorsText.empty);
            return false
        }
        if (input.validity.tooShort || input.validity.tooLong) {
            input.setCustomValidity(this.errorsText.wrongLength);
            return false
        }
        if (input.validity.typeMismatch && input.type === 'url') {
            input.setCustomValidity(this.errorsText.wrongUrl);
            return false
        }
        return input.checkValidity();
    }
    setSubmitButtonState(state, button) {
        if (state) {
            this.button.removeAttribute('disabled');
        } else {
            this.button.setAttribute('disabled', true);
        }
    }
    resetError() {
        const errorElement = this.form.querySelectorAll('.error');
        errorElement.forEach((elem) => { elem.textContent = '' })
    }
    setEventListeners() {
        this.form.addEventListener('input', this.checkInputValidity);
    }
}


