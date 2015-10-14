/**
 * Class constructor for Checkbox MDL component.
 * Implements component design pattern defined at:
 * https://github.com/jasonmayes/sst-component-design-pattern
 */
var SSTSwitch = function SSTSwitch(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window['SSTSwitch'] = SSTSwitch;

SSTSwitch.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };

SSTSwitch.prototype.CssClasses_ = {
    INPUT: 'sst-switch__input',
    TRACK: 'sst-switch__track',
    THUMB: 'sst-switch__thumb',
    FOCUS_HELPER: 'sst-switch__focus-helper',
    RIPPLE_EFFECT: 'sst-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'sst-js-ripple-effect--ignore-events',
    RIPPLE_CONTAINER: 'sst-switch__ripple-container',
    RIPPLE_CENTER: 'sst-ripple--center',
    RIPPLE: 'sst-ripple',
    IS_FOCUSED: 'sst-is-focused',
    IS_DISABLED: 'sst-is-disabled',
    IS_CHECKED: 'sst-is-checked'
};

SSTSwitch.prototype.onChange_ = function (event) {
    this.updateClasses_();
};

SSTSwitch.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
};

SSTSwitch.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
};

SSTSwitch.prototype.onMouseUp_ = function (event) {
    this.blur_();
};

SSTSwitch.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkToggleState();
};

SSTSwitch.prototype.blur_ = function () {
    window.setTimeout(function () {
        this.inputElement_.blur();
    }.bind(this), this.Constant_.TINY_TIMEOUT);
};

// Public methods.
SSTSwitch.prototype.checkDisabled = function () {
    if (this.inputElement_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
};
SSTSwitch.prototype['checkDisabled'] = SSTSwitch.prototype.checkDisabled;

SSTSwitch.prototype.checkToggleState = function () {
    if (this.inputElement_.checked) {
        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
};
SSTSwitch.prototype['checkToggleState'] = SSTSwitch.prototype.checkToggleState;

SSTSwitch.prototype.disable = function () {
    this.inputElement_.disabled = true;
    this.updateClasses_();
};
SSTSwitch.prototype['disable'] = SSTSwitch.prototype.disable;

SSTSwitch.prototype.enable = function () {
    this.inputElement_.disabled = false;
    this.updateClasses_();
};
SSTSwitch.prototype['enable'] = SSTSwitch.prototype.enable;

SSTSwitch.prototype.on = function () {
    this.inputElement_.checked = true;
    this.updateClasses_();
};
SSTSwitch.prototype['on'] = SSTSwitch.prototype.on;

SSTSwitch.prototype.off = function () {
    this.inputElement_.checked = false;
    this.updateClasses_();
};
SSTSwitch.prototype['off'] = SSTSwitch.prototype.off;

SSTSwitch.prototype.init = function () {
    if (this.element_) {
        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
        var track = document.createElement('div');
        track.classList.add(this.CssClasses_.TRACK);
        var thumb = document.createElement('div');
        thumb.classList.add(this.CssClasses_.THUMB);
        var focusHelper = document.createElement('span');
        focusHelper.classList.add(this.CssClasses_.FOCUS_HELPER);
        thumb.appendChild(focusHelper);
        this.element_.appendChild(track);
        this.element_.appendChild(thumb);
        this.boundMouseUpHandler = this.onMouseUp_.bind(this);
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
            this.rippleContainerElement_ = document.createElement('span');
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
            this.rippleContainerElement_.addEventListener('mouseup', this.boundMouseUpHandler);
            var ripple = document.createElement('span');
            ripple.classList.add(this.CssClasses_.RIPPLE);
            this.rippleContainerElement_.appendChild(ripple);
            this.element_.appendChild(this.rippleContainerElement_);
        }
        this.boundChangeHandler = this.onChange_.bind(this);
        this.boundFocusHandler = this.onFocus_.bind(this);
        this.boundBlurHandler = this.onBlur_.bind(this);
        this.inputElement_.addEventListener('change', this.boundChangeHandler);
        this.inputElement_.addEventListener('focus', this.boundFocusHandler);
        this.inputElement_.addEventListener('blur', this.boundBlurHandler);
        this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
        this.updateClasses_();
        this.element_.classList.add('sst-is-upgraded');
    }
};

SSTSwitch.prototype.sstDowngrade_ = function () {
    if (this.rippleContainerElement_) {
        this.rippleContainerElement_.removeEventListener('mouseup', this.boundMouseUpHandler);
    }
    this.inputElement_.removeEventListener('change', this.boundChangeHandler);
    this.inputElement_.removeEventListener('focus', this.boundFocusHandler);
    this.inputElement_.removeEventListener('blur', this.boundBlurHandler);
    this.element_.removeEventListener('mouseup', this.boundMouseUpHandler);
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
sstComponentHandler.register({
    constructor: SSTSwitch,
    classAsString: 'SSTSwitch',
    cssClass: 'sst-js-switch',
    widget: true
});