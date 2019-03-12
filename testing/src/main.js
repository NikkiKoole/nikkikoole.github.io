import * as dat from 'dat.gui';

const app = new PIXI.Application({
    backgroundColor: 0x16a085,
    width: window.innerWidth,
    height: window.innerHeight
});
document.body.appendChild(app.view);

let room1 = {
    rotation: 0,
    type: 1,
    h: 500,
    v: 500,
};

/*

     .......h.........
     v2              .
     .               .
     ....h2.....     v
               .     .
               v1    .
               ...h1..
*/

let room2 = {
    rotation:0,
    type: 2,
    h: 500,
    v: 500,
    h1: 300,
    v1: 200,
    h2: 200,
    v2: 300
};

/*

       .........h..........
       .                  .
       .                  .      v
       ..h1...      ...h2..
             .      .
             v2     v1
             ........
*/


let room3 = {
    rotation:0,
    type: 3,
    h: 500,
    v: 500,
    h1: 100,
    v1: 100,
    h2: 50,
    v2: 50
};

/*
      .........h.........
      .                 .
      .                 .
      .    .........    .
      .    .       .    .
      .    v2      v1   .
      ..h1..       ..h2..
*/

let room4 = {
    rotation:0,
    type: 4,
    h: 500,
    v: 500,
    h1: 100,
    v1: 100,
    h2: 50,
    v2: 50
};

/*

     ..........
     .        .
     .        v1
     .        ...h1..
     .              .
     ..h2.          .
         .          .
         v2         .                        .
         ............
*/

let room5 = {
    rotation:0,
    type: 5,
    h: 500,
    v: 500,
    h1: 100,
    v1: 100,
    h2: 50,
    v2: 50
};



let selected = room5;

function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t;
}

function rotatePoint(point, origin, angle) {
    let sin = Math.sin(angle), cos = Math.cos(angle), dx = point.x - origin.x, dy = point.y - origin.y;
    return {x: origin.x + cos * dx - sin * dy, y: origin.y + sin * dx + cos * dy};
}

function draw(data) {
    let x = 100;
    let y = 100;
    let shape = new PIXI.Graphics();
    shape.lineStyle(10,0);
    let points = [];
    if (data.type == 1) {
        points = [
            {x:x, y:y},
            {x:x+data.h, y:y},
            {x:x+data.h, y:y+data.v},
            {x:x, y:y+data.v},
        ];
    } else if (data.type == 2) {
	    points = [
	        {x: x, y:y},
	        {x: x+data.h, y:y},
	        {x: x+data.h, y:y+data.v},
	        {x: x+data.h-data.h1, y:y+data.v},
	        {x: x+data.h-data.h1, y:y+data.v-data.v1},
	        {x: x+data.h-data.h1-data.h2, y:y+data.v-data.v1},
	    ];
    } else if (data.type == 3) {
        points = [
            {x:x, y:y},
            {x:x+data.h, y:y},
            {x:x+data.h, y:y+data.v - data.v1},
            {x:x+data.h-data.h2, y:y+data.v - data.v1},
            {x:x+data.h-data.h2, y:y+data.v},
            {x:x+data.h1, y:y+data.v},
            {x:x+data.h1, y:y+data.v-data.v2},
            {x:x, y:y+data.v-data.v2},
        ];

    } else if (data.type == 4) {
        let e = data.v - Math.max(data.v1, data.v2);
        points = [
            {x:x, y:y},
            {x:x+data.h, y:y},
            {x:x+data.h, y:y+e+data.v1},
            {x:x+data.h-data.h2, y:y+e+data.v1},
            {x:x+data.h-data.h2, y:y+e},
            {x:x+data.h1, y:y+e},
            {x:x+data.h1, y:y+e+data.v2},
            {x:x, y:y+e+data.v2},
        ];
    } else if (data.type == 5) {
        points = [
            {x:x, y:y},
            {x:x+ data.h - data.h1, y:y},
            {x:x+ data.h - data.h1, y:y+ data.v1},
            {x:x+ data.h, y:y+ data.v1},
            {x:x+ data.h, y:y+ data.v},
            {x:x+ data.h2, y:y+ data.v},
            {x:x+ data.h2, y:y+ data.v - data.v2},
            {x:x, y:y+ data.v - data.v2},

        ];

    }


    points = points.map((p) => rotatePoint(p, {x:x+data.h/2, y:y+data.v/2}, (Math.PI*2)/4 * data.rotation ));

    if (points.length > 0) {
	    shape.moveTo(points[0].x, points[0].y);
	    points.forEach(p => {
	        shape.lineTo(p.x, p.y);
	    });
	    shape.lineTo(points[0].x, points[0].y);
    }
    return shape;
}

