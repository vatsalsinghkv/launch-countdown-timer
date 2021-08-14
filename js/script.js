'use strict';

const $time = $('.time');
const $counterItemTop = $('.counter-item-top');
const isMobile = /iPhone|Android/i.test(navigator.userAgent);

let flagHr = true;
let flagDay = true;
let bday = false;

const elements = {
	daysEl: [$time[0], $time[1]],
	hoursEl: [$time[2], $time[3]],
	minsEl: [$time[4], $time[5]],
	secsEl: [$time[6], $time[7]],
};

const counter = new Map([
	['daysEl', $($counterItemTop[0])],
	['hoursEl', $($counterItemTop[1])],
	['minsEl', $($counterItemTop[2])],
	['secsEl', $($counterItemTop[3])],
]);

const printBday = () => {
	$('.main-heading').text('Happy Birthday Vatsal! 🎉');
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
	if ([daysTime, hoursTime, minsTime, secsTime].every(t => t == 0)) {
		printBday();
		bday = true;

		$(daysEl).text('00');
		$(hoursEl).text('00');
		$(minsEl).text('00');
		$(secsEl).text('00');

		return;
	}

	$(daysEl).text(daysTime);
	$(hoursEl).text(hoursTime);
	$(minsEl).text(minsTime);
	$(secsEl).text(secsTime);

	// Animation
	if (!isMobile) {
		if (secsTime == 59) flip(counter.get('minsEl'));
		if (minsTime == 59 && flagHr) {
			flip(counter.get('hoursEl'));
			flagHr = false;
		} else if (minsTime == 58) {
			flagHr = true;
		}
		if (hoursTime == 23 && flagDay) {
			flip(counter.get('daysEl'));
			flagDay = false;
		} else if (hoursTime == 22) {
			flagDay = true;
		}
	}
};

const getTime = () => {
	const currentDate = new Date();
	const targetDate = new Date(2021, 7, 15, 0, 0, 0);

	let timeLeft = targetDate - currentDate; // in miliseconds

	let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
	timeLeft %= 1000 * 60 * 60 * 24;

	let hours = Math.floor(timeLeft / (1000 * 60 * 60));
	timeLeft %= 1000 * 60 * 60;

	let mins = Math.floor(timeLeft / (1000 * 60));
	timeLeft %= 1000 * 60;

	let secs = Math.floor(timeLeft / 1000);

	if (days % 30) {
		let months = days % 30;
		days += 31 * months;
	}

	updateTime(elements, {
		daysTime: `${days}`.padStart(2, '0'),
		hoursTime: `${hours}`.padStart(2, '0'),
		minsTime: `${mins}`.padStart(2, '0'),
		secsTime: `${secs}`.padStart(2, '0'),
	});
};

getTime();
const timer = setInterval(() => {
	if (bday) {
		clearInterval(timer);
	} else {
		getTime();
		isMobile || flip(counter.get('secsEl'));
	}
}, 1000);
