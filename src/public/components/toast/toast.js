import ToastView from './toast.html';

console.log('View:', ToastView, typeof ToastView);

var compiledView = document.createElement('div');
compiledView.innerHTML = ToastView;

var ToastTemplate = compiledView.querySelector('.toast');
console.log('Template:', ToastTemplate, ToastTemplate.content.cloneNode(true));

/*
    When this script is run, it should be in the context of the HTML import it was brought in with.
    This means it should be able to get access to it's template external to itself.  Meaning it does
    not have to be defined in this file, along with the behavior of the component.  A better separation
    of concerns
*/
class Toast extends HTMLElement {
    constructor() {
        super(); // always call super() first in the ctor.
    }
    connectedCallback() {
        console.log('Toast Notification added to DOM');
    }
    disconnectedCallback() {
        console.log('Toast Notification removed from DOM');
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        console.log(`Attribute ${attr} changed from ${oldVal} -> ${newVal}`);
    }
}

export default Toast;