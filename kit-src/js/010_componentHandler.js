/**
 * A component handler interface using the revealing module design pattern.
 * More details on this design pattern here:
 * https://github.com/jasonmayes/mdl-component-design-pattern
 *
 * @author Jason Mayes.
 */

var sstComponentHandler = {
    upgradeDom: function(optJsClass, optCssClass) {},
    upgradeElement: function(element, optJsClass) {},
    upgradeElements: function(elements) {},
    upgradeAllRegistered: function() {},
    registerUpgradedCallback: function(jsClass, callback) {},
    register: function(config) {},
    downgradeElements: function(nodes) {}
};

sstComponentHandler = (function() {
    'use strict';
    var registeredComponents_ = [];
    var createdComponents_ = [];
    var downgradeMethod_ = 'sstDowngrade_';
    var componentConfigProperty_ = 'sstComponentConfigInternal_';
    function findRegisteredClass_(name, optReplace) {
        for (var i = 0; i < registeredComponents_.length; i++) {
            if (registeredComponents_[i].className === name) {
                if (typeof optReplace !== 'undefined') {
                    registeredComponents_[i] = optReplace;
                }
                return registeredComponents_[i];
            }
        }
        return false;
    }

    function getUpgradedListOfElement_(element) {
        var dataUpgraded = element.getAttribute('data-upgraded');
        // Use `['']` as default value to conform the `,name,name...` style.
        return dataUpgraded === null ? [''] : dataUpgraded.split(',');
    }

    function isElementUpgraded_(element, jsClass) {
        var upgradedList = getUpgradedListOfElement_(element);
        return upgradedList.indexOf(jsClass) !== -1;
    }

    function upgradeDomInternal(optJsClass, optCssClass) {
        if (typeof optJsClass === 'undefined' &&
            typeof optCssClass === 'undefined') {
            for (var i = 0; i < registeredComponents_.length; i++) {
                upgradeDomInternal(registeredComponents_[i].className,
                    registeredComponents_[i].cssClass);
            }
        } else {
            var jsClass = (optJsClass);
            if (typeof optCssClass === 'undefined') {
                var registeredClass = findRegisteredClass_(jsClass);
                if (registeredClass) {
                    optCssClass = registeredClass.cssClass;
                }
            }

            var elements = document.querySelectorAll('.' + optCssClass);
            for (var n = 0; n < elements.length; n++) {
                upgradeElementInternal(elements[n], jsClass);
            }
        }
    }

    function upgradeElementInternal(element, optJsClass) {
        if (!(typeof element === 'object' && element instanceof Element)) {
            throw new Error('Invalid argument provided to upgrade element.');
        }
        var upgradedList = getUpgradedListOfElement_(element);
        var classesToUpgrade = [];
        // If jsClass is not provided scan the registered components to find the
        // ones matching the element's CSS classList.
        if (!optJsClass) {
            var classList = element.classList;
            registeredComponents_.forEach(function(component) {
                // Match CSS & Not to be upgraded & Not upgraded.
                if (classList.contains(component.cssClass) &&
                    classesToUpgrade.indexOf(component) === -1 &&
                    !isElementUpgraded_(element, component.className)) {
                    classesToUpgrade.push(component);
                }
            });
        } else if (!isElementUpgraded_(element, optJsClass)) {
            classesToUpgrade.push(findRegisteredClass_(optJsClass));
        }

        // Upgrade the element for each classes.
        for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
            registeredClass = classesToUpgrade[i];
            if (registeredClass) {
                // Mark element as upgraded.
                upgradedList.push(registeredClass.className);
                element.setAttribute('data-upgraded', upgradedList.join(','));
                var instance = new registeredClass.classConstructor(element);
                instance[componentConfigProperty_] = registeredClass;
                createdComponents_.push(instance);
                // Call any callbacks the user has registered with this component type.
                for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
                    registeredClass.callbacks[j](element);
                }

                if (registeredClass.widget) {
                    // Assign per element instance for control over API
                    element[registeredClass.className] = instance;
                }
            } else {
                throw new Error(
                    'Unable to find a registered component for the given class.');
            }

            var ev = document.createEvent('Events');
            ev.initEvent('sst-componentupgraded', true, true);
            element.dispatchEvent(ev);
        }
    }

    function upgradeElementsInternal(elements) {
        if (!Array.isArray(elements)) {
            if (typeof elements.item === 'function') {
                elements = Array.prototype.slice.call(/** @type {Array} */ (elements));
            } else {
                elements = [elements];
            }
        }
        for (var i = 0, n = elements.length, element; i < n; i++) {
            element = elements[i];
            if (element instanceof HTMLElement) {
                upgradeElementInternal(element);
                if (element.children.length > 0) {
                    upgradeElementsInternal(element.children);
                }
            }
        }
    }

    function registerInternal(config) {
        // In order to support both Closure-compiled and uncompiled code accessing
        // this method, we need to allow for both the dot and array syntax for
        // property access. You'll therefore see the `foo.bar || foo['bar']`
        // pattern repeated across this method.
        var widgetMissing = (typeof config.widget === 'undefined' &&
        typeof config['widget'] === 'undefined');
        var widget = true;

        if (!widgetMissing) {
            widget = config.widget || config['widget'];
        }

        var newConfig = ({
            classConstructor: config.constructor || config['constructor'],
            className: config.classAsString || config['classAsString'],
            cssClass: config.cssClass || config['cssClass'],
            widget: widget,
            callbacks: []
        });

        registeredComponents_.forEach(function(item) {
            if (item.cssClass === newConfig.cssClass) {
                throw new Error('The provided cssClass has already been registered: ' + item.cssClass);
            }
            if (item.className === newConfig.className) {
                throw new Error('The provided className has already been registered');
            }
        });

        if (config.constructor.prototype
                .hasOwnProperty(componentConfigProperty_)) {
            throw new Error(
                'Component classes must not have ' + componentConfigProperty_ +
                ' defined as a property.');
        }

        var found = findRegisteredClass_(config.classAsString, newConfig);

        if (!found) {
            registeredComponents_.push(newConfig);
        }
    }

    function registerUpgradedCallbackInternal(jsClass, callback) {
        var regClass = findRegisteredClass_(jsClass);
        if (regClass) {
            regClass.callbacks.push(callback);
        }
    }

    function upgradeAllRegisteredInternal() {
        for (var n = 0; n < registeredComponents_.length; n++) {
            upgradeDomInternal(registeredComponents_[n].className);
        }
    }

    function findCreatedComponentByNodeInternal(node) {
        for (var n = 0; n < createdComponents_.length; n++) {
            var component = createdComponents_[n];
            if (component.element_ === node) {
                return component;
            }
        }
    }

    function deconstructComponentInternal(component) {
        if (component &&
            component[componentConfigProperty_]
                .classConstructor.prototype
                .hasOwnProperty(downgradeMethod_)) {
            component[downgradeMethod_]();
            var componentIndex = createdComponents_.indexOf(component);
            createdComponents_.splice(componentIndex, 1);

            var upgrades = component.element_.getAttribute('data-upgraded').split(',');
            var componentPlace = upgrades.indexOf(
                component[componentConfigProperty_].classAsString);
            upgrades.splice(componentPlace, 1);
            component.element_.setAttribute('data-upgraded', upgrades.join(','));

            var ev = document.createEvent('Events');
            ev.initEvent('sst-componentdowngraded', true, true);
            component.element_.dispatchEvent(ev);
        }
    }

    function downgradeNodesInternal(nodes) {
        var downgradeNode = function(node) {
            deconstructComponentInternal(findCreatedComponentByNodeInternal(node));
        };
        if (nodes instanceof Array || nodes instanceof NodeList) {
            for (var n = 0; n < nodes.length; n++) {
                downgradeNode(nodes[n]);
            }
        } else if (nodes instanceof Node) {
            downgradeNode(nodes);
        } else {
            throw new Error('Invalid argument provided to downgrade nodes.');
        }
    }

    // Now return the functions that should be made public with their publicly
    // facing names...
    return {
        upgradeDom: upgradeDomInternal,
        upgradeElement: upgradeElementInternal,
        upgradeElements: upgradeElementsInternal,
        upgradeAllRegistered: upgradeAllRegisteredInternal,
        registerUpgradedCallback: registerUpgradedCallbackInternal,
        register: registerInternal,
        downgradeElements: downgradeNodesInternal
    };
})();

