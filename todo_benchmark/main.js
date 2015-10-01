var toggleStrings = require('./simple_lib').toggleStrings;
var deleteAllChildren = require('./simple_lib').deleteAllChildren;
var deleteSingle = require('./simple_lib').deleteSingle;
var getClassNamesInArray = require('./simple_lib').getClassNamesInArray;
var applyClassNameArrayToCollection = require('./simple_lib').applyClassNameArrayToCollection;
var element = require('./simple_lib').element;
var append = require('./simple_lib').append;
var changeClass = require('./simple_lib').changeClass;
var swapClass = require('./simple_lib').swapClass;
var setProps = require('./simple_lib').setProps;
var replace = require('./simple_lib').replace;

var todoItem;
var deleteCount = 0;


var batchCloneTodoItems = function(amount) {
    var clone;
    var docFragment = document.createDocumentFragment();
    for (var i = 0; i < amount; i+=1) {
        clone = todoItem.cloneNode(true);
        clone.childNodes[2].innerHTML = 'write your todo here.';
        docFragment.appendChild(clone);
    }
    return docFragment;
};


window.onload = function() {
    todoItem = element('div', '', 'todoItem');
    append(element('div', '', 'closeButton out'), todoItem);
    append(element('div', '', 'markButton out'), todoItem);
    append(element('h2', '', 'todoText'), todoItem);
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
    var root = document.getElementById('root');
    var before = (new Date()).getTime();
    append(batchCloneTodoItems(200), root);
    var after = (new Date()).getTime();
    logResult(after-before);
    logCounts(root);
};

window.runBenchmark2 = function() {
    var root = document.getElementById('root');
    var before = (new Date()).getTime();

    append(batchCloneTodoItems(200), root);
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
    var root = document.getElementById('root');
    var before = (new Date()).getTime();
    for (var i = 0; i < 10; i+=1) {
        append(batchCloneTodoItems(100), root);
        var classNames = getClassNamesInArray(root.childNodes);
        classNames = toggleStrings('todoItem', 'todoItemDone', classNames);
        applyClassNameArrayToCollection(classNames, root.childNodes);
        deleteCount += deleteAllChildren(root);
    }
    var after = (new Date()).getTime();
    logResult(after-before);
    logCounts(root);
};
