/**
 * Class constructor for Slider MDL component.
 * Implements MDL component design pattern defined at:
 * https://github.com/jasonmayes/sst-component-design-pattern
 */
var SSTSlider = function SSTSlider(element) {
    this.element_ = element;
    // Browser feature detection.
    this.isIE_ = window.navigator.msPointerEnabled;
    // Test if slider is hi-lo
    this.isMultiple_ = element.hasAttribute("multiple");
    // Initialize instance.
    this.init();
};
window['SSTSlider'] = SSTSlider;

SSTSlider.prototype.Constant_ = {
    // None for now.
};

SSTSlider.prototype.CssClasses_ = {
    IE_CONTAINER: 'sst-slider__ie-container',
    SLIDER_CONTAINER: 'sst-slider__container',
    SLIDER_CONTAINER_MULTIPLE: 'sst-slider__container--multiple',
    SLIDER_WRAPPER: 'sst-slider__wrapper',
    SLIDER_WRAPPER_LO: 'sst-slider__wrapper-lo',
    SLIDER_WRAPPER_HI: 'sst-slider__wrapper-hi',
    BACKGROUND_FLEX: 'sst-slider__background-flex',
    BACKGROUND_LOWER: 'sst-slider__background-lower',
    BACKGROUND_UPPER: 'sst-slider__background-upper',
    IS_LOWEST_VALUE: 'sst-is-lowest-value',
    IS_UPGRADED: 'sst-is-upgraded'
};


SSTSlider.prototype.onInput_ = function(event) {
    this.updateValueStyles_();
};

SSTSlider.prototype.onChange_ = function(event) {
    this.updateValueStyles_();
};

SSTSlider.prototype.onMouseUp_ = function(event) {
    event.target.blur();
};

SSTSlider.prototype.onContainerMouseDown_ = function(event) {
    // If this click is not on the parent element (but rather some child)
    // ignore. It may still bubble up.
    if (event.target !== this.element_.parentElement) {
        return;
    }

    // Discard the original event and create a new event that
    // is on the slider element.
    event.preventDefault();
    var newEvent = new MouseEvent('mousedown', {
        target: event.target,
        buttons: event.buttons,
        clientX: event.clientX,
        clientY: this.element_.getBoundingClientRect().y
    });
    this.element_.dispatchEvent(newEvent);
};

SSTSlider.prototype.updateValueStyles_ = function() {
    // Calculate and apply percentages to div structure behind slider.
    var fraction = (this.element_.value - this.element_.min) /
        (this.element_.max - this.element_.min);

    if (fraction === 0) {
        this.element_.classList.add(this.CssClasses_.IS_LOWEST_VALUE);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_LOWEST_VALUE);
    }

    if (!this.isIE_) {
        this.backgroundLower_.style.flex = fraction;
        this.backgroundLower_.style.webkitFlex = fraction;
        this.backgroundUpper_.style.flex = 1 - fraction;
        this.backgroundUpper_.style.webkitFlex = 1 - fraction;
    }
};

// Public methods.
SSTSlider.prototype.disable = function() {
    this.element_.disabled = true;
};

SSTSlider.prototype['disable'] = SSTSlider.prototype.disable;

SSTSlider.prototype.enable = function() {
    this.element_.disabled = false;
};

SSTSlider.prototype['enable'] = SSTSlider.prototype.enable;

SSTSlider.prototype.change = function(value) {
    if (typeof value !== 'undefined') {
        this.element_.value = value;
    }
    this.updateValueStyles_();
};

SSTSlider.prototype['change'] = SSTSlider.prototype.change;