sstComponentHandler.ComponentConfigPublic;  // jshint ignore:line

sstComponentHandler.ComponentConfig;  // jshint ignore:line

sstComponentHandler.Component;  // jshint ignore:line

// Export all symbols, for the benefit of Closure compiler.
// No effect on uncompiled code.
sstComponentHandler['upgradeDom'] = sstComponentHandler.upgradeDom;
sstComponentHandler['upgradeElement'] = sstComponentHandler.upgradeElement;
sstComponentHandler['upgradeElements'] = sstComponentHandler.upgradeElements;
sstComponentHandler['upgradeAllRegistered'] = sstComponentHandler.upgradeAllRegistered;
sstComponentHandler['registerUpgradedCallback'] = sstComponentHandler.registerUpgradedCallback;
sstComponentHandler['register'] = sstComponentHandler.register;
sstComponentHandler['downgradeElements'] = sstComponentHandler.downgradeElements;
window.sstComponentHandler = sstComponentHandler;
window['sstComponentHandler'] = sstComponentHandler;

window.addEventListener('load', function() {
    'use strict';

    if ('classList' in document.createElement('div') &&
        'querySelector' in document &&
        'addEventListener' in window && Array.prototype.forEach) {
        document.documentElement.classList.add('sst-js');
        sstComponentHandler.upgradeAllRegistered();
    } else {
        /**
         * Dummy function to avoid JS errors.
         */
        //sstComponentHandler.upgradeElement = function() {};
        /**
         * Dummy function to avoid JS errors.
         */
        //sstComponentHandler.register = function() {};
    }
});