const gui = new dat.GUI();

let lastRotation  = 0;
function refresh(name, v) {

    let get_space = (total, other) =>
	    Math.min(total, Math.max(0, total - other));

    if (name == 'rotation') {
        if (v.rotation != lastRotation) {
            console.log('rotation change!', v.rotation);
        }
        lastRotation = v.rotation;
    }

    let hor = {first:'h1', second:'h2', total:'h'};
    let ver = {first:'v1', second:'v2', total:'v'};
    let other = (me, pt) => (pt.first == me ? pt.second : pt.first);

    let takeFromOther = (values) =>  {

	    if (name == values.first || name == values.second) {

            if (v.type <= 2) {
	            if (v[values.first] + v[values.second] != v[values.total]) {
		            v[other(name, values)] =  get_space(v[values.total], v[name]);
	            }
	            if (v[name] > v[values.total]) {
		            v[name] = v[values.total];
	            }
	        }
            if (v.type == 3 || v.type == 4) {
                if (values.total == 'h') {
                    if (v[values.first] + v[values.second] > v[values.total]) {
                        v[name] = v[values.total] - v[other(name, values)];
                    }
                }
                if (values.total == 'v') {
                    if (v[name]  > v[values.total]) {
                        v[name] = v[values.total] ;
                    }
                }
            }
            if (v.type == 5) {
                if (v[name]  > v[values.total]) {
                    v[name] = v[values.total] ;
                }
            }

        }
    };

    let shareOverOthers = (values) => {
	    if (name == values.total) {
            if (v.type <= 2) {
	            if (v[values.total] < v[values.first] + v[values.second]) {
		            v[values.first] = get_space(v[values.total], v[values.second]);
	            }
	            if (v[values.total] < v[values.first] + v[values.second]) {
		            v[values.second] = get_space(v[values.total], v[values.first]);
	            }
	            if (v[values.total] > v[values.first] + v[values.second]) {
		            v[values.first] = get_space(v[values.total], v[values.second]);
	            }

	            if (v[values.second] < 100 && v[values.total] > 0) {
		            v[values.second] = Math.min(100, v[values.total]);
		            v[values.first] = v[values.total] - v[values.second];
	            }
            }
            if (v.type == 3 || v.type == 4) {
                if (values.total == 'h') {
                    if (v[values.total] < v[values.first] + v[values.second]) {
		                v[values.first] = v[values.total] - v[values.second];
                        if (v[values.first] < 0) {
                            v[values.second] += v[values.first] ;
                            v[values.first] = 0;
                        }
	                }
                }
                if (values.total == 'v') {
                    if (v[values.total] < v[values.first]) {
                        v[values.first] = v[values.total];
                    }
                    if (v[values.total] < v[values.second]) {
                        v[values.second] = v[values.total];
                    }
                }
            }
            if (v.type == 5) {
                if (v[values.total] < v[values.first]) {
                    v[values.first] = v[values.total];
                }
                if (v[values.total] < v[values.second]) {
                    v[values.second] = v[values.total];
                }

            }
	    }
    };


    takeFromOther(hor);
    takeFromOther(ver);
    shareOverOthers(hor);
    shareOverOthers(ver);

    for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
    }

    app.stage.removeChildren();

    app.stage.addChild(draw(selected));
}

gui.add(selected, 'rotation').min(0).max(3).step(1.0).onChange(()=> refresh('rotation', selected));
gui.add(selected, 'type', [ 1, 2, 3, 4 ,5 ] ).onChange(()=> refresh('h1', selected));;
gui.add(selected, 'h', 0, 1000).onChange(() => refresh('h', selected));
gui.add(selected, 'v', 0, 1000).onChange(()=>refresh('v', selected));
if (selected.h1) {
    gui.add(selected, 'h1', 0, 1000).onChange(()=>refresh('h1', selected));
    gui.add(selected, 'h2', 0, 1000).onChange(()=>refresh('h2', selected));
    gui.add(selected, 'v1', 0, 1000).onChange(()=>refresh('v1', selected));
    gui.add(selected, 'v2', 0, 1000).onChange(()=>refresh('v2', selected));
}
app.stage.addChild(draw(selected));
