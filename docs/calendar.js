const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const dayNames = ["zo", "ma", "di", "wo", "do", "vr", "za"]

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

// you feed it a list of deadlines, and a current Date
// then you can toggle and look to older/newer months
// the thing that isnt working right now:
// you cant have an array of deadlines, i would want to toggel calendar to other months

function buildCalendar(deadlines, date) {

    function getDaysUntilNextDeadLine(){
        // given an array of deadlines get the closest one in the future
        let closestInFuture = Number.MAX_SAFE_INTEGER;
        let now = new Date()
        deadlines.forEach(d =>{
            if (now < d.date) { // only interessted in future events
            if (d.date.getTime() < closestInFuture) {
                closestInFuture = d.date.getTime()
            }}
        })
        if (closestInFuture == Number.MAX_SAFE_INTEGER) {
            // then we just find the most recent deadline that has passed
            deadlines.forEach(d =>{
                if (d.date.getTime() < closestInFuture) {
                    closestInFuture = d.date.getTime()
                }});
            // in case there arent any deadlines set (past or future)
            if (closestInFuture == Number.MAX_SAFE_INTEGER) {
                return undefined;
            }
           return -1 * (new Date(new Date() - new Date(closestInFuture) ).getDate())
        } else {
             return (new Date(new Date(closestInFuture) - new Date()).getDate())
        }
    }
    
    const firstDayCurrentMonth = getFirstDayOfMonth(
	date.getFullYear(),
	date.getMonth(),
    );

    let c = undefined;
    c = document.createElement('div');
    c.className= 'calendar-wrapper';
    let h = document.createElement('h1');
    h.innerHTML = monthNames[date.getMonth()]+' '+date.getFullYear();
    c.appendChild(h);
    let ul = document.createElement('ul')
    ul.className= 'calendar';
    dayNames.forEach(name=> {
        let li= document.createElement('li')
        li.className='weekday';
        li.innerHTML = name;
        ul.appendChild(li);
    });
    let countTo = getDaysInMonth( date.getFullYear(),date.getMonth()+1)
    for (let i=1;i<=countTo;i++) {
	let li= document.createElement('li');
        li.innerHTML = i;
	if (i==1) {
            li.style="grid-column-start:"+(firstDayCurrentMonth+1);
	}
        deadlines.forEach(deadline => {
            if (deadline.date.getMonth() == date.getMonth() && i == deadline.date.getDate() ) { 
	        li.className="deadline";
                li.innerHTML += ` <div class='description'>${deadline.description}</div>` 
            }
        })
        if (i==new Date().getDate() && date.getMonth() == new Date().getMonth()) {
	    li.className="today";
            li.innerHTML += ` <div class='description'>today</div>` 
	}

	ul.appendChild(li);
    }
    c.appendChild(ul);

    //c.appendChild(next)

    //c is calendar wrapper
    

    let next = document.createElement('h2');
    let daysUntil = getDaysUntilNextDeadLine()
    next.innerHTML =  daysUntil == undefined ? ('no deadlines') : daysUntil >= 0 ?  (daysUntil+" days until next deadline.") : (-1*daysUntil+" days passed since deadline. 😔")

    let node = document.querySelector('.put-calendar-in-here')

    node.appendChild(next)
    node.appendChild(c)
}
