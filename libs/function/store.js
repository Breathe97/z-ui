export default {
	set: (key, val) => {
		try {
			uni.setStorageSync(key, val)
		} catch (e) {
			console.log('--------->setStorageSync-catch', e)
		}
	},
	get: (key) => {
		let val
		try {
			val = uni.getStorageSync(key)
		} catch (e) {
			console.log('--------->getStorageSync-catch', e)
		}
		return val
	}
}
