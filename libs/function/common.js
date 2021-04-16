let old = 0

export default {
	// 延时等待 
	setTimeout: function(time = 0, callBack) {
		return new Promise(async (resolve, reject) => {
			let timer = setTimeout(() => {
				resolve()
			}, time)
			if (typeof callBack == 'function') callBack(timer)
		})
	},
	// 节流 在多次操作中每隔一段时间才响应一次
	throttle: function(func, wait = 50) {
		return new Promise((resolve, reject) => {
			let difference = (new Date().getTime() - old)
			console.log('--------->difference > wait', difference > wait)
			if (difference > wait) {
				old = new Date().getTime()
				resolve()
			}
		})
	},
	// JS对象深度合并
	deepMerge: function(target = {}, source = {}) {
		target = uni.$z.deepClone(target)
		if (typeof target !== 'object' || typeof source !== 'object') return false
		for (let prop in source) {
			if (!source.hasOwnProperty(prop)) continue
			if (prop in target) {
				if (typeof target[prop] !== 'object') {
					target[prop] = source[prop]
				} else {
					if (typeof source[prop] !== 'object') {
						target[prop] = source[prop]
					} else {
						if (target[prop].concat && source[prop].concat) {
							target[prop] = target[prop].concat(source[prop])
						} else {
							target[prop] = uni.$z.deepMerge(target[prop], source[prop])
						}
					}
				}
			} else {
				target[prop] = source[prop]
			}
		}
		return target
	},
	// 深度克隆
	deepClone: function(obj) {
		// 对常见的“非”值，直接返回原来值
		if ([null, undefined, NaN, false].includes(obj)) return obj
		if (typeof obj !== 'object' && typeof obj !== 'function') {
			//原始类型直接返回
			return obj
		}
		// 判断arr是否为一个数组，返回一个bool值
		function isArray(arr) {
			return Object.prototype.toString.call(arr) === '[object Array]'
		}
		let o = isArray(obj) ? [] : {}
		for (let i in obj) {
			if (obj.hasOwnProperty(i)) {
				o[i] = typeof obj[i] === 'object' ? uni.$z.deepClone(obj[i]) : obj[i]
			}
		}
		return o
	},
	/**
	 * 对象转url参数
	 * @param {*} data,对象
	 * @param {*} isPrefix,是否自动加上"?"
	 */
	queryParams: function(data = {}, isPrefix = true, arrayFormat = 'brackets') {
		let prefix = isPrefix ? '?' : ''
		let _result = []
		if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1) arrayFormat = 'brackets'
		for (let key in data) {
			let value = data[key]
			// 去掉为空的参数
			if (['', undefined, null].indexOf(value) >= 0) {
				continue
			}
			// 如果值为数组，另行处理
			if (value.constructor === Array) {
				// e.g. {ids: [1, 2, 3]}
				switch (arrayFormat) {
					case 'indices':
						// 结果: ids[0]=1&ids[1]=2&ids[2]=3
						for (let i = 0; i < value.length; i++) {
							_result.push(key + '[' + i + ']=' + value[i])
						}
						break
					case 'brackets':
						// 结果: ids[]=1&ids[]=2&ids[]=3
						value.forEach(_value => {
							_result.push(key + '[]=' + _value)
						})
						break
					case 'repeat':
						// 结果: ids=1&ids=2&ids=3
						value.forEach(_value => {
							_result.push(key + '=' + _value)
						})
						break
					case 'comma':
						// 结果: ids=1,2,3
						let commaStr = ''
						value.forEach(_value => {
							commaStr += (commaStr ? ',' : '') + _value
						})
						_result.push(key + '=' + commaStr)
						break
					default:
						value.forEach(_value => {
							_result.push(key + '[]=' + _value)
						})
				}
			} else {
				_result.push(key + '=' + value)
			}
		}
		return _result.length ? prefix + _result.join('&') : ''
	},
	// px通过设备转rpx
	px2rpx: function(px = null) {
		const { windowWidth } = uni.$z.systemInfo // 获取的是设备的真实宽高px，例如苹果12 ，宽度为390px，这里的390px ===750rpx
		return px * (750 / windowWidth)
	},
	rpx2px: function(rpx = null) {
		const { windowWidth } = uni.$z.systemInfo // 获取的是设备的真实宽高px，例如苹果12 ，宽度为390px，这里的390px ===750rpx
		return rpx * (windowWidth / 750)
	},
	// 短划线转换驼峰
	line2hump: function(str) {
		return str.replace(/\-(\w)/g, function(all, letter) {
			return letter.toUpperCase()
		})
	},
	// 驼峰转换短横线
	hump2line: function(str) {
		return str.replace(/([A-Z])/g, '-$1').toLowerCase()
	},
	// 格式化时间
	timeFormat: function(dateTime = null, fmt = 'yyyy-mm-dd') {
		if (!dateTime) dateTime = Number(new Date()) // 如果为null,则格式化当前时间
		// 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
		// if (dateTime.toString().length == 10) dateTime *= 1000;
		let date = new Date(Number(dateTime))
		let ret
		let opt = {
			'y+': date.getFullYear().toString(), // 年
			'm+': (date.getMonth() + 1).toString(), // 月
			'd+': date.getDate().toString(), // 日
			'h+': date.getHours().toString(), // 时
			'M+': date.getMinutes().toString(), // 分
			's+': date.getSeconds().toString() // 秒
			// 有其他格式化字符需求可以继续添加，必须转化成字符串
		}
		for (let k in opt) {
			ret = new RegExp('(' + k + ')').exec(fmt)
			if (ret) {
				fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
			};
		}
		return fmt
	},
	// 震动
	sensation: function(time = 0) {
		// #ifdef  APP-PLUS 
		const platform = uni.getSystemInfoSync().platform
		try {
			if (platform == 'android') {
				plus.device.vibrate(16)
			} else {
				let UIImpactFeedbackGenerator = plus.ios.importClass('UIImpactFeedbackGenerator')
				let impact = new UIImpactFeedbackGenerator()
				impact.prepare(16)
				impact.init(16)
				impact.impactOccurred(16)
			}
		} catch (e) {
			//TODO handle the exception
			console.log('--------->触感错误', e)
		}
		// #endif
		// #ifndef APP-PLUS
		// console.log('--------->没有有效的触感api', )
		uni.vibrateShort({ type: 'light' })
		// #endif
	}
}
