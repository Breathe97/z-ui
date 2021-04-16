export default {
	methods: {
		// 初始化customStyle
		customStyleInit(customStyle) {
			let _customStyle = {}
			for (let style in customStyle) {
				_customStyle[uni.$z.hump2line(style)] = customStyle[style]
			}
			return _customStyle // 返回最终的customStyle
		}
	}
}
