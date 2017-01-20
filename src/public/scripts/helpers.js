function compileHtmlString(htmlStr) {
    var div = document.createElement('div');
    div.innerHTML = htmlStr;
    return div;
}

function appendText(targetNode, text) {
    var textElem = document.createTextNode(text);
    targetNode.appendChild(textElem);
}

export default {
    compileHtmlString,
    appendText
}