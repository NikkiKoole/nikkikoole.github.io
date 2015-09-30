


var getItemsDoneFeedback = function () {
    var done = 0;
    var children = root.childNodes;
    for(var child in children){
        if (children[child].className === 'todoItem closed') {
            done += 1;
        }
    }

    return ('of a total of '+children.length +' stuffs that need doing, '+ done+' stuffs are done.');
};

// this is the naive className changing i had before optimizing it.
var toggleAll = function() {
    var children = root.childNodes;
    for(var child in children){
        if (children[child].className === 'todoItem open') {
            children[child].className = 'todoItem closed';
        } else if (children[child].className === 'todoItem closed'){
            children[child].className = 'todoItem open';
        }
    }
};

// OPTIMIZATION #2
// dont toggle the classNames directly, instead use an array to keep track and apply at the end.
// it makes toggling much faster
var toggle_optimized = function(classNames) {
    // I will receive an array of classNames, toggle them and return the new array.
    var toggled = [];
    var name;
    for (var i in classNames) {
        name = classNames[i];
        if (name === 'todoItem open') {
            toggled.push('todoItem closed');
        } else if (name === 'todoItem closed') {
            toggled.push('todoItem open');
        }
    }
    return toggled;
};

var add_amount = 200;
var todoItem;
var root;
var time_feedback;
var items_done_feedback;

window.onload = function() {
    time_feedback =  document.createElement('h1');
    document.body.appendChild(time_feedback);
    items_done_feedback =  document.createElement('h3');
    document.body.appendChild(items_done_feedback);
    todoItem = document.createElement('div');
    var todoClose = document.createElement('div');
    todoClose.className = 'closeButton out';
    todoItem.appendChild(todoClose);
    todoItem.className = 'todoItem open';
    var todoText = document.createElement('h2');
    todoText.className = 'todoText';
    todoItem.appendChild(todoText);
    root = document.createElement('div');
    root.id = 'root';
    root.className = "one";
    document.body.appendChild(root);

    // OPTIMIZATION #1
    // add eventhandlers to the root iinstead of to the individual Nodes,
    // it makes cloning many nodes much faster.
    root.onmouseover = function(e){
        if (e.target.className ===  'closeButton out') {
            e.target.className =  'closeButton over';
        }
    };
    root.onmouseout = function(e){
        if (e.target.className ===  'closeButton over') {
            e.target.className =  'closeButton out';
        }
    };
    root.onclick = function(e){
        if (e.target.className ===  'closeButton over') {
            e.target.parentNode.className = "todoItem closed";
            items_done_feedback.innerHTML = getItemsDoneFeedback();
        }
    };
};

var create200TodoItems = function(){
    var newDiv;
    var amountAlreadyHere = root.childNodes.length;
    for (var i = 1; i <= add_amount; i++) {
        newDiv = todoItem.cloneNode(true);
        newDiv.childNodes[1].innerHTML = (amountAlreadyHere+i)+ ' Todo: stuff';
        root.appendChild(newDiv);
    }
    items_done_feedback.innerHTML = getItemsDoneFeedback();
};


var create200TodoItemsAndToggleFiveTimes = function() {
    var newDiv;
    var amountAlreadyHere = root.childNodes.length;
    var i;
    for (i = 1; i <= add_amount; i++) {
        newDiv = todoItem.cloneNode(true);
        newDiv.childNodes[1].innerHTML = (amountAlreadyHere+i)+ ' Todo: stuff';
        root.appendChild(newDiv);
    }

    var classNames = [];
    var children = root.childNodes;

    for(i = 0; i < children.length; i+=1){
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

    // This is optimized out now
    // toggleAll();
    // toggleAll();
    // toggleAll();
    // toggleAll();
    // toggleAll();

    items_done_feedback.innerHTML = getItemsDoneFeedback();

};


window.runBenchmark1 = function() {
    var d = new Date();
    var before = d.getTime();
    create200TodoItems();
    var d2 = new Date();
    var after = d2.getTime();
    time_feedback.innerHTML = 'that took just '+ (after-before)+' millisecs';
    ;
};
window.runBenchmark2 = function() {
    var d = new Date();
    var before = d.getTime();
    create200TodoItemsAndToggleFiveTimes();
    var d2 = new Date();
    var after = d2.getTime();
    time_feedback.innerHTML = 'that took just '+ (after-before)+' millisecs';

};
