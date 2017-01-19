import ToastView from './toast.html';
import Helpers from '../../scripts/helpers.js';

const ToastTemplate = Helpers.compileHtmlString(ToastView).querySelector('.toast');

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

        // Fetch initial attribute values
        this.setMessage(this.getAttribute('data-message'));
        this.setAction(this.getAttribute('data-action'));
    }
    setMessage(message) {
        if (this.shadowRoot) {
            Helpers.appendText(this.shadowRoot, '.toast-message', message);
        }
    }
    setAction(action) {
        if (this.shadowRoot) {
            Helpers.appendText(this.shadowRoot, '.toast-action', action);
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