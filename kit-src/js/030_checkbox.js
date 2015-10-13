/**
 * Class constructor for Checkbox component.
 * Implements component design pattern defined at:
 * https://github.com/jasonmayes/mdl-component-design-pattern
 *
 * @constructor
 * @param {HTMLElement} element The element that will be upgraded.
 */
var SSTCheckbox = function SSTCheckbox(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window['SSTCheckbox'] = SSTCheckbox;
SSTCheckbox.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };
SSTCheckbox.prototype.CssClasses_ = {
    INPUT: 'sst-checkbox__input',
    BOX_OUTLINE: 'sst-checkbox__box-outline',
    FOCUS_HELPER: 'sst-checkbox__focus-helper',
    TICK_OUTLINE: 'sst-checkbox__tick-outline',
    RIPPLE_EFFECT: 'sst-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'sst-js-ripple-effect--ignore-events',
    RIPPLE_CONTAINER: 'sst-checkbox__ripple-container',
    RIPPLE_CENTER: 'sst-ripple--center',
    RIPPLE: 'sst-ripple',
    IS_FOCUSED: 'sst-is-focused',
    IS_DISABLED: 'sst-is-disabled',
    IS_CHECKED: 'sst-is-checked',
    IS_UPGRADED: 'sst-is-upgraded'
};
SSTCheckbox.prototype.onChange_ = function (event) {
    this.updateClasses_();
};
SSTCheckbox.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
};
SSTCheckbox.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
};
SSTCheckbox.prototype.onMouseUp_ = function (event) {
    this.blur_();
};
SSTCheckbox.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkToggleState();
};
SSTCheckbox.prototype.blur_ = function () {
    window.setTimeout(function () {
        this.inputElement_.blur();
    }.bind(this), this.Constant_.TINY_TIMEOUT);
};

// Public methods.
SSTCheckbox.prototype.checkToggleState = function () {
    if (this.inputElement_.checked) {
        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
};
SSTCheckbox.prototype['checkToggleState'] = SSTCheckbox.prototype.checkToggleState;
SSTCheckbox.prototype.checkDisabled = function () {
    if (this.inputElement_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
};
SSTCheckbox.prototype['checkDisabled'] = SSTCheckbox.prototype.checkDisabled;
SSTCheckbox.prototype.disable = function () {
    this.inputElement_.disabled = true;
    this.updateClasses_();
};
SSTCheckbox.prototype['disable'] = SSTCheckbox.prototype.disable;
SSTCheckbox.prototype.enable = function () {
    this.inputElement_.disabled = false;
    this.updateClasses_();
};
SSTCheckbox.prototype['enable'] = SSTCheckbox.prototype.enable;
SSTCheckbox.prototype.check = function () {
    this.inputElement_.checked = true;
    this.updateClasses_();
};
SSTCheckbox.prototype['check'] = SSTCheckbox.prototype.check;
SSTCheckbox.prototype.uncheck = function () {
    this.inputElement_.checked = false;
    this.updateClasses_();
};
SSTCheckbox.prototype['uncheck'] = SSTCheckbox.prototype.uncheck;

/**
 * Initialize element.
 */
SSTCheckbox.prototype.init = function () {
    if (this.element_) {
        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
        var boxOutline = document.createElement('span');
        boxOutline.classList.add(this.CssClasses_.BOX_OUTLINE);
        var tickContainer = document.createElement('span');
        tickContainer.classList.add(this.CssClasses_.FOCUS_HELPER);
        var tickOutline = document.createElement('span');
        tickOutline.classList.add(this.CssClasses_.TICK_OUTLINE);
        boxOutline.appendChild(tickOutline);
        this.element_.appendChild(tickContainer);
        this.element_.appendChild(boxOutline);
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
            this.rippleContainerElement_ = document.createElement('span');
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
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
        this.boundElementMouseUp = this.onMouseUp_.bind(this);
        this.inputElement_.addEventListener('change', this.boundInputOnChange);
        this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
        this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
        this.element_.addEventListener('mouseup', this.boundElementMouseUp);
        this.updateClasses_();
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
};

SSTCheckbox.prototype.mdlDowngrade_ = function () {
    if (this.rippleContainerElement_) {
        this.rippleContainerElement_.removeEventListener('mouseup', this.boundRippleMouseUp);
    }
    this.inputElement_.removeEventListener('change', this.boundInputOnChange);
    this.inputElement_.removeEventListener('focus', this.boundInputOnFocus);
    this.inputElement_.removeEventListener('blur', this.boundInputOnBlur);
    this.element_.removeEventListener('mouseup', this.boundElementMouseUp);
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
sstComponentHandler.register({
    constructor: SSTCheckbox,
    classAsString: 'SSTCheckbox',
    cssClass: 'sst-js-checkbox',
    widget: true
});
