const validUsername = /^\w[\w.]{2,18}\w$/
// var re = new RegExp("^\\w[\\w.]{2,18}\\w$");
const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
const validFullname = /^([a-zA-Zà-úÀ-Ú-']+\s)*[a-zA-Zà-úÀ-Ú-']+$/

export { validUsername, validEmail, validFullname }