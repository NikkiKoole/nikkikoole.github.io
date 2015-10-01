




// OPTIMIZATION #2
// dont toggle the classNames directly, instead use an array to keep track and apply at the end.
// it makes toggling much faster
var toggle_optimized = function(classNames) {
    // I will receive an array of classNames, toggle them and return the new array.
    var toggled = [];
    var name;
    for (var i in classNames) {
        name = classNames[i];
        if (name === 'todoItem') {
            toggled.push('todoItemDone');
        } else if (name === 'todoItemDone') {
            toggled.push('todoItem');
        }
    }
    return toggled;
};
var log_time = function(duration) {
    document.getElementById('time_feedback').innerHTML = 'that took just '+ (duration)+' millisecs';
};
var log_count_data = function() {
    var children = root.childNodes;
    var done = root.getElementsByClassName('todoItemDone').length;
    var text = 'of a total of '+children.length +' stuffs that need doing, '+ done+' stuffs are marked done.'+deleted_count+' are deleted.';
     document.getElementById('items_done_feedback').innerHTML = text;
};


var add_amount = 10;
var todoItem;
var root;
//var time_feedback;
//var items_done_feedback;
var deleted_count = 0;

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


window.onload = function() {
    todoItem = element('div', '', 'todoItem');
    append(element('div', '', 'closeButton out'), todoItem);
    append(element('div', '', 'markButton out'), todoItem);
    append(element('h2', '', 'todoText'), todoItem);

    append(element('h1', 'time_feedback'), document.body);
    append(element('h3', 'items_done_feedback'), document.body);
    root = element('div', 'root', 'one');
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
        if (e.target.className === 'todoText' || e.target.className === 'todoText done') {
            var input = element('input');
            input.type = 'text';
            input.value = e.target.innerHTML;
            input.oldClass = e.target.className;
            e.target.parentNode.replaceChild(input, e.target);

            input.onchange = input.onblur = input.oninput =  function(e2) {
                var text = element('h2', '', e2.target.oldClass);
                text.innerHTML = e2.target.value;
                e2.target.parentNode.replaceChild(text, e2.target);
            };
        }
        if (e.target.className ===  'closeButton over') {
            delete_single_item( e.target.parentNode);
            log_count_data();
        }
        if (e.target.className ===  'markButton over') {
            swapClass(e.target.parentNode, 'todoItem', 'todoItemDone');
            log_count_data();
        }

    };
};


var deleteAllItems = function() {
    deleted_count += root.childNodes.length;
    root.innerHTML = '';
    //root = root.cloneNode(true);
};
window.deleteAllItems = deleteAllItems;
var delete_single_item = function (item) {
    item.parentNode.removeChild(item);
    deleted_count += 1;
};

var create200TodoItems = function(){
    var newDiv;
    var amountAlreadyHere = root.childNodes.length;
    //deleteAllItems();


    for (var i = 1; i <= add_amount; i++) {
        newDiv = todoItem.cloneNode(true);
        newDiv.childNodes[2].innerHTML = (amountAlreadyHere+i)+ ') write text here';
        root.appendChild(newDiv);
    }
    log_count_data();
    //items_done_feedback.innerHTML = getItemsDoneFeedback();
};

var toggleAll = function() {
    var classNames = [];
    var children = root.childNodes;

    for(var i = 0; i < children.length; i+=1){
        classNames.push(children[i].className);
    }

    classNames = toggle_optimized(classNames);

    for (i in classNames) {
        children[i].className = classNames[i];
    }
    //log_count_data();
};

var create200TodoItemsAndToggleFiveTimes = function() {
    var newDiv;
    var amountAlreadyHere = root.childNodes.length;
    var i;
    for (i = 1; i <= add_amount; i++) {
        newDiv = todoItem.cloneNode(true);
        newDiv.childNodes[2].innerHTML = (amountAlreadyHere+i)+ ') write text here';
        root.appendChild(newDiv);
    }
    var classNames = [];
    var children = root.childNodes;

    for(var i = 0; i < children.length; i+=1){
        classNames.push(children[i].className);
    }

    classNames = toggle_optimized(classNames);
    classNames = toggle_optimized(classNames);
    classNames = toggle_optimized(classNames);
    classNames = toggle_optimized(classNames);
    classNames = toggle_optimized(classNames);

    for (i in classNames) {
        children[i].className = classNames[i];
    }

    log_count_data();
    //items_done_feedback.innerHTML = getItemsDoneFeedback();

};


window.runBenchmark1 = function() {
    var d = new Date();
    var before = d.getTime();
    add_amount = 200;
    create200TodoItems();
    var d2 = new Date();
    var after = d2.getTime();
    //time_feedback.innerHTML = 'that took just '+ (after-before)+' millisecs';

    log_time(after-before);
    log_count_data();
};
window.runBenchmark2 = function() {
    var d = new Date();
    var before = d.getTime();
    add_amount = 200;
    create200TodoItemsAndToggleFiveTimes();
    var d2 = new Date();
    var after = d2.getTime();
    //time_feedback.innerHTML = 'that took just '+ (after-before)+' millisecs';

    log_time(after-before);
    log_count_data();

};
window.runBenchmark3 = function() {
    var d = new Date();
    var before = d.getTime();
    add_amount = 100;
    for (var i = 0; i < 10; i+=1) {
        create200TodoItems();
        toggleAll();
        deleteAllItems();
    }
    var d2 = new Date();
    var after = d2.getTime();
    //time_feedback.innerHTML = 'that took just '+ (after-before)+' millisecs';

    log_time(after-before);
    log_count_data();
};
