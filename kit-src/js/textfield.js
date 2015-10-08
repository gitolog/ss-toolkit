/**
 * Class constructor for Textfield component.
 * Implements component design pattern defined at:
 * https://github.com/jasonmayes/mdl-component-design-pattern
 *
 * @constructor
 * @param {HTMLElement} element The element that will be upgraded.
 */
var SSTtextfield = function SSTtextfield(element) {
    this.element_ = element;
    this.maxRows = this.Constant_.NO_MAX_ROWS;
    // Initialize instance.
    this.init();
};
window['SSTtextfield'] = SSTtextfield;
/**
 * Store constants in one place so they can be updated easily.
 *
 * @enum {string | number}
 * @private
 */
SSTtextfield.prototype.Constant_ = {
    NO_MAX_ROWS: -1,
    MAX_ROWS_ATTRIBUTE: 'maxrows'
};
/**
 * Store strings for class names defined by this component that are used in
 * JavaScript. This allows us to simply change it in one place should we
 * decide to modify at a later date.
 *
 * @enum {string}
 * @private
 */
SSTtextfield.prototype.CssClasses_ = {
    LABEL: 'sst-textfield__label',
    INPUT: 'sst-textfield__input',
    IS_DIRTY: 'sst-is-dirty',
    IS_FOCUSED: 'sst-is-focused',
    IS_DISABLED: 'sst-is-disabled',
    IS_INVALID: 'sst-is-invalid',
    IS_UPGRADED: 'sst-is-upgraded'
};
/**
 * Handle input being entered.
 *
 * @param {Event} event The event that fired.
 * @private
 */
SSTtextfield.prototype.onKeyDown_ = function (event) {
    var currentRowCount = event.target.value.split('\n').length;
    if (event.keyCode === 13) {
        if (currentRowCount >= this.maxRows) {
            event.preventDefault();
        }
    }
};
/**
 * Handle focus.
 *
 * @param {Event} event The event that fired.
 * @private
 */
SSTtextfield.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
};
/**
 * Handle lost focus.
 *
 * @param {Event} event The event that fired.
 * @private
 */
SSTtextfield.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
};
/**
 * Handle class updates.
 *
 * @private
 */
SSTtextfield.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkValidity();
    this.checkDirty();
};
// Public methods.
/**
 * Check the disabled state and update field accordingly.
 *
 * @public
 */
SSTtextfield.prototype.checkDisabled = function () {
    if (this.input_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
};
SSTtextfield.prototype['checkDisabled'] = SSTtextfield.prototype.checkDisabled;
/**
 * Check the validity state and update field accordingly.
 *
 * @public
 */
SSTtextfield.prototype.checkValidity = function () {
    if (this.input_.validity.valid) {
        this.element_.classList.remove(this.CssClasses_.IS_INVALID);
    } else {
        this.element_.classList.add(this.CssClasses_.IS_INVALID);
    }
};
SSTtextfield.prototype['checkValidity'] = SSTtextfield.prototype.checkValidity;
/**
 * Check the dirty state and update field accordingly.
 *
 * @public
 */
SSTtextfield.prototype.checkDirty = function () {
    if (this.input_.value && this.input_.value.length > 0) {
        this.element_.classList.add(this.CssClasses_.IS_DIRTY);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
    }
};
SSTtextfield.prototype['checkDirty'] = SSTtextfield.prototype.checkDirty;
/**
 * Disable text field.
 *
 * @public
 */
SSTtextfield.prototype.disable = function () {
    this.input_.disabled = true;
    this.updateClasses_();
};
SSTtextfield.prototype['disable'] = SSTtextfield.prototype.disable;
/**
 * Enable text field.
 *
 * @public
 */
SSTtextfield.prototype.enable = function () {
    this.input_.disabled = false;
    this.updateClasses_();
};
SSTtextfield.prototype['enable'] = SSTtextfield.prototype.enable;
/**
 * Update text field value.
 *
 * @param {string} value The value to which to set the control (optional).
 * @public
 */
SSTtextfield.prototype.change = function (value) {
    if (value) {
        this.input_.value = value;
    } else {
        this.input_.value = '';
    }
    this.updateClasses_();
};
SSTtextfield.prototype['change'] = SSTtextfield.prototype.change;
/**
 * Initialize element.
 */
SSTtextfield.prototype.init = function () {
    if (this.element_) {
        this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL);
        this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
        if (this.input_) {
            if (this.input_.hasAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE)) {
                this.maxRows = parseInt(this.input_.getAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE), 10);
                if (isNaN(this.maxRows)) {
                    this.maxRows = this.Constant_.NO_MAX_ROWS;
                }
            }
            this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
            this.boundFocusHandler = this.onFocus_.bind(this);
            this.boundBlurHandler = this.onBlur_.bind(this);
            this.input_.addEventListener('input', this.boundUpdateClassesHandler);
            this.input_.addEventListener('focus', this.boundFocusHandler);
            this.input_.addEventListener('blur', this.boundBlurHandler);
            if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
                // TODO: This should handle pasting multi line text.
                // Currently doesn't.
                this.boundKeyDownHandler = this.onKeyDown_.bind(this);
                this.input_.addEventListener('keydown', this.boundKeyDownHandler);
            }
            this.updateClasses_();
            this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
        }
    }
};
/**
 * Downgrade the component
 *
 * @private
 */

SSTtextfield.prototype.mdlDowngrade_ = function () {
    this.input_.removeEventListener('input', this.boundUpdateClassesHandler);
    this.input_.removeEventListener('focus', this.boundFocusHandler);
    this.input_.removeEventListener('blur', this.boundBlurHandler);
    if (this.boundKeyDownHandler) {
        this.input_.removeEventListener('keydown', this.boundKeyDownHandler);
    }
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
sstComponentHandler.register({
    constructor: SSTtextfield,
    classAsString: 'SSTtextfield',
    cssClass: 'sst-js-textfield',
    widget: true
});