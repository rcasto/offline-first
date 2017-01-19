function compileHtmlString(htmlStr) {
    var div = document.createElement('div');
    div.innerHTML = htmlStr;
    return div;
}

function appendText(contextNode, selector, text) {
    var selectorElem = contextNode.querySelector(selector);
    var textElem = document.createTextNode(text);
    selectorElem.appendChild(textElem);
}

export default {
    compileHtmlString,
    appendText
}