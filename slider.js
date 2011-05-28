var Slider = new Class({
    Extends: Widget,

    initialize: function(options) {
        this._value = 0;
        this.handleSize = 20;
        this.handlePos = 0;
        this.min = 0;
        this.max = 1;
        this.label = "";

        Widget.prototype.initialize.call(this, options);
    },

    drawCanvas: function(context) {
        var position = (this.height - this.handleSize) * 
                ((this._value - this.min) / (this.max - this.min));
        this.handlePos = this.height - this.handleSize - position;        
        context.fillStyle = "#00f";
        context.fillRect(0, 0, this.width, this.height);
        context.fillStyle = "#f00";
        context.font = "20px Helvetica";
        context.fillText(this.label, 2, this.height - 40, this.width - 20)
        context.fillRect(0, this.handlePos, this.width, this.handleSize);
    },

    value: function(value) {
        if (value === undefined) {
            return this._value;
        }
        else {
            this._value = Math.max(this.min, Math.min(this.max, value));
        }
    },

    handleEvent: function(event) {    
        var value = this.min + ((this.height - event.localY) / this.height) * (this.max - this.min);

        if (value != this._value) {
            this.value(value);
            this.fireEvent("change", this._value);
        }
    },

    onTouchDown: function(event) {
        this.handleEvent(event);
        return true;
    },

    onTouchMove: function(event) {
        this.handleEvent(event);
        return true;
    }
});

var VolumeSlider = new Class({
    Extends: Slider,

    initialize: function(options) {
        this.levelValue = 0;

        Slider.prototype.initialize.call(this, options);
        console.log("Vol INIT")
    },

    drawCanvas: function(context) {
        Slider.prototype.drawCanvas.call(this, context);   
        context.fillStyle = "rgba(255,255,255,0.5)";
        context.fillRect(0, this.height, this.width, (this.height * this.levelValue)*-1);
         
    }
});

var ToggleButton = new Class({
    Extends: Widget,

    initialize: function(options) {
        Widget.prototype.initialize.call(this, options);
        this.active = true;
    },

    draw: function() {
        this.attr('class', 'menu-button');
        this.rect(0, 0, this.width, this.height, 0, 0);
        this.text(5, this.height / 2 + 4, this.label, { 'class': 'label' });
    },

    toggle: function() {
        this.active = !this.active;
        this.callback(this);
    },

    onTouchDown: function(event) {
        this.toggle();
        return true;
    }
});
