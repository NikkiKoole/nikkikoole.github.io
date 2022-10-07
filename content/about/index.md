

## Hi Hello! I am Nikki Koole

Artist turned software engineer.  

Writing software is part of the thinking process for me,
I get fascinated by a subject, study it; read and watch things about it.
Think about it whilst taking very hot showers.  

But the real understanding, I think, happens after putting it into a working piece of software, describing the rules in code that runs and is interactive. 

I love math and drawing and music and programming, and how apps are this little medium that involves all of that. After I became a father, I started moving towards this idea:

## Making apps for young children.


Instead of this complex calendar, I think i rather just see a counter, how many days until the next deadline, and what will be done at that deadline


<div class='put-calendar-in-here'></div>


<script>
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const dayNames = ["Sun", 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']


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
	h.innerHTML = monthNames[date.getMonth()]
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


buildCalendar()

</script>

Read more over at [blog](/blog)
