


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
};

var create200TodoItems = function(callback){
    var newDiv;
    var amountAlreadyHere = root.childNodes.length;
    for (var i = 1; i <= add_amount; i++) {
        newDiv = todoItem.cloneNode(true);
        newDiv.childNodes[1].innerHTML = (amountAlreadyHere+i)+ ' Todo: stuff';
        newDiv.childNodes[0].onmouseover = function(e) {
            e.target.className = 'closeButton over';
        };
        newDiv.childNodes[0].onmouseout = function(e) {
            e.target.className = 'closeButton out';
        };
        newDiv.childNodes[0].onclick = function(e) {
            console.log(e.target.parentNode.className = "todoItem closed");
            items_done_feedback.innerHTML = getItemsDoneFeedback();
        };
        root.appendChild(newDiv);
    }
    items_done_feedback.innerHTML = getItemsDoneFeedback();
    callback();
};


var create200TodoItemsAndToggleFiveTimes = function(callback) {
    var newDiv;
    var amountAlreadyHere = root.childNodes.length;
    for (var i = 1; i <= add_amount; i++) {
        newDiv = todoItem.cloneNode(true);
        newDiv.childNodes[1].innerHTML = (amountAlreadyHere+i)+ ' Todo: stuff';
        newDiv.childNodes[0].onmouseover = function(e) {
            e.target.className = 'closeButton over';
        };
        newDiv.childNodes[0].onmouseout = function(e) {
            e.target.className = 'closeButton out';
        };
        newDiv.childNodes[0].onclick = function(e) {
            console.log(e.target.parentNode.className = "todoItem closed");
            items_done_feedback.innerHTML = getItemsDoneFeedback();
        };
        root.appendChild(newDiv);
    }


    toggleAll();
    toggleAll();
    toggleAll();
    toggleAll();
    toggleAll();

    items_done_feedback.innerHTML = getItemsDoneFeedback();
    callback();

};


window.runBenchmark1 = function() {
    var d = new Date();
    var before = d.getTime();
    create200TodoItems(function() {
        var d2 = new Date();
        var after = d2.getTime();
        time_feedback.innerHTML = 'that took just '+ (after-before)+' millisecs';
    });

};
window.runBenchmark2 = function() {
    var d = new Date();
    var before = d.getTime();
    create200TodoItemsAndToggleFiveTimes(function() {
        var d2 = new Date();
        var after = d2.getTime();
        time_feedback.innerHTML = 'that took just '+ (after-before)+' millisecs';
    });

};
