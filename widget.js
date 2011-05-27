var WidgetId = 1;

var Widget = new Class({

    Implements: Events,

    initialize: function(options) {
        this.children = [];
        this.id = WidgetId++;
        this._x = 0;
        this._y = 0;
        this._width = 0;
        this._height = 0;

        this.marginTop = 0;
        this.marginBottom = 0;
        this.marginLeft = 0;
        this.marginRight = 0;

        this.sizeHint = 1; 
        this.set(options);
    },

    on: function(event, callback) {
        if (callback) {
            this.addEvent(event, callback);
        }
        else {
            for (var name in event) {
                this.addEvent(name, event[name]);               
            }
        }
    },

    x: function(value) {
        if (value === undefined) {
            return this._x;
        }
        else {
            this._x = value;
        }
    },

    y: function(value) {
        if (value === undefined) {
            return this._y;
        }
        else {
            this._y = value;
        }
    },

    width: function(value) {
        if (value === undefined) {
            return this._width;
        }
        else {
            this._width = value;
        }
    },

    height: function(value) {
        if (value === undefined) {
            return this._height;
        }
        else {
            this._height = value;
        }
    },

    onTouchDown: function(event) {
        return false;
    },

    onTouchMove: function(event) {
        return false;
    },

    onTouchUp: function(event) {
        return false;
    },

    doLayout: function() {
        switch (this.layout) {
        case 'horizontal': 
            this.doHorizontalLayout();
            break;
        case 'vertical': 
            this.doVerticalLayout();
            break;
        }

        this.children.each(function(child) {
            child.doLayout();
        });
    },

    sumSizeHints: function() {
        var size = 0;

        this.children.each(function(child) {
            size += child.sizeHint;
        });

        return size;
    },

    sumVerticalMargins: function() {
        var margin = 0;

        this.children.each(function(child) {
            margin += child.marginTop + child.marginBottom;
        });

        return margin;
    },

    sumHorizontalMargins: function() {
        var margin = 0;

        this.children.each(function(child) {
            margin += child.marginLeft + child.marginRight;
        });

        return margin;
    },

    doHorizontalLayout: function() {
        var x = 0;
        var y = 0;
        var width = 0;
        var w = (this.width() - this.sumHorizontalMargins()) / this.sumSizeHints();
        var h = this.height();

        this.children.each(function(child) {
            x += child.marginLeft;
            child.extent(x, y, w * child.sizeHint, h);
            x += child.width();
            x += child.marginRight;
        });
    },

    doVerticalLayout: function() {
        var x = 0;
        var y = 0;
        var w = this.width();
        var h = (this.height() - this.sumVerticalMargins()) / this.sumSizeHints();

        this.children.each(function(child) {
            y += child.marginTop;
            child.extent(x, y, w, h * child.sizeHint);
            y += child.height();
            y += child.marginBottom;
        });
    },

    drawCanvas: function(context) {
    },

    draw: function(context) {
        context.save();
        context.translate(this.x(), this.y());

        this.drawCanvas(context);
        this.children.each(function(child) {
            child.draw(context);
        });

        context.restore();
    },

    drawChildren: function(context) {
    },

    redraw: function() {
        this.clear();
        this.draw();
    },

    set: function(options) {
        for (var name in options) {
            if (name == 'type') {
                continue;
            }

            if (typeof(this[name]) == "function") {
                this[name](options[name]);
            } 
            else {
                this[name] = options[name];
            }
        }
    },

    add: function(options) {
        var type = options.type || Widget;

        options._parent = this;

        var child = new type.prototype.$constructor(options);

        this.children.push(child);

        return child;
    },

    append: function(widget) {
        this.children.push(widget);

        if (widget._parent) {
            widget._parent.remove(widget);
        }

        widget._parent = this;
    },

    find: function(id) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].id == id) {
                return i;
            }
        }

        return null;
    },

    remove: function(widget) {
        var index = this.find(widget.id);
        this.children.splice(index, 1);
        widget._parent = null;
    },

    child: function(key) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].key == key) {
                return this.children[i];
            }    
        }
        return null;
    },

    updateTransform: function() {
        
    },

    pos: function(x, y) {
        if (x === undefined) {
            return [this._x, this._y];
        }
        else {
            this._x = x;
            this._y = y;
            this.updateTransform();
            return this;
        }
    },

    extent: function(x, y, w, h) {
        if (x === undefined) {
            return [this._x, this._y, this._width, this._height]; 
        }
        else {
            this._x = x;
            this._y = y;
            this._width = w;
            this._height = h;
            this.updateTransform();
            return this;
        }
    },

    size: function(w, h) {
        if (w === undefined) {
            return [this._width, this._height];
        }
        else {
            this._width = w;
            this._height = h;
            this.updateTransform();
            return this;
        }
    },

    root: function() {
        if (this._parent) {
            return this._parent.root();
        }
        else {
            return this;
        }
    },

    pageX: function() {
        if (this._parent) {
            return this._parent.pageX() + this.x();
        }
        else {
            return this.x();
        }
    },

    pageY: function() {
        if (this._parent) {
            return this._parent.pageY() + this.y();
        }
        else {
            return this.y();
        }
    }

});
