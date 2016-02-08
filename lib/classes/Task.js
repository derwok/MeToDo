/**
 * Created by wok on 08.02.16.
 */

class Task {
    constructor(text, star) {
        this._text = text;
        this._star = star;
    }

    print () {
        console.log("Text: "+this._text);
        console.log("Star: "+this._star);
    }
}

this.Task = Task;
