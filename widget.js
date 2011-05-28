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
        this.visible = true;

        this.marginTop = 0;
        this.marginBottom = 0;
        this.marginLeft = 0;
        this.marginRight = 0;

        this.sizeHint = 1; 
        this.set(options);

        if (!this._parent) {
            this.touchtracker = new TouchTracker(this);

            setInterval(this.draw.bind(this), 50);
        }
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
        if (!this.visible) {
            return;
        }

        if (context === undefined) {
            if (this.canvas) {
                this.doLayout();

                context = this.canvas.getContext("2d");
                context.clearRect(0, 0, this.width, this.height);

                this.children.each(function(child) {
                    child.draw(context);
                });
            }
            else {
                throw "no context or canvas given";
            }
        }
        else {
            context.save();
            context.translate(this.x(), this.y());

            this.drawCanvas(context);

            this.children.each(function(child) {
                child.draw(context);
            });

            context.restore();
        }
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

    listen: function() {
        this.controller.addEvent.apply(this.controller, arguments);
    },

    send: function() {
        this.controller.send.apply(this.controller, arguments);
    },

    add: function(options) {
        var type = options.type || Widget;

        if (!options.controller) {
            options.controller = this.controller;
        }

        if (!options._parent) {
            options._parent = this;
        }

        var child = new type.prototype.$constructor(options);

        this.children.push(child);

        return child;
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

    pos: function(x, y) {
        if (x === undefined) {
            return [this._x, this._y];
        }
        else {
            this._x = x;
            this._y = y;
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
