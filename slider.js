var Slider = new Class({
    Extends: Widget,

    initialize: function(options) {
        this.value = 0;
        this.handleHeight = 20;
        Widget.prototype.initialize.call(this, options);
    },

    drawCanvas: function(context) {
        context.fillStyle = "#00f";
        context.fillRect(0, 0, this.width(), this.height());
        
        // this.text(2, this.height() / 2 + 5, this.key.slice(0, 5), { 'class': 'label' });

        context.fillStyle = "#f00";
        context.font = "20px Helvetica";
        context.fillText(this.key.slice(0, 5), 2, this.height() - 40, this.width() - 20)
        context.fillRect(0, this.handleY, this.width(), this.handleHeight);
    },

    setValue: function(value) {
        this.value = Math.max(this.min, Math.min(this.max, value));

        var position = 
            (this.height() - this.handleHeight) * 
            ((this.value - this.min) / (this.max - this.min));


        this.handleY = this.height() - this.handleHeight - position;
    },

    handleEvent: function(event) {    
        var value = this.min + ((this.height() - event.localY) / this.height()) * (this.max - this.min);

        value = Math.floor(value / this.step) * this.step;      

        if (value != this.value) {
            this.setValue(value);
            this.instrument.send('/parameter', 'sf', this.key, this.value);
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

var ToggleButton = new Class({
    Extends: Widget,

    initialize: function(options) {
        Widget.prototype.initialize.call(this, options);
        this.active = true;
    },

    draw: function() {
        this.attr('class', 'menu-button');
        this.rect(0, 0, this.width(), this.height(), 0, 0);
        this.text(5, this.height() / 2 + 4, this.label, { 'class': 'label' });
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
