document.querySelectorAll('a[href]')
    .forEach(handleAnchorElement);

document.querySelectorAll('form[action]')
    .forEach(handleFormElement);
    
document.querySelectorAll('img[src]')
    .forEach(handleImageElement);

document.querySelectorAll('link[href]')    
    .forEach(handleLinkElement);

document.querySelectorAll('script[src]')
    .forEach(handleScriptElement);



function handleAnchorElement(anchor) {
    replaceElement(anchor, 'span', ['href', 'rel']);
}

function handleFormElement(form) {
    const div = replaceElement(form, 'div', ['action', 'method']);

    div.querySelectorAll('button').forEach(button => {
        button.setAttribute('type', 'button');
    });
}

function handleImageElement(image) {
    image.remove();
}

function handleLinkElement(link) {
    if (link.getAttribute('rel') !== 'stylesheet') {
        link.remove();
        return;
    }

    getStyleSheet(link)
        .then(styleSheet => handleStyleSheetLinkElement(link, styleSheet));
}

function handleScriptElement(script) {
    script.remove();
}




function replaceElement(target, replacementTagName, skipAttributes = []) {
    const replacement = document.createElement(replacementTagName);
    
    for (let attribute of target.attributes) {
        if (!skipAttributes.includes(attribute.name)) {
            replacement.setAttribute(attribute.name, attribute.value);
        }
    }
    
    replacement.innerHTML = target.innerHTML;
    target.parentElement.replaceChild(replacement, target);
    return replacement;
}

function getStyleSheet(link) {
    return new Promise((resolve) => {
        const styleSheet = getLoadedStyleSheet(link.href);
        
        if (styleSheet) {
            resolve(styleSheet);
            return;
        }

        link.addEventListener(
            'load',
            event => resolve(getLoadedStyleSheet(event.target.href))
        );
    });
}

function handleStyleSheetLinkElement(link, styleSheet) {
    const style = document.createElement('style');
    style.innerText = getStyleSheetContent(styleSheet);
    link.parentElement.replaceChild(style, link);
}

function getLoadedStyleSheet(href) {
    return [...document.styleSheets].find(styleSheet => styleSheet.href === href);
}

function getStyleSheetContent(styleSheet) {
    return [...styleSheet.cssRules].map(cssRule => cssRule.cssText).join('\n');
}
