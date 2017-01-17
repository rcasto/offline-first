function compileHtmlString(htmlStr) {
    var div = document.createElement('div');
    div.innerHTML = htmlStr;
    return div;
}

export default {
    compileHtmlString
}