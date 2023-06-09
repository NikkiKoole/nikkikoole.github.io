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

let now =  new Date();
let date = new Date(); 

function  removeCalendar() {
    let node = document.querySelector('.put-calendar-in-here')
    node.innerHTML = '';
}

function buildCalendar(deadlines) {

    function getDaysUntilNextDeadLine() {
        // Given an array of deadlines, find the closest one in the future.
        let closestInFuture = Number.MAX_SAFE_INTEGER;
        let now = new Date();
        deadlines.forEach(d => {
            if (now < d.date) { // Only interested in future events.
                if (d.date.getTime() < closestInFuture) {
                    closestInFuture = d.date.getTime();
                }
            }
        });
        if (closestInFuture === Number.MAX_SAFE_INTEGER) {
            // If no future deadlines, find the most recent deadline that has passed.
            deadlines.forEach(d => {
                if (d.date.getTime() < closestInFuture) {
                    closestInFuture = d.date.getTime();
                }
            });
            // In case there are no deadlines set (past or future).
            if (closestInFuture === Number.MAX_SAFE_INTEGER) {
                return undefined;
            }

            return -1 * (new Date(now - new Date(closestInFuture)).getDate() - 1);
        } else {
            return (new Date(new Date(closestInFuture) - now).getDate());
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
  
    
  

    let prevMonth = document.createElement('img');
    prevMonth.src = 'assets/images/ui/prev.png'
    prevMonth.className= 'prev-next-month';
    prevMonth.onclick = function() {
        date.setMonth((date.getMonth() - 1) );
        removeCalendar()
        buildCalendar(deadlines);
    }
    let mbuttons = document.createElement('div');
    //mbuttons.style.marginLeft= 'auto'
    mbuttons.appendChild(prevMonth);

    let nextMonth = document.createElement('img');
    nextMonth.src = 'assets/images/ui/next.png'
    nextMonth.className= 'prev-next-month';
    nextMonth.onclick = function() {
        date.setMonth((date.getMonth() + 1) );
        removeCalendar()
        buildCalendar(deadlines);
    }
    mbuttons.appendChild(nextMonth);
   
   // h.prepend(mbuttons)
    h.appendChild(mbuttons);
    let str = document.createElement('div');
    str.innerHTML = monthNames[date.getMonth()]+' '+date.getFullYear();
    h.appendChild(str);

    c.appendChild(h);
    //h.style.display =  'flex'
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
            if (deadline.date.getMonth() == date.getMonth() && date.getFullYear() == deadline.date.getFullYear() && i == deadline.date.getDate() ) { 
	        li.className="deadline";
                if (deadline.date.getTime() < now.getTime()) {
                    li.className = "deadline past"
                    if (deadline.success === true) {
                        li.className = "deadline past success"
                    } else {

                        li.className = "deadline past fail"

                    }
                } else {
                    li.className = "deadline future"

                }
                li.innerHTML += ` <div class='description'>${deadline.description}</div>` 
            }
        })
        if (i==now.getDate() &&  date.getFullYear() == now.getFullYear() && date.getMonth() == now.getMonth()) {
	    li.className += " today";
            li.innerHTML += ` <div class='description'>today</div>` 
	}

	ul.appendChild(li);
    }
    c.appendChild(ul);

    //c.appendChild(next)

    //c is calendar wrapper
    

    let next = document.createElement('h2');
    let daysUntil = getDaysUntilNextDeadLine()
    let dayStr = 'days'
    if (Math.abs(daysUntil) == 1) dayStr = 'day';
    next.innerHTML =  daysUntil == undefined ? ('no deadlines') : daysUntil >= 0 ?  (daysUntil+" " + dayStr+" until next deadline.") : (-1*daysUntil+" "+dayStr+" passed since deadline. 😔")
    if (daysUntil == 0) {
        next.innerHTML = 'deadline day!'
    }
    let node = document.querySelector('.put-calendar-in-here')

    //node.appendChild(next)
    node.appendChild(c)


    
    
    
}
