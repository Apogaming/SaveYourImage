export class UserInfo {
    constructor(api, userInfoName, userInfoJob, userPhoto) {
        this.api = api;
        this.userInfoName = userInfoName;
        this.userInfoJob = userInfoJob;
        this.userPhoto = userPhoto
    }

    setUserInfo (userData) {
        this.name = userData.name;
        this.about = userData.about;
        this.photo = userData.avatar;
        this.updateUserInfo()
    }
    updateUserInfo () {
        this.userInfoName.textContent = this.name;
        this.userInfoJob.textContent = this.about;
        this.userPhoto.style.backgroundImage = `url(${this.photo})`
    }

}
