const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
//const dayNames = ["Sun", 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
            if (now < d) { // only interessted in future events
            if (d.getTime() < closestInFuture) {
                closestInFuture = d.getTime()
            }}
        })
        return (new Date(new Date(closestInFuture) - new Date()).getDate())
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
	let li= document.createElement('li')
	if (i==1) {
            li.style="grid-column-start:"+(firstDayCurrentMonth+1)
	}
        deadlines.forEach(deadline => {
            if (deadline.getMonth() == date.getMonth() && i == deadline.getDate() ) { 
	        li.className="deadline"
            }
        })
        if (i==new Date().getDate() && date.getMonth() == new Date().getMonth()) {
	    li.className="today"
	}
	li.innerHTML = i
	ul.appendChild(li)
    }
    c.appendChild(ul);

    //c.appendChild(next)

    //c is calendar wrapper
    

    let next = document.createElement('h2');
    next.innerHTML = getDaysUntilNextDeadLine()+ " days until next deadline."

    let node = document.querySelector('.put-calendar-in-here')

    node.appendChild(next)
    node.appendChild(c)
}
