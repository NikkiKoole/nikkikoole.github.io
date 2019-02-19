
var app = new PIXI.Application( {
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: 1,
    antialias: false,
    forceFXAA: false,
    forceCanvas: false,
    autoResize: true,
    transparent: false,
    backgroundColor: 0x2c3e50,
    clearBeforeRender: true,
    preserveDrawingBuffer: false,
    roundPixels: false,
    resolution: devicePixelRatio 
});
document.body.appendChild(app.view);

app.loader
    .add('tex1', 'texture1.jpg')
    .add('tex2', 'texture2.jpg')
    .add('tex3', 'texture3.jpg')
    .load(startup);

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

window.addEventListener('resize', resize);

// Resize function window
function resize() {
	// Resize the renderer
    app.renderer.resize(window.innerWidth, window.innerHeight);
    
}
resize();


function startup() {
    let myArray = ['tex1',  'tex2', 'tex3'];
    let t = myArray[Math.floor(Math.random() * myArray.length)];
    let tex = app.loader.resources[t].texture;
    tex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    tex.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    
    let poly = new PIXI.Graphics();
    let scale = Math.random() *  1;
    let angle = Math.random() * Math.PI * 2;
    let color = Math.random() * 0xffffff;
    let matrix = new PIXI.Matrix(1,0,0,1,0,0).scale(scale, scale).rotate(angle);
    poly.beginTextureFill(tex, color, 1.0, matrix);
    poly.drawPolygon([100,100, 800,100, 800,800, 100, 1000])
    poly.endFill();
    app.stage.addChild(poly);

    app.ticker.add((delta) => {
	stats.begin();

	poly.clear();
	let scale = Math.random() * 2;
	let angle = Math.random() * Math.PI * 2;
	let color = Math.random() * 0xffffff;
	let matrix = new PIXI.Matrix(1,0,0,1,0,0).scale(scale, scale).rotate(angle);
	poly.beginTextureFill(tex, color, 1.0, matrix);
	poly.drawPolygon([100,100, 800,100, 800,800, 100, 1000])
	poly.endFill();

	stats.end();
    });


    
}
