

var multiCopy = function(element, amount) {
    var clone;
    var docFragment = document.createDocumentFragment();
    for (var i = 0; i < amount; i+=1) {
        clone = element.cloneNode(true);
        docFragment.appendChild(clone);
    }
    return docFragment;
};

var toggleStrings = function(name1, name2, collection) {
    var toggled = [];
    var name;
    for (var i in collection) {
        name = collection[i];
        if (name === name1) {
            toggled.push(name2);
        } else if (name === name2) {
            toggled.push(name1);
        }
    }
    return toggled;
};

var deleteAllChildren = function(element) {
    var deleted = element.childNodes.length;
    element.innerHTML = '';
    return deleted;
};

var deleteSingle = function (item) {
    item.parentNode.removeChild(item);
    return 1;
};



var getClassNamesInArray = function(collection){
    var names = [];
    for (var i = 0; i < collection.length; i+=1) {
        names.push(collection[i].className);
    }
    return names;
};

var applyClassNameArrayToCollection = function(array, collection) {
    for (var i in array) {
        collection[i].className = array[i];
    }
};

var element = function(tag, id, className) {
    var element = document.createElement(tag);
    if (id) {element.id = id;}
    if (className) {element.className = className;}
    return element;
};

var append = function(element, parent) {
    parent.appendChild(element);
    return element;
};

var changeClass = function(element, class1, class2) {
    if (element.className === class1) {
        element.className = class2;
        return true;
    }
    return false;
};

var swapClass = function(element, class1, class2) {
    if (!changeClass(element, class1, class2)) {
        changeClass(element, class2, class1);
    }
};

var setProps = function(element, properties) {
    for (var p in properties) {
        element[p] = properties[p];
    }
};

var replace = function(elemOld, elemNew) {
    elemOld.parentNode.replaceChild(elemNew, elemOld);
};

module.exports = {
    multiCopy:multiCopy,
    toggleStrings:toggleStrings,
    deleteAllChildren:deleteAllChildren,
    deleteSingle:deleteSingle,
    getClassNamesInArray:getClassNamesInArray,
    applyClassNameArrayToCollection:applyClassNameArrayToCollection,
    element:element,
    append:append,
    changeClass:changeClass,
    swapClass:swapClass,
    setProps:setProps,
    replace:replace
};
