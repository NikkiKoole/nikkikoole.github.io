(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var toggleStrings = require('./simple_lib').toggleStrings;
var deleteAllChildren = require('./simple_lib').deleteAllChildren;
var deleteSingle = require('./simple_lib').deleteSingle;
var getClassNamesInArray = require('./simple_lib').getClassNamesInArray;
var applyClassNameArrayToCollection = require('./simple_lib').applyClassNameArrayToCollection;
var multiCopy = require('./simple_lib').multiCopy;
var element = require('./simple_lib').element;
var append = require('./simple_lib').append;
var changeClass = require('./simple_lib').changeClass;
var swapClass = require('./simple_lib').swapClass;
var setProps = require('./simple_lib').setProps;
var replace = require('./simple_lib').replace;


var deleteCount = 0;


var createTodoItem = function(){
    var todoItem = element('div', '', 'todoItem');
    append(element('div', '', 'closeButton out'), todoItem);
    append(element('div', '', 'markButton out'), todoItem);
    var text = append(element('h2', '', 'todoText'), todoItem);
    text.innerHTML = 'write your todo here.';
    return todoItem;
};

window.onload = function() {
    append(element('h1', 'time_feedback'), document.body);
    append(element('h3', 'items_done_feedback'), document.body);

    var root = element('div', 'root', 'one');
    append(root, document.body);

    root.onmouseover = function(e){
        changeClass(e.target, 'closeButton out', 'closeButton over');
        changeClass(e.target, 'markButton out', 'markButton over');
    };
    root.onmouseout = function(e){
        changeClass(e.target, 'closeButton over', 'closeButton out');
        changeClass(e.target, 'markButton over', 'markButton out');
    };
    root.onclick = function(e){
        var clicked = e.target;
        if (clicked.className === 'todoText' || clicked.className === 'todoText done') {
            var input = element('input');
            setProps(input, {type:'text', value:clicked.innerHTML, oldClass:clicked.className});
            replace(clicked, input);
            var newText = element('h2', '', clicked.className);
            input.onblur = input.onkeydown =   function(e2) {
                newText.innerHTML = input.value;
                if (e2.type === 'blur' || e2.keyCode === 13) {
                    input.onblur = null;
                    replace(input, newText);
                }
            };
        }
        if (clicked.className ===  'closeButton over') {
            deleteCount += deleteSingle( e.target.parentNode);
        }
        if (clicked.className ===  'markButton over') {
            swapClass(e.target.parentNode, 'todoItem', 'todoItemDone');
        }
        logCounts(root);
    };
};

var logResult = function(duration) {
    document.getElementById('time_feedback').innerHTML = 'That took just '+ (duration)+' millisecs.';
};
var logCounts = function(root) {
    var children = root.childNodes;
    var done = root.getElementsByClassName('todoItemDone').length;
    var text =
            'Of a total of '+ root.childNodes.length +
            ' stuffs that need doing, '+
            done +' stuffs are marked done, ' +
            deleteCount + ' are deleted.';
     document.getElementById('items_done_feedback').innerHTML = text;
};

window.runBenchmark1 = function() {
    var before = (new Date()).getTime();
    var root = document.getElementById('root');
    var todoItem = createTodoItem();

    append(multiCopy(todoItem, 200), root);
    var after = (new Date()).getTime();
    logResult(after-before);
    logCounts(root);
};

window.runBenchmark2 = function() {
    var before = (new Date()).getTime();
    var root = document.getElementById('root');
    var todoItem = createTodoItem();

    append(multiCopy(todoItem, 200), root);
    var classNames = getClassNamesInArray(root.childNodes);
    for (var i = 0; i < 5; i+=1) {
        classNames = toggleStrings('todoItem', 'todoItemDone', classNames);
    }
    applyClassNameArrayToCollection(classNames, root.childNodes);

    var after = (new Date()).getTime();
    logResult(after-before);
    logCounts(root);
};

window.runBenchmark3 = function() {
    var before = (new Date()).getTime();
    var root = document.getElementById('root');
    var todoItem = createTodoItem();

    for (var i = 0; i < 10; i+=1) {
        append(multiCopy(todoItem, 100), root);
        var classNames = getClassNamesInArray(root.childNodes);
        classNames = toggleStrings('todoItem', 'todoItemDone', classNames);
        applyClassNameArrayToCollection(classNames, root.childNodes);
        deleteCount += deleteAllChildren(root);
    }
    var after = (new Date()).getTime();
    logResult(after-before);
    logCounts(root);
};

},{"./simple_lib":2}],2:[function(require,module,exports){


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

},{}]},{},[1])