let handInput = document.querySelector('#handInput') //手數 input
let ansInput = document.querySelector('#ansInput') //金額 input
let countBtn = document.querySelector('#countBtn') //點擊按鈕
countBtn.addEventListener('click', function() {
	ansInput.value = '';
	let val = handInput.value;
	if ( val === "" ){
		return false;
	} else {
		if (val >= 2000) {
			let remainder = val - 2000
			let ans = 12100 + (remainder * 7)
			ansInput.value = ans.toFixed(2);
		} else if (val >= 1000 && val < 2000) {
			let remainder = val - 1000
			let ans = 5600 + (remainder * 6.5)
			ansInput.value = ans.toFixed(2);
		} else if (val >= 500 && val < 1000) {
			let remainder = val - 500
			let ans = 2600 + (remainder * 6)
			ansInput.value = ans.toFixed(2);
		} else if (val >= 300 && val < 500) {
			let remainder = val - 300
			let ans = 1500 + (remainder * 5.5)
			ansInput.value = ans.toFixed(2);
		} else {
			let ans = val * 5
			ansInput.value = ans.toFixed(2);
		}
	}
})
