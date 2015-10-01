


var getItemsDoneFeedback = function () {
    var done = 0;
    var children = root.childNodes;
    for(var child in children){
        if (children[child].className === 'todoItemDone') {
            done += 1;
        }
    }

    return ('of a total of '+children.length +' stuffs that need doing, '+ done+' stuffs are marked done.'+deleted_count+' are deleted.');
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
        if (name === 'todoItem') {
            toggled.push('todoItemDone');
        } else if (name === 'todoItemDone') {
            toggled.push('todoItem');
        }
    }
    return toggled;
};

var add_amount = 10;
var todoItem;
var root;
var time_feedback;
var items_done_feedback;
var deleted_count = 0;

window.onload = function() {
    time_feedback =  document.createElement('h1');
    document.body.appendChild(time_feedback);
    items_done_feedback =  document.createElement('h3');
    document.body.appendChild(items_done_feedback);
    todoItem = document.createElement('div');
    todoItem.className = 'todoItem';
    var todoClose = document.createElement('div');
    todoClose.className = 'closeButton out';
    todoItem.appendChild(todoClose);

    var todoMark = document.createElement('div');
    todoMark.className = 'markButton out';
    todoItem.appendChild(todoMark);

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
        if (e.target.className ===  'markButton out') {
            e.target.className =  'markButton over';
        }
    };
    root.onmouseout = function(e){
        if (e.target.className ===  'closeButton over') {
            e.target.className =  'closeButton out';
        }
        if (e.target.className ===  'markButton over') {
            e.target.className =  'markButton out';
        }
    };
    root.onclick = function(e){
        if (e.target.className ===  'closeButton over') {
            //e.target.parentNode.className = "todoItem closed";
            delete_single_item( e.target.parentNode);
            items_done_feedback.innerHTML = getItemsDoneFeedback();
        }
        if (e.target.className ===  'markButton over') {
            //here we set an item to todo or done and NOT delete it
            if (e.target.parentNode.className === 'todoItem') {
                e.target.parentNode.className = 'todoItemDone';
            } else if (e.target.parentNode.className === 'todoItemDone') {
                e.target.parentNode.className = 'todoItem';
            }
            items_done_feedback.innerHTML = getItemsDoneFeedback();
        }

    };
};


var deleteAllItems = function() {
    deleted_count += root.childNodes.length;
    root = root.cloneNode(false);
};

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
        newDiv.childNodes[2].innerHTML = (amountAlreadyHere+i)+ ' Todo: stuff';
        root.appendChild(newDiv);
    }

    items_done_feedback.innerHTML = getItemsDoneFeedback();
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
};

var create200TodoItemsAndToggleFiveTimes = function() {
    var newDiv;
    var amountAlreadyHere = root.childNodes.length;
    var i;
    for (i = 1; i <= add_amount; i++) {
        newDiv = todoItem.cloneNode(true);
        newDiv.childNodes[2].innerHTML = (amountAlreadyHere+i)+ ' Todo: stuff';
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


    items_done_feedback.innerHTML = getItemsDoneFeedback();

};


window.runBenchmark1 = function() {
    var d = new Date();
    var before = d.getTime();
    add_amount = 200;
    create200TodoItems();
    var d2 = new Date();
    var after = d2.getTime();
    time_feedback.innerHTML = 'that took just '+ (after-before)+' millisecs';
    ;
};
window.runBenchmark2 = function() {
    var d = new Date();
    var before = d.getTime();
    add_amount = 200;
    create200TodoItemsAndToggleFiveTimes();
    var d2 = new Date();
    var after = d2.getTime();
    time_feedback.innerHTML = 'that took just '+ (after-before)+' millisecs';

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
    time_feedback.innerHTML = 'that took just '+ (after-before)+' millisecs';

};
