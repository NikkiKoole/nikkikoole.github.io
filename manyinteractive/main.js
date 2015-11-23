var renderer;
var stage;

var onLoad = function() {
    renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {backgroundColor : 0x1099bb});
    document.body.appendChild(renderer.view);
    stage = new PIXI.Container();
    addItems();
    animate();
}

function addItems() {
    var thing = new PIXI.Graphics();
    thing.beginFill(0xffffff);
    thing.drawRect(0,0,20,20);

    for (var i = 0; i < 2500; i++) {
        var sprite = new PIXI.Sprite(thing.generateTexture());
        sprite.tint = 0xffffff * Math.random();
        sprite.interactive = true;
        sprite.anchor = {x:0.5, y:0.5};
        sprite.position = {x:window.innerWidth*Math.random(), y: window.innerHeight*Math.random()};
        sprite.rotation = (Math.PI*2) * Math.random();
        sprite.scale = {x:0.5+Math.random()*2, y:0.5+Math.random()*2};
        sprite.on("mouseover", (e)=>{
            e.target.tint = 0xffffff * Math.random();
        });
        sprite.on("click", (e)=>{
            e.target.rotation = (Math.PI*2) * Math.random();
        });
        stage.addChild(sprite);
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}


window.addEventListener("load", onLoad);
