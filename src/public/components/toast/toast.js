import ToastView from './toast.html';
import Helpers from '../../scripts/helpers.js';

const ToastTemplate = Helpers.compileHtmlString(ToastView).querySelector('.toast');
const dismissEvent = new Event('toast-dismiss', {
    bubbles: true,
    composed: true,
    cancelable: true
});
const actionEvent = new Event('toast-action', {
    bubbles: true,
    composed: true,
    cancelable: true
});

class Toast extends HTMLElement {
    constructor() {
        super(); // always call super() first in the ctor.
    }
    connectedCallback() {
        console.log('Toast Notification added to DOM');

        // Create Shadow DOM and attach template clone
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(ToastTemplate.content.cloneNode(true));

        // Find and cache variable elements
        this.dismissElem = this.shadowRoot.querySelector('.toast-dismiss');
        this.messageElem = this.shadowRoot.querySelector('.toast-message');
        this.actionElem = this.shadowRoot.querySelector('.toast-action');

        // Add event listeners
        this.dismissElem.addEventListener('click', (event) => {
            this.hidden = true;
            this.dispatchEvent(dismissEvent);
        }, false);
        this.actionElem.addEventListener('click', (event) => {
            this.dispatchEvent(actionEvent);
        });

        // Fetch initial attribute values
        this.setMessage(this.getAttribute('data-message'));
        this.setAction(this.getAttribute('data-action'));
    }
    setMessage(message) {
        if (this.messageElem) {
            Helpers.appendText(this.messageElem, message);
        }
    }
    setAction(action) {
        if (this.actionElem) {
            Helpers.appendText(this.actionElem, action);
        }
    }
    disconnectedCallback() {
        console.log('Toast Notification removed from DOM');
    }
    // Need to update the template on an attribute being updated
    attributeChangedCallback(attrName, oldVal, newVal) {
        console.log(`Attribute ${attr} changed from ${oldVal} -> ${newVal}`);

        if (attrName === 'data-message') {
            this.setMessage(this.getAttribute('data-message'));
        }
        if (attrName === 'data-action') {
            this.setAction(this.getAttribute('data-action'));
        }
    }
}

export default Toast;