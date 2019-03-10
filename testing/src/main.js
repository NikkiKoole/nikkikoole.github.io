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
    rotation:0,
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
	]
	shape.moveTo(points[0].x, points[0].y);
	points.forEach(p => {
	    shape.lineTo(p.x, p.y);
	})
	shape.lineTo(points[0].x, points[0].y);

    }
    
    
    return shape;
}

const gui = new dat.GUI();

function refresh(name, v) {
    
    let get_space = (total, other) =>
	Math.min(total, Math.max(0, total - other))

    if (name == 'rotation') {
	console.log('pch')
    }

    let hor = {first:'hor1', second:'hor2', total:'width'};
    let ver = {first:'ver1', second:'ver2', total:'height'};
    let other = (me, pt) => (pt.first == me ? pt.second : pt.first)

    let takeFromOther = (values) =>  {
	if (name == values.first || name == values.second) {
	    if (v[values.first] + v[values.second] != v[values.total]) {
		v[other(name, values)] =  get_space(v[values.total], v[name])
	    }
	    if (v[name] > v[values.total]) {
		v[name] = v[values.total];
	    }
	}
    }
    let shareOverOthers = (values) => {
	if (name == values.total) {
	    if (v[values.total] < v[values.first] + v[values.second]) {
		v[values.first] = get_space(v[values.total], v[values.second])
	    }
	    if (v[values.total] < v[values.first] + v[values.second]) {
		v[values.second] = get_space(v[values.total], v[values.first])
	    }
	    if (v[values.total] > v[values.first] + v[values.second]) {
		v[values.first] = get_space(v[values.total], v[values.second])
	    }

	    if (v[values.second] < 100 && v[values.total] > 0) {
		v[values.second] = Math.min(100, v[values.total])
		v[values.first] = v[values.total] - v[values.second]
	    }
	}
    }

    
    takeFromOther(hor);
    takeFromOther(ver);
    shareOverOthers(hor)
    shareOverOthers(ver)


    
   
    
    for (var i in gui.__controllers) {
    gui.__controllers[i].updateDisplay();
    }

    app.stage.removeChildren();
    
    app.stage.addChild(draw(room2));
}

//function rotatePlan()



gui.add(room2, 'rotation').min(0).max(3).step(1.0).onChange(()=> refresh('rotation', room2))
gui.add(room2, 'width', 0, 1000).onChange(() => refresh('width', room2))
gui.add(room2, 'height', 0, 1000).onChange(()=>refresh('height', room2))
gui.add(room2, 'hor1', 0, 1000).onChange(()=>refresh('hor1', room2))
gui.add(room2, 'hor2', 0, 1000).onChange(()=>refresh('hor2', room2))
gui.add(room2, 'ver1', 0, 1000).onChange(()=>refresh('ver1', room2))
gui.add(room2, 'ver2', 0, 1000).onChange(()=>refresh('ver2', room2))



app.stage.addChild(draw(room2));
