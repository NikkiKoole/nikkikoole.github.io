// start with vec2 functions
// begin with line/segment collision

var vec2 = function(X, Y){
    return {X:X, Y:Y};
};

var vec2_add = function(A, B) {
    return vec2(A.X+B.X, A.Y+B.Y);
};

var vec2_sub = function(A, B) {
    return vec2(A.X-B.X, A.Y-B.Y);
};

var vec2_mul_scalar = function(A, B) {
    return vec2(A.X*B, A.Y*B);
}

var vec2_multiply = function(A, B) {
    return vec2(A.X*B.X, A.Y*B.Y);
};

var vec2_square = function(A) {
    return vec2_multiply(A,A);
};

var inner = function(A, B) {
    return A.X*B.X + A.Y*B.Y;
};

var length_sq = function(A) {
    return inner(A,A);
};

var renderer;
var stage;
var actor;

var tilemap;


var buildTilemap = function() {
    var world_height = 16;
    var world_width = 16;
    tilemap = new Array(world_height);
    for (var y = 0; y < world_height; y++) {
        tilemap[y] = new Array(world_width);
        for (var x = 0; x< world_width; x++) {
            tilemap[y][x] = 0;
        }
    }

    //   ........................
    //   .                      .
    //   .                      .
    //   ........................

    for (var i = 0; i < world_width; i++) {
        tilemap[0][i] = 1;
        tilemap[world_height-1][i] = 1;
    }
    for (var j = 0; j < world_height; j++) {
        tilemap[j][0] = 1;
        tilemap[j][world_width-1] = 1;
    }
};

var drawTilemap = function() {
    for (var y = 0; y < 16; y++) {
        for (var x = 0; x < 16; x++) {
            if (tilemap[y][x] == 1) {
                var tile= new PIXI.Container();
                var graphic = new PIXI.Graphics();
                graphic.beginFill(0xff0000);
                graphic.lineStyle(1, 0xffffff);
                graphic.drawRect(0,0,window.innerWidth/16, window.innerHeight/16);
                tile.addChild(graphic);
                tile.position = {x:x * window.innerWidth/16 , y:y* window.innerHeight/16};
                console.log(tile);
                stage.addChild(tile);
            }
        }
    }
}

var onLoad = function() {
    // buildTilemap();
    // renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {antialias:true});
    // document.body.appendChild(renderer.view);
    // stage = new PIXI.Container();
    // actor = new PIXI.Container();
    // var g = new PIXI.Graphics();
    // drawTilemap();
    // g.beginFill(0xff0000);
    // g.drawCircle(0,0,100);
    // g.beginFill(0xffff00);
    // g.drawCircle(0,0,5);
    // actor.addChild(g);
    // actor.velocity = vec2(0,0);
    // actor.acceleration = vec2(0,0);
    // actor.position = {x:200,y:100};
    // stage.addChild(actor);
    // renderer.render(stage);
    // updateStatus();

    var xhttp = new XMLHttpRequest();
    var query = JSON.stringify({_source: true, filter: {bool: {must: [{term: {class_name: 'wood'}}]}}});
    console.log(query);
    //"Content-Type: application/json"

    xhttp.open("POST", " http://search.roomstyler.com/materials/material/_search");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(query);

};

var PIXELS_PER_METER = 16;
var MAX_ACCELERATION = 30;



var updateActor = function(input, time, buttons) {
    if (Math.abs(input.X) < 0.2) {input.X = 0;}
    if (Math.abs(input.Y) < 0.2) {input.Y = 0;}

    for (var b in buttons) {
        if (buttons[b].pressed == true && b < 6) {

            var cont = new PIXI.Container();
            var circle = new PIXI.Graphics();
            circle.beginFill(0xffffff*Math.random());
            circle.drawCircle(0,0, 100*Math.random());
            cont.addChild(circle);
            cont.position = {x:Math.random()*100, y:Math.random()*100};
            actor.addChild(cont);
            if (actor.children.length > 10) {
            actor.removeChildAt(0);
                }
        }
    }


    if (time) {
        actor.acceleration = vec2_mul_scalar(input, (PIXELS_PER_METER * MAX_ACCELERATION));
        actor.velocity = vec2_add(vec2_mul_scalar(actor.acceleration, time), actor.velocity);
        actor.position.x += actor.velocity.X * time;
        actor.position.y += actor.velocity.Y * time;
        actor.velocity = vec2_mul_scalar(actor.velocity, 0.75);

    }
};

var lastTime = undefined;
var dt;
var updateStatus = function(time) {
    dt = time - lastTime;
    lastTime = time;
    var controllers = navigator.getGamepads();
    //console.log(controllers[0].buttons);

    if (controllers[0]){
        var input = vec2(controllers[0].axes[0], controllers[0].axes[1]);
        updateActor(input, 1.0/dt,controllers[0].buttons);
    }
    renderer.render(stage);
    requestAnimationFrame(updateStatus);
};


window.addEventListener("load", onLoad);
