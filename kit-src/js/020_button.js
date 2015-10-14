/**
 * Class constructor for Button component.
 * Implements component design pattern defined at:
 * https://github.com/jasonmayes/sst-component-design-pattern
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
var SSTButton = function SSTButton(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window['SSTButton'] = SSTButton;

SSTButton.prototype.Constant_ = {};

SSTButton.prototype.CssClasses_ = {
    RIPPLE_EFFECT: 'sst-js-ripple-effect',
    RIPPLE_CONTAINER: 'sst-button__ripple-container',
    RIPPLE: 'sst-ripple'
};

SSTButton.prototype.blurHandler_ = function (event) {
    if (event) {
        this.element_.blur();
    }
};
// Public methods.

SSTButton.prototype.disable = function () {
    this.element_.disabled = true;
};
SSTButton.prototype['disable'] = SSTButton.prototype.disable;

SSTButton.prototype.enable = function () {
    this.element_.disabled = false;
};
SSTButton.prototype['enable'] = SSTButton.prototype.enable;

SSTButton.prototype.init = function () {
    if (this.element_) {
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
            var rippleContainer = document.createElement('span');
            rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
            this.rippleElement_ = document.createElement('span');
            this.rippleElement_.classList.add(this.CssClasses_.RIPPLE);
            rippleContainer.appendChild(this.rippleElement_);
            this.boundRippleBlurHandler = this.blurHandler_.bind(this);
            this.rippleElement_.addEventListener('mouseup', this.boundRippleBlurHandler);
            this.element_.appendChild(rippleContainer);
        }
        this.boundButtonBlurHandler = this.blurHandler_.bind(this);
        this.element_.addEventListener('mouseup', this.boundButtonBlurHandler);
        this.element_.addEventListener('mouseleave', this.boundButtonBlurHandler);
    }
};

SSTButton.prototype.sstDowngrade_ = function () {
    if (this.rippleElement_) {
        this.rippleElement_.removeEventListener('mouseup', this.boundRippleBlurHandler);
    }
    this.element_.removeEventListener('mouseup', this.boundButtonBlurHandler);
    this.element_.removeEventListener('mouseleave', this.boundButtonBlurHandler);
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
sstComponentHandler.register({
    constructor: SSTButton,
    classAsString: 'SSTButton',
    cssClass: 'sst-js-button',
    widget: true
});