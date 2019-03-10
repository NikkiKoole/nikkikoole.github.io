import * as dat from 'dat.gui';

const app = new PIXI.Application({
    backgroundColor: 0x16a085,
    width: window.innerWidth,
    height: window.innerHeight
});
document.body.appendChild(app.view);

let room1 = {
    type: 1,
    width: 500,
    height: 500,
};
	      
///  ...........
//   .	       D
//   .	...C....
//   .	B     
//   .A..     
let room2 = {
    type: 2,
    width: 500,
    height: 500,
    hor1: 100, //a
    ver1: 100, //b
    hor2: 400, //c
    ver2: 400 //d
}	       	 

function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}

function draw(data) {
    let x = 100;
    let y = 100;
    let shape = new PIXI.Graphics();
    shape.lineStyle(10,0);
    let points = [];

    
    if (data.type == 1) {
	shape.moveTo(x, y);
	shape.lineTo(x+data.width, y);
	shape.lineTo(x+data.width, y+data.height);
	shape.lineTo(x, y+data.height);
	shape.lineTo(x,y);
    } else if (data.type == 2) {
	points = [
	    {x: x, y:y},
	    {x: x+data.width, y:y},
	    {x: x+data.width, y:y+data.height},
	    {x: x+data.width-data.hor1, y:y+data.height},
	    {x: x+data.width-data.hor1, y:y+data.height-data.ver1},
	    {x: x+data.width-data.hor1-data.hor2, y:y+data.height-data.ver1},
	    {x: x, y:y},

	    {x: x+data.width-data.hor1-data.hor2, y:y+data.height-data.ver1-data.ver2},
	]
	//console.log(points);
	
	shape.moveTo(points[0].x, points[0].y);
	points.forEach(p => {
	    shape.lineTo(p.x, p.y);

	})

    }
    
    
    return shape;
}

const gui = new dat.GUI();

function refresh(name, v) {

    
    if (name == 'hor1') {
	// change the other
	if (v.hor1 + v.hor2 < v.width) {
	    v.hor2 = Math.min(v.width, Math.max(0, v.width - v.hor1))
	}
	if (v.hor1 + v.hor2 > v.width) {
	    v.hor2 = Math.min(v.width, Math.max(0, v.width - v.hor1))
	}
	//change myself
	if (v.hor1 > v.width) {
	    v.hor1 = v.width;
	}
    }
    if (name == 'hor2') {
	// change the other
	if (v.hor1 + v.hor2 < v.width) {
	    v.hor1 = Math.min(v.width, Math.max(0, v.width - v.hor2))
	}
	if (v.hor1 + v.hor2 > v.width) {
	    v.hor1 = Math.min(v.width, Math.max(0, v.width - v.hor2))
	}
	//change myself
	if (v.hor2 > v.width) {
	    v.hor2 = v.width;
	}
    }
    if (name == 'ver1') {
	// change the other
	if (v.ver1 + v.ver2 < v.height) {
	    v.ver2 = Math.min(v.height, Math.max(0, v.height - v.ver1))
	}
	if (v.ver1 + v.ver2 > v.height) {
	    v.ver2 = Math.min(v.height, Math.max(0, v.height - v.ver1))
	}
	//change myself
	if (v.ver1 > v.height) {
	    v.ver1 = v.height;
	}
    }
    if (name == 'ver2') {
	// change the other
	if (v.ver1 + v.ver2 < v.height) {
	    v.ver1 = Math.min(v.height, Math.max(0, v.height - v.ver2))
	}
	if (v.ver1 + v.ver2 > v.height) {
	    v.ver1 = Math.min(v.height, Math.max(0, v.height - v.ver2))
	}
	//change myself
	if (v.ver2 > v.height) {
	    v.ver2 = v.height;
	}
    }
    if (name == 'width') {
	// change the other
	if (v.width < v.hor1 + v.hor2) {
	    v.hor1 = Math.min(v.width, Math.max(0, v.width - v.hor2))
	}
	if (v.width < v.hor1 + v.hor2) {
	    v.hor2 = Math.min(v.width, Math.max(0, v.width - v.hor1))
	}

	
	if (v.width > v.hor1 + v.hor2) {
	    v.hor1 = Math.min(v.width, Math.max(0, v.width - v.hor2))
	}
	// NOTE
	// hor2 will not grow like this
	// maybe a minimum
	if (v.hor2 < 100 && v.width > 0) {
	    v.hor2 = Math.min(100, v.width);
	    v.hor1 = v.width-v.hor2;
	}

    }
     if (name == 'height') {
	// change the other
	if (v.height < v.ver1 + v.ver2) {
	    v.ver1 = Math.min(v.height, Math.max(0, v.height - v.ver2))
	}
	if (v.height < v.ver1 + v.ver2) {
	    v.ver2 = Math.min(v.height, Math.max(0, v.height - v.ver1))
	}

	
	if (v.height > v.ver1 + v.ver2) {
	    v.ver1 = Math.min(v.height, Math.max(0, v.height - v.ver2))
	}
	// NOTE
	// ver2 will not grow like this
	// maybe a minimum
	 if (v.ver2 < 100 && v.height > 0) {
	    v.ver2 = Math.min( 100, v.height);
	    v.ver1 = v.height-v.ver2;
	}

    }
    
    
    
    for (var i in gui.__controllers) {
    gui.__controllers[i].updateDisplay();
    }
    app.stage.removeChildren();
    app.stage.addChild(draw(room2));
}

gui.add(room2, 'width', 0, 1000).onChange(() => refresh('width', room2))
gui.add(room2, 'height', 0, 1000).onChange(()=>refresh('height', room2))
gui.add(room2, 'hor1', 0, 1000).onChange(()=>refresh('hor1', room2))
gui.add(room2, 'hor2', 0, 1000).onChange(()=>refresh('hor2', room2))
gui.add(room2, 'ver1', 0, 1000).onChange(()=>refresh('ver1', room2))
gui.add(room2, 'ver2', 0, 1000).onChange(()=>refresh('ver2', room2))



app.stage.addChild(draw(room2));
