/**
 * Class constructor for Radio Button component.
 * Implements component design pattern defined at:
 * https://github.com/jasonmayes/sst-component-design-pattern
 *
 * @constructor
 * @param {HTMLElement} element The element that will be upgraded.
 */
var SSTRadio = function SSTRadio(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window['SSTRadio'] = SSTRadio;
SSTRadio.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };

SSTRadio.prototype.CssClasses_ = {
    IS_FOCUSED: 'sst-is-focused',
    IS_DISABLED: 'sst-is-disabled',
    IS_CHECKED: 'sst-is-checked',
    IS_UPGRADED: 'sst-is-upgraded',
    JS_RADIO: 'sst-js-radio',
    RADIO_BTN: 'sst-radio__button',
    RADIO_OUTER_CIRCLE: 'sst-radio__outer-circle',
    RADIO_INNER_CIRCLE: 'sst-radio__inner-circle',
    RIPPLE_EFFECT: 'sst-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'sst-js-ripple-effect--ignore-events',
    RIPPLE_CONTAINER: 'sst-radio__ripple-container',
    RIPPLE_CENTER: 'sst-ripple--center',
    RIPPLE: 'sst-ripple'
};

SSTRadio.prototype.onChange_ = function (event) {
    // Since other radio buttons don't get change events, we need to look for
    // them to update their classes.
    var radios = document.getElementsByClassName(this.CssClasses_.JS_RADIO);
    for (var i = 0; i < radios.length; i++) {
        var button = radios[i].querySelector('.' + this.CssClasses_.RADIO_BTN);
        // Different name == different group, so no point updating those.
        if (button.getAttribute('name') === this.btnElement_.getAttribute('name')) {
            radios[i]['SSTRadio'].updateClasses_();
        }
    }
};

SSTRadio.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
};

SSTRadio.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
};

SSTRadio.prototype.onMouseup_ = function (event) {
    this.blur_();
};

SSTRadio.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkToggleState();
};

SSTRadio.prototype.blur_ = function () {
    window.setTimeout(function () {
        this.btnElement_.blur();
    }.bind(this), this.Constant_.TINY_TIMEOUT);
};

// Public methods.
SSTRadio.prototype.checkDisabled = function () {
    if (this.btnElement_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
};
SSTRadio.prototype['checkDisabled'] = SSTRadio.prototype.checkDisabled;

SSTRadio.prototype.checkToggleState = function () {
    if (this.btnElement_.checked) {
        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
};
SSTRadio.prototype['checkToggleState'] = SSTRadio.prototype.checkToggleState;

SSTRadio.prototype.disable = function () {
    this.btnElement_.disabled = true;
    this.updateClasses_();
};
SSTRadio.prototype['disable'] = SSTRadio.prototype.disable;

SSTRadio.prototype.enable = function () {
    this.btnElement_.disabled = false;
    this.updateClasses_();
};
SSTRadio.prototype['enable'] = SSTRadio.prototype.enable;

SSTRadio.prototype.check = function () {
    this.btnElement_.checked = true;
    this.updateClasses_();
};
SSTRadio.prototype['check'] = SSTRadio.prototype.check;

SSTRadio.prototype.uncheck = function () {
    this.btnElement_.checked = false;
    this.updateClasses_();
};
SSTRadio.prototype['uncheck'] = SSTRadio.prototype.uncheck;

SSTRadio.prototype.init = function () {
    if (this.element_) {
        this.btnElement_ = this.element_.querySelector('.' + this.CssClasses_.RADIO_BTN);
        var outerCircle = document.createElement('span');
        outerCircle.classList.add(this.CssClasses_.RADIO_OUTER_CIRCLE);
        var innerCircle = document.createElement('span');
        innerCircle.classList.add(this.CssClasses_.RADIO_INNER_CIRCLE);
        this.element_.appendChild(outerCircle);
        this.element_.appendChild(innerCircle);
        var rippleContainer;
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
            rippleContainer = document.createElement('span');
            rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
            rippleContainer.classList.add(this.CssClasses_.RIPPLE_EFFECT);
            rippleContainer.classList.add(this.CssClasses_.RIPPLE_CENTER);
            rippleContainer.addEventListener('mouseup', this.onMouseup_.bind(this));
            var ripple = document.createElement('span');
            ripple.classList.add(this.CssClasses_.RIPPLE);
            rippleContainer.appendChild(ripple);
            this.element_.appendChild(rippleContainer);
        }
        this.btnElement_.addEventListener('change', this.onChange_.bind(this));
        this.btnElement_.addEventListener('focus', this.onFocus_.bind(this));
        this.btnElement_.addEventListener('blur', this.onBlur_.bind(this));
        this.element_.addEventListener('mouseup', this.onMouseup_.bind(this));
        this.updateClasses_();
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
sstComponentHandler.register({
    constructor: SSTRadio,
    classAsString: 'SSTRadio',
    cssClass: 'sst-js-radio',
    widget: true
});