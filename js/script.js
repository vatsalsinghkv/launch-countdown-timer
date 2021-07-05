'use strict';

const $time = $('.time');
const $counterItemTop = $('.counter-item-top');
const isMobile = /iPhone|Android/i.test(navigator.userAgent);

let flagHr = true;
let flagDay = true;

const elements = {
	daysEl: [$time[0], $time[1]],
	hoursEl: [$time[2], $time[3]],
	minsEl: [$time[4], $time[5]],
	secsEl: [$time[6], $time[7]],
};

const counter = {
	daysEl: $($counterItemTop[0]),
	hoursEl: $($counterItemTop[1]),
	minsEl: $($counterItemTop[2]),
	secsEl: $($counterItemTop[3]),
};

const flip = function ($el) {
	const $elClone = $el
		.clone()
		.css({
			position: 'absolute',
			top: '0',
			left: '0',
			'z-index': '10',
			'background-color': 'hsl(236, 21%, 26%)',
		})
		.prependTo($el.parent());

	setTimeout(() => $elClone.addClass('flip'));
	setTimeout(() => $elClone.fadeOut(() => $elClone.remove()));
};

const updateTime = (
	{ daysEl, hoursEl, minsEl, secsEl },
	{ daysTime, hoursTime, minsTime, secsTime }
) => {
	$(daysEl).text(daysTime);
	$(hoursEl).text(hoursTime);
	$(minsEl).text(minsTime);
	$(secsEl).text(secsTime);

	// Animation
	if (!isMobile) {
		if (secsTime == 59) flip(counter.minsEl);
		if (minsTime == 59 && flagHr) {
			flip(counter.hoursEl);
			flagHr = false;
		} else if (minsTime == 58) {
			flagHr = true;
		}
		if (hoursTime == 23 && flagDay) {
			flip(counter.daysEl);
			flagDay = false;
		} else if (hoursTime == 22) {
			flagDay = true;
		}
	}
};

const dateFormatter = (num) => (num < 10 ? '0' + num : num);

const getTime = () => {
	const currentDate = new Date();
	const targetDate = new Date(2021, 7, 15, 0, 0, 0);

	const countdownDate = new Date();
	countdownDate.setDate(targetDate.getDate() - currentDate.getDate());
	countdownDate.setHours(targetDate.getHours() - currentDate.getHours());
	countdownDate.setMinutes(targetDate.getMinutes() - currentDate.getMinutes());
	countdownDate.setSeconds(targetDate.getSeconds() - currentDate.getSeconds());

	let date = countdownDate.getDate();
	if (countdownDate.getMonth()) {
		date = countdownDate.getDate() + 31;
	}

	updateTime(elements, {
		daysTime: dateFormatter(date),
		hoursTime: dateFormatter(countdownDate.getHours()),
		minsTime: dateFormatter(countdownDate.getMinutes()),
		secsTime: dateFormatter(countdownDate.getSeconds()),
	});
};

getTime();
setInterval(() => {
	getTime();
	isMobile || flip(counter.secsEl);
}, 1000);