SSTSlider.prototype.init = function() {

    if (this.element_) {
        if (this.isIE_) {
            // Since we need to specify a very large height in IE due to
            // implementation limitations, we add a parent here that trims it down to
            // a reasonable size.
            var containerIE = document.createElement('div');
            containerIE.classList.add(this.CssClasses_.IE_CONTAINER);
            this.element_.parentElement.insertBefore(containerIE, this.element_);
            this.element_.parentElement.removeChild(this.element_);
            containerIE.appendChild(this.element_);
        } else {
            // For non-IE browsers, we need a div structure that sits behind the
            // slider and allows us to style the left and right sides of it with
            // different colors.
            if(this.isMultiple_) {
                // Create and wrap each of 2 sliders with their own wrappers
                var wrapperLo = document.createElement('div');
                var wrapperHi = wrapperLo.cloneNode(true);
                wrapperLo.classList.add(this.CssClasses_.SLIDER_WRAPPER);
                wrapperLo.classList.add(this.CssClasses_.SLIDER_WRAPPER_LO);
                wrapperHi.classList.add(this.CssClasses_.SLIDER_WRAPPER);
                wrapperHi.classList.add(this.CssClasses_.SLIDER_WRAPPER_HI);
                // Append wrappers to document
                this.element_.parentElement.insertBefore(wrapperLo, this.element_);
                this.element_.parentElement.insertBefore(wrapperHi, this.element_);
                this.element_.parentElement.removeChild(this.element_);
                // Create slider clone
                this.element_.removeAttribute("multiple");
                this.element2_ = this.element_.cloneNode(true);
                // Give own values to each of slider
                var values = this.element_.getAttribute("value").split(',');
                if(values!==undefined) {
                    this.element_.setAttribute('value', values[0]);
                    this.element2_.setAttribute('value', values[1]);
                }
                // Wrap sliders to their own wrappers
                wrapperLo.appendChild(this.element_);
                wrapperHi.appendChild(this.element2_);
                // Initialize 2nd slider
                this.element2_ = new SSTSlider(this.element2_);
            }

            var container = document.createElement('div');
            container.classList.add(this.CssClasses_.SLIDER_CONTAINER);
            if(this.isMultiple_)
                container.classList.add(this.CssClasses_.SLIDER_CONTAINER_MULTIPLE);
            this.element_.parentElement.insertBefore(container, this.element_);
            this.element_.parentElement.removeChild(this.element_);
            container.appendChild(this.element_);
            var backgroundFlex = document.createElement('div');
            backgroundFlex.classList.add(this.CssClasses_.BACKGROUND_FLEX);
            container.appendChild(backgroundFlex);
            this.backgroundLower_ = document.createElement('div');
            this.backgroundLower_.classList.add(this.CssClasses_.BACKGROUND_LOWER);
            backgroundFlex.appendChild(this.backgroundLower_);
            this.backgroundUpper_ = document.createElement('div');
            this.backgroundUpper_.classList.add(this.CssClasses_.BACKGROUND_UPPER);
            backgroundFlex.appendChild(this.backgroundUpper_);
        }

        this.boundInputHandler = this.onInput_.bind(this);
        this.boundChangeHandler = this.onChange_.bind(this);
        this.boundMouseUpHandler = this.onMouseUp_.bind(this);
        this.boundContainerMouseDownHandler = this.onContainerMouseDown_.bind(this);
        this.element_.addEventListener('input', this.boundInputHandler);
        this.element_.addEventListener('change', this.boundChangeHandler);
        this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
        this.element_.parentElement.addEventListener('mousedown', this.boundContainerMouseDownHandler);

        this.updateValueStyles_();
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
};

SSTSlider.prototype.sstDowngrade_ = function() {
    this.element_.removeEventListener('input', this.boundInputHandler);
    this.element_.removeEventListener('change', this.boundChangeHandler);
    this.element_.removeEventListener('mouseup', this.boundMouseUpHandler);
    this.element_.parentElement.removeEventListener('mousedown', this.boundContainerMouseDownHandler);
};

// The component registers itself. It can assume componentHandler is available
// in the global scope.
sstComponentHandler.register({
    constructor: SSTSlider,
    classAsString: 'SSTSlider',
    cssClass: 'sst-js-slider',
    widget: true
});