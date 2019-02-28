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
    worldWidth: 1000,
    worldHeight: 1000,
    smooth: 5,
    interaction: app.renderer.plugins.interaction 
};
var view = new PIXI.extras.Viewport(options);
app.stage.addChild(view);


let areas = new PIXI.Container();
view.addChild(areas);
let furni = new PIXI.Container();
view.addChild(furni);
let labels = new PIXI.Container();
view.addChild(labels);
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



furni_urls.forEach((url) =>{
    let u = 'https://d1g6u5sj133j06.cloudfront.net/cdb/renders/'+url;
    app.loader.add(u);
})
//
let area_urls = ["/70/floor_and_wall/original/flooring_tiles_white.jpg", "/70/…and_wall/original/LINE_109A_2_OFF_WHITE_40X80.jpg", "/70/floor_and_wall/original/Casual_Wood_tan.jpg", "/70/floor_and_wall/original/WoodPlanksBare0335_1_S.jpg", "/70/floor_and_wall/original/MD_Finish_4.jpg", "/70/…nal/B422_mursten_Stroejer-Tegl_kryds-graahvid.jpg", "/70/floor_and_wall/original/W_DB_UK3054_alderwood.jpg", "/70/floor_and_wall/original/W_MK_Ukr3105.jpg", "/70/floor_and_wall/original/WP_al_Ukr0482.jpg", "/70/floor_and_wall/original/7078253.jpg", "/70/…oor_and_wall/original/BrickGroutless0048_12_M.jpg", "/70/floor_and_wall/original/ConcreteRough0092_1_S.jpg", "/70/floor_and_wall/original/WP_al_Ukr0187__.jpg", "/70/floor_and_wall/original/231657935.jpg", "/70/…_and_wall/original/61871_19487__06122012_1653.jpg", "/70/floor_and_wall/original/WP_al_Ukr0385.jpg", "/70/floor_and_wall/original/MetalFloorsBare0037.jpg"]
area_urls.forEach(url => {
    let u = 'https://s3-eu-west-1.amazonaws.com/mb.textures'+url;
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
    g.beginFill(0xff0000, 0.1);
    g.drawRect(b.x, b.y, b.width, b.height);
    g.endFill()
    return g;
}
function generatePolygonPoints(size) {
    var x = [0];
    var y = [0];
    var r = 0;
    var angle = 0
    for (var i = 1; i < 20; i++) {
	angle += 0.3 + Math.random() * 0.3
	if (angle > 2 * Math.PI) {
	    break; //stop before it becomes convex
	} 
	r = ( size/10 + Math.random() * size)
	x.push(x[i - 1] + r * Math.cos(angle));
	y.push(y[i - 1] + r * Math.sin(angle));
    }
    let result = [];
    for (let i =0; i< x.length; i++) {
	result.push(x[i]);
	result.push(y[i]);
    }
    return result;
}
function generatePolygon(url) {
    let p = generatePolygonPoints(500 + Math.random()*1000);
    //let textures = ['tex1','tex2','tex3','tex4','tex5','tex6','tex7','tex8','tex9','tex10','tex11','tex12','tex13','tex14','tex15','tex16'];
    
    let tex = app.loader.resources[url].texture;
    tex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    tex.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    
    let poly = new PIXI.Graphics();
    let scale = .5 + Math.random();
    let angle = Math.random() * Math.PI * 2;
    let color = 0xffffff;//Math.random() * 0xffffff;
    let alpha = 0.5 + Math.random()*0.5
    let matrix = new PIXI.Matrix(1,0,0,1,0,0).scale(scale , scale ).rotate(angle);
    poly.beginTextureFill(tex, color, 1.0, matrix);
    poly.drawPolygon(p)
    poly.endFill();
    poly.originalAlpha = alpha;
    poly.alpha = alpha;
    //poly.hitArea = new PIXI.Polygon(p);
    return poly;
}
function start() {
    let world_size = 100000
    for (let i = 0; i < 500; i++) {
    	let text = new PIXI.BitmapText(makeString() , {font: Math.floor(20+Math.random()*20)+"px Arial"});
    	text.tint = Math.random() * 0xffffff;
    	text.position.set(-world_size/2 + Math.random()*world_size, -world_size/1 + Math.random()*world_size)
    	//text.rotation = Math.random() * 2 * Math.PI;
	labels.addChild(text);
	//let graphic = boundsGraphic(text);
	//bounds.addChild(graphic);

    }

    for (let i = 0; i<650; i++) {
	//let url = area_urls[Math.floor(area_urls.length * Math.random())];
	//url = 'https://s3-eu-west-1.amazonaws.com/mb.textures'+url;
	//console.log(url)
	let url =  'https://s3-eu-west-1.amazonaws.com/mb.textures' +
	    area_urls[Math.floor(Math.random() * area_urls.length)];
	let poly = generatePolygon(url);
	poly.x = Math.random() * world_size - world_size/2;
	poly.y = Math.random() * world_size - world_size/2;
	areas.addChild(poly);
    }
    
    let keys = Object.keys(PIXI.utils.TextureCache)

    for (let i =0; i<25000; i++) {
	let url = keys[Math.floor(1 + (keys.length-1) * Math.random())];
	if (url != './arial-resx5s.png') {
	    let container = new PIXI.Container()
	    let sprite = new PIXI.Sprite.from(url);
	    sprite.position.set(-world_size/2 + Math.random()*world_size, -world_size/2 + Math.random()*world_size);
	    //console.log(sprite.width, sprite.height)
	    sprite.rotation = Math.random() * Math.PI*2;

//	    container.addChild(sprite);
	    
	    furni.addChild(sprite);
	    //furni.addChild(container);
	    //let graphic = boundsGraphic(sprite);
	    //bounds.addChild(graphic);
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

