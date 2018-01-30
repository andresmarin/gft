function pairwise(arr, total) {
	return arr
		.reduce((a, b, i) => {
			let pair = arr.indexOf(total - b);
			return pair != -1 && pair != i && i < pair ? a.concat(pair + i) : a;
		}, [])
		.reduce((a, b) => a + b, 0);
}

let test = pairwise([7, 9, 11, 13, 15], 20);
console.log(test);
