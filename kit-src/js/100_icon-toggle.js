/**
 * Class constructor for icon toggle component.
 * Implements component design pattern defined at:
 * https://github.com/jasonmayes/sst-component-design-pattern
 */
var SSTIconToggle = function SSTIconToggle(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window['SSTIconToggle'] = SSTIconToggle;

SSTIconToggle.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };

SSTIconToggle.prototype.CssClasses_ = {
    INPUT: 'sst-icon-toggle__input',
    JS_RIPPLE_EFFECT: 'sst-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'sst-js-ripple-effect--ignore-events',
    RIPPLE_CONTAINER: 'sst-icon-toggle__ripple-container',
    RIPPLE_CENTER: 'sst-ripple--center',
    RIPPLE: 'sst-ripple',
    IS_FOCUSED: 'sst-is-focused',
    IS_DISABLED: 'sst-is-disabled',
    IS_CHECKED: 'sst-is-checked'
};

SSTIconToggle.prototype.onChange_ = function (event) {
    this.updateClasses_();
};

SSTIconToggle.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
};

SSTIconToggle.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
};

SSTIconToggle.prototype.onMouseUp_ = function (event) {
    this.blur_();
};

SSTIconToggle.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkToggleState();
};

SSTIconToggle.prototype.blur_ = function () {
    // TODO: figure out why there's a focus event being fired after our blur,
    // so that we can avoid this hack.
    window.setTimeout(function () {
        this.inputElement_.blur();
    }.bind(this), this.Constant_.TINY_TIMEOUT);
};

// Public methods.
SSTIconToggle.prototype.checkToggleState = function () {
    if (this.inputElement_.checked) {
        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
};
SSTIconToggle.prototype['checkToggleState'] = SSTIconToggle.prototype.checkToggleState;

SSTIconToggle.prototype.checkDisabled = function () {
    if (this.inputElement_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
};
SSTIconToggle.prototype['checkDisabled'] = SSTIconToggle.prototype.checkDisabled;

SSTIconToggle.prototype.disable = function () {
    this.inputElement_.disabled = true;
    this.updateClasses_();
};
SSTIconToggle.prototype['disable'] = SSTIconToggle.prototype.disable;

SSTIconToggle.prototype.enable = function () {
    this.inputElement_.disabled = false;
    this.updateClasses_();
};
SSTIconToggle.prototype['enable'] = SSTIconToggle.prototype.enable;

SSTIconToggle.prototype.check = function () {
    this.inputElement_.checked = true;
    this.updateClasses_();
};
SSTIconToggle.prototype['check'] = SSTIconToggle.prototype.check;

SSTIconToggle.prototype.uncheck = function () {
    this.inputElement_.checked = false;
    this.updateClasses_();
};
SSTIconToggle.prototype['uncheck'] = SSTIconToggle.prototype.uncheck;

SSTIconToggle.prototype.init = function () {
    if (this.element_) {
        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
        if (this.element_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
            this.rippleContainerElement_ = document.createElement('span');
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
            this.rippleContainerElement_.classList.add(this.CssClasses_.JS_RIPPLE_EFFECT);
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
            this.boundRippleMouseUp = this.onMouseUp_.bind(this);
            this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);
            var ripple = document.createElement('span');
            ripple.classList.add(this.CssClasses_.RIPPLE);
            this.rippleContainerElement_.appendChild(ripple);
            this.element_.appendChild(this.rippleContainerElement_);
        }
        this.boundInputOnChange = this.onChange_.bind(this);
        this.boundInputOnFocus = this.onFocus_.bind(this);
        this.boundInputOnBlur = this.onBlur_.bind(this);
        this.boundElementOnMouseUp = this.onMouseUp_.bind(this);
        this.inputElement_.addEventListener('change', this.boundInputOnChange);
        this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
        this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
        this.element_.addEventListener('mouseup', this.boundElementOnMouseUp);
        this.updateClasses_();
        this.element_.classList.add('sst-is-upgraded');
    }
};

SSTIconToggle.prototype.sstDowngrade_ = function () {
    if (this.rippleContainerElement_) {
        this.rippleContainerElement_.removeEventListener('mouseup', this.boundRippleMouseUp);
    }
    this.inputElement_.removeEventListener('change', this.boundInputOnChange);
    this.inputElement_.removeEventListener('focus', this.boundInputOnFocus);
    this.inputElement_.removeEventListener('blur', this.boundInputOnBlur);
    this.element_.removeEventListener('mouseup', this.boundElementOnMouseUp);
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
sstComponentHandler.register({
    constructor: SSTIconToggle,
    classAsString: 'SSTIconToggle',
    cssClass: 'sst-js-icon-toggle',
    widget: true
});