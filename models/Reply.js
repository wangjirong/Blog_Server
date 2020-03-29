module.exports = class Reply {
    constructor(from_user_id,to_user_id, date, text, adress, brower) {
        this.from_user_id = from_user_id;
        this.to_user_id = to_user_id;
        this.date = date;
        this.text = text;
        this.adress = adress;
        this.brower = brower;
    }
}