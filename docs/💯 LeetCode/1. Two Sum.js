/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
	// 1. 对数组使用双重循环，找到满足 `nums[i]+nums[j] = target` 的值
	// for (let i = 0; i < nums.length; i++) {
	// 	for (let j = i + 1; j < nums.length; j++) {
	// 		if (nums[i] + nums[j] === target) {
	// 			return [i, j];
	// 		}
	// 	}
	// }
	// 2. 使用 Map
	const map = new Map();
	for (let i = 0; i < nums.length; i++) {
		const complement = target - nums[i];
		if (map.has(complement)) {
			return [map.get(complement), i];
		} else {
			map.set(nums[i], i);
		}
	}
	return [];
};
