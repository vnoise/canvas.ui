var Button = new Class({
    Extends: Widget,

    initialize: function(options) {
        this._state = false;
        this.label = "None";

        Widget.prototype.initialize.call(this, options);
    },
    
    state: function(state) {
        if (state === undefined) {
            return this._state;
        }
        else {
            this._state = state;
        }
    },

    drawCanvas: function(context) {
        if (this._state == false){
            context.fillStyle = this.bgColor;
        }else{
            context.fillStyle = this.frontColor;
        }
        context.fillRect(0, 0, this.width(), this.height());
        context.fillStyle = this.labelColor;
        context.font = "20px Helvetica";
        context.fillText(this.label, 2, this.height() - 40, this.width() - 20);
    },

    onTouchDown: function(event) {
        this._state = ! this._state; 
        this.fireEvent("click", this._state);
        return true;
    }
});
