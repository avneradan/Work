// DOM Utility Functions
export class DOMUtils {
  static querySelector(selector) {
    return document.querySelector(selector);
  }
  
  static querySelectorAll(selector) {
    return document.querySelectorAll(selector);
  }
  
  static addEventListener(element, event, handler, options = {}) {
    if (element) {
      element.addEventListener(event, handler, options);
    }
  }
  
  static removeEventListener(element, event, handler, options = {}) {
    if (element) {
      element.removeEventListener(event, handler, options);
    }
  }
  
  static setStyle(element, property, value) {
    if (element) {
      element.style[property] = value;
    }
  }
  
  static getStyle(element, property) {
    return element ? element.style[property] : null;
  }
  
  static setAttribute(element, attribute, value) {
    if (element) {
      element.setAttribute(attribute, value);
    }
  }
  
  static getAttribute(element, attribute) {
    return element ? element.getAttribute(attribute) : null;
  }
  
  static isElement(element) {
    return element instanceof Element;
  }
  
  static createElement(tag, className = '', attributes = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  }
}
