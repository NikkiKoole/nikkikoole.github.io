import {DropShadowFilter} from '@pixi/filter-drop-shadow';
import {AsciiFilter} from '@pixi/filter-ascii'; 
import {OutlineFilter} from '@pixi/filter-outline';
import {EmbossFilter} from '@pixi/filter-emboss';
import {GlowFilter} from '@pixi/filter-glow';
import {AdjustmentFilter} from '@pixi/filter-adjustment';
import * as dat from 'dat.gui';
const gui = new dat.GUI();

let mainFolder = undefined;
buildGui()


function buildGui(elem) {
    mainFolder = gui.addFolder('element')
    if (elem) {
	mainFolder.open();
	elem.myFilters.forEach((v, i)=>{
	    let keys = Object.keys(v);
	    let f = mainFolder.addFolder(v.type)
	    let change = (k) =>{
		keys.forEach((kk)=>{
		    elem.filters[i][kk] = v[kk];
		})
	    }
	    keys.forEach(k =>{
		if (k == 'type') {
		}else if (k == 'color') {
		    f.addColor(v, k).onChange(change);
		} else if (k == 'alpha' || k == 'quality' || k == 'red' || k == 'green' ||k == 'blue' ) {
		    f.add(v, k, 0, 1.0).onChange(change);
		} else if (k == 'shadowOnly') {
		    f.add(v,k, 0,1).onChange(change);
		} else {
		    f.add(v,k, 0,20).onChange(change);
		}
	    })
	    f.open();
	})
    }
}

function refreshGui(elem) {
    gui.removeFolder(mainFolder)
    buildGui(elem)
}


const app = new PIXI.Application({
    backgroundColor: 0x16a085,
    width: window.innerWidth,
    height: window.innerHeight
});
document.body.appendChild(app.view);


window.addEventListener('resize', () => {
    app.renderer.resize(
	window.innerWidth,
	window.innerHeight
    )
});
let base = 'https://d1g6u5sj133j06.cloudfront.net/cdb/renders/';
let furnis = ['70/70f6b964dbc88d1f688a4e3bcf5476372d5f6f29_01.top.x3.png',
	     '09/09045332b181730cb3fd8b70957e16084eebbfba_01.top.x3.png',
	     "be/be8b40e004ff6634450ca71d2f9bfdbdf94de306_00.top.x3.png",
	     "95/958b2b2572ebb43a525c6993a754d92a50d4c889_01.top.x3.png",
	     "04/04829c6aec40331f16a4819f5da09250fbcba1ec_01.top.x3.png",
	     "f6/f67d3df0f6f8ce0ce6d43d6f6e0ab4b093ee392f_02.top.x3.png",
	     "53/53c9fa8ea89e5dd44a3a75ee436e2f67ed1b41fc_02.top.x3.png",
	     "8a/8a643866e25ff2687ae34a7285e1927fed1205d3_01.front.x3.png",
	     "1d/1d438cf2a0be5706ffdbd1489fbfb27f712589a0_01.front.x3.png",
	     "73/73cae0c00c31e895cbf8c6ac2bcc3ce718d03b21_01.top.x3.png",
	     "b8/b81bee4e4ef1682295bc9179f392cb68bc15f736_02.top.x3.png",
	     "30/3060a8d709671e65252774acb499e90084bf3292_02.top.x3.png",
	     "b7/b728cc955a2446b78b59de9f4ca49a986dc6528f_00.front.x3.png"]
let items = new PIXI.Container();

let selectedItem = undefined;

function spriteClick(e) {
    selectedItem = e.currentTarget;
    refreshGui(selectedItem);
}

function createSprite(url_) {
    let sprite = new PIXI.Sprite.from(url_);
    sprite.interactive = true;
    sprite.on('click', spriteClick) ;
    return sprite;
}
function prepareFilters(parent) {
    parent.filters = [];
    parent.myFilters.forEach(f =>{
	let r = {}
	if (f.type == 'glow') {
	    r = new GlowFilter(f.distance, f.outerStrength, f.innerStrength, f.color);
	} else if (f.type == 'drop') {
	    r = new DropShadowFilter(f)
	} else if (f.type == 'outline') {
	    r = new OutlineFilter(f.thickness, f.color, f.quality)
	} else if (f.type == 'adjustment') {
	    r = new AdjustmentFilter(f);
	}
	
	parent.filters.push(r);
    })
}

for (let i = 0; i<10 ; i++) {
    let url = base + furnis[Math.floor(Math.random()*furnis.length)];
    console.log(url);
    let sprite = createSprite(url);
    sprite.myFilters = [
	{type:'adjustment', gamma:1, contrast:1, brightness:1, red:1.0, green:1.0, blue:1.0, alpha:1.0},
	{type:'glow', distance: 1, outerStrength: 1, innerStrength: 0, color: 0},
	{type:'drop', color:0xeeddee, shadowOnly:false, alpha:1, blur:2, pixelSize:1},
	{type:'outline', thickness:2, color:0x000000, quality:0.1}
    ];
    prepareFilters(sprite);
    items.addChild(sprite);
    sprite.position.set(Math.random()*window.innerWidth, Math.random()*window.innerHeight);
    
}

app.stage.addChild(items);



