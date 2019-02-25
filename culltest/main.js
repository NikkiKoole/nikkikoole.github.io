
var app = new PIXI.Application( {
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffaaaa,
    antialias: true,
    legacy: true
});
document.body.appendChild(app.view);

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

let options = {
    screenWidth: app.view.offsetWidth,
    screenHeight: app.view.offsetHeight,
    worldWidth: 100000,
    worldHeight: 100000,
    interaction: app.renderer.plugins.interaction 
};
var view = new PIXI.extras.Viewport(options);
app.stage.addChild(view);

let labels = new PIXI.Container();
view.addChild(labels);
let furni = new PIXI.Container();
view.addChild(furni);
let bounds = new PIXI.Container();
view.addChild(bounds);
let text = new PIXI.Text('loading',{fontFamily : 'Arial', dropShadow:true, dropShadowDistance:2, fontSize: 24, fill : 0xaaaaaa, align : 'center'});
text.x = window.innerWidth/2
app.stage.addChild(text);

view
    .drag()
    .pinch()
    .wheel()
    .decelerate()

let items = ["da/dab83fe8fcce2238e8a77bd7d6ca1fabc95eb282_03.top.x3.png","36/3654530373b5ad1d44f2d1e4388d52cd816995e5_06.top.x3.png","41/418d1de8423f9438418fad1cbee881bd5c975709_03.front.x3.png","8c/8c297387b65b2ab225740383572f1dba79859791_04.top.x3.png","c9/c944fc1408d2bc5c5ed7e6022fa65678f46ba6cd_01.top.x3.png"]

items.forEach((url) =>{
    let u = 'https://d1g6u5sj133j06.cloudfront.net/cdb/renders/'+url;
    app.loader.add(u);
})

app.loader
    .add('arial', 'arial-resx5s.fnt')
    .load(start)

var cull = new PIXI.extras.Cull.Simple();

function makeString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:|<>?,./;'\[]-=";
    for (var i = 0; i < 5 + Math.random() * 2; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function boundsGraphic(item) {
    let b = item.getBounds();
    let g = new PIXI.Graphics();
    g.beginFill(0xff0000, 0.3);
    g.drawRect(b.x, b.y, b.width, b.height);
    g.endFill()
    return g;
}

function start() {
    for (let i = 0; i < 500; i++) {
    	let text = new PIXI.BitmapText(makeString() , {font: Math.floor(20+Math.random()*20)+"px Arial"});
    	text.tint = Math.random() * 0xffffff;
    	text.position.set(-15000 + Math.random()*30000, -15000 + Math.random()*30000)
    	text.rotation = Math.random() * 2 * Math.PI;
	labels.addChild(text);
	let graphic = boundsGraphic(text);
	bounds.addChild(graphic);

    }
    let keys = Object.keys(PIXI.utils.TextureCache)

    for (let i =0; i<5000; i++) {
	let url = keys[Math.floor(1 + (keys.length-1) * Math.random())];
	if (url != './arial-resx5s.png') {
	    let sprite = new PIXI.Sprite.from(url);
	    sprite.position.set(-15000 + Math.random()*30000, -15000 + Math.random()*30000);
	    sprite.rotation = Math.random() * Math.PI*2;
	    furni.addChild(sprite);
	    let graphic = boundsGraphic(sprite);
	    bounds.addChild(graphic);
	}
    }

    furni.children.sort((a,b) => a._texture.textureCacheIds[0] < b._texture.textureCacheIds[0] ? -1 : 1 );
    cull.addList(labels.children);
    cull.addList(furni.children);
    cull.addList(bounds.children);

    cull.cull(view.getVisibleBounds());

     app.ticker.add((delta) => {
	stats.begin();
	if (view.dirty)
	{
            cull.cull(view.getVisibleBounds());
	    let s = (cull.stats())
	    text.text = `rendering ${s.visible} of ${s.total}`;
            view.dirty = false;
	}
	stats.end()
    });

}

