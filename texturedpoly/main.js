
var app = new PIXI.Application( {
    width: window.innerWidth,
    height: window.innerHeight,
});
document.body.appendChild(app.view);

let options = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1000,
    worldHeight: 1000,
    interaction: app.renderer.plugins.interaction // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled
};
var view = new PIXI.extras.Viewport(options);
app.stage.addChild(view);

// activate plugins
view
    .drag()
    .pinch()
    .wheel()
    .decelerate();


app.loader
    .add('tex1', 'assets/teapotsP.jpg')
    .add('tex2', 'assets/mcb9c5e538809d9147b7d3b95be5488887ae7b7c3P.jpg')
    .add('tex3', 'assets/featurewall16P.jpg')
    .add('tex4', 'assets/TilesOrnate0158_2_SP.jpg')
    .add('tex5',  'assets/SAND_DIFFUSEP.jpg')
    .add('tex6',  'assets/ProCasa-604mP.jpg')
    .add('tex7',  'assets/Moss0231_1_SP.jpg')
    .add('tex8',  'assets/MWB_ConsequenceP.jpg')
    .add('tex9',  'assets/Ivy0070_7_SP.jpg')
    .add('tex10', 'assets/ITC_Merbau_DIFFUSEP.jpg')
    .add('tex11', 'assets/Grass0130_2_SP.jpg')
    .add('tex12', 'assets/ConcreteStucco0146P.jpg')
    .add('tex13', 'assets/Brickwork3_120P.jpg')
    .add('tex14', 'assets/BARKP.jpg')
    .add('tex15', 'assets/B543_mursten_Stroejer-Tegl_kryds-antracitP.jpg')
    .add('tex16', 'assets/B422_mursten_Stroejer-Tegl_kryds-graahvidP.jpg')
    .load(startup);

let tscale = {
    tex1:{x:0.818359375, y:0.84375},
    tex2:{x:0.8828125, y:0.853515625},
    tex3:{x:1, y:0.9921875},
    tex4:{x:0.68359375, y:0.68359375},
    tex5:{x:1, y:1},
    tex6:{x:0.73828125, y:0.7431640625},
    tex7:{x:0.68359375, y:0.68359375},
    tex8:{x:0.515625, y:0.515625},
    tex9:{x:0.625, y:0.625},
    tex10:{x:1, y:1},
    tex11:{x:0.68359375, y:0.68359375},
    tex12:{x:0.68359375, y:0.68359375},
    tex13:{x:0.76171875, y:0.603515625},
    tex14:{x:0.9375, y:0.625},
    tex15:{x:1, y:0.71630859375},
    tex16:{x:1, y:0.71630859375},
}

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

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

function generatePolygon() {
    let p = generatePolygonPoints(500 + Math.random()*1000);
    let textures = ['tex1','tex2','tex3','tex4','tex5','tex6','tex7','tex8','tex9','tex10','tex11','tex12','tex13','tex14','tex15','tex16'];
    let t = textures[Math.floor(Math.random() * textures.length)];
    let tex = app.loader.resources[t].texture;
    tex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    tex.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    
    let poly = new PIXI.Graphics();
    let scale = .5 + Math.random();
    let angle = Math.random() * Math.PI * 2;
    let color = 0xffffff;//Math.random() * 0xffffff;
    let alpha = 0.5 + Math.random()*0.5
    let matrix = new PIXI.Matrix(1,0,0,1,0,0).scale(scale * tscale[t].x, scale * tscale[t].y ).rotate(angle);
    poly.beginTextureFill(tex, color, 1.0, matrix);
    poly.drawPolygon(p)
    poly.endFill();
    poly.originalAlpha = alpha;
    poly.alpha = alpha;
    poly.hitArea = new PIXI.Polygon(p);
    return poly;
}

function startup() {

    for (let i =0 ; i< 1000; i++) {
	let poly = generatePolygon();
	poly.x = -(window.innerWidth * 15)  + Math.random() * window.innerWidth * 30;
	poly.y = -(window.innerHeight * 15) + Math.random() * window.innerHeight * 30;
	poly.scale = {x:0.5, y:0.5}
	poly.interactive = true;
	
	poly.on('mouseover', ()=> {
	    poly.alpha = 1;
	})
	poly.on('mouseout', ()=> {
	    poly.alpha = poly.originalAlpha
	})

	view.addChild(poly);
    }

    app.ticker.add((delta) => {
	stats.begin();
	stats.end()
    });
}
