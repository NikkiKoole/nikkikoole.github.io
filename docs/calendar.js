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

function buildCalendar() {
    const deadline = new Date(2022, 9, 31)
    console.log(deadline.getDay())
    const date = new Date();
    const firstDayCurrentMonth = getFirstDayOfMonth(
	date.getFullYear(),
	date.getMonth(),
    );
    let showDeadline=false;
    if (deadline.getMonth() == date.getMonth()) {
	showDeadline=deadline.getDate();
    }
    let c = document.createElement('div');
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
	if (showDeadline && i==showDeadline) {
	    li.className="deadline"
	}
	if (i==date.getDate()) {
	    li.className="today"
	}
	li.innerHTML = i
	ul.appendChild(li)
    }
    c.appendChild(ul);
    let node = document.querySelector('.put-calendar-in-here')
    node.appendChild(c)
}
