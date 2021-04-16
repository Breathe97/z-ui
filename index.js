import test from './libs/function/test.js'
import store from './libs/function/store.js'
import route from './libs/function/route.js'
import common from './libs/function/common.js'

const systemInfo = uni.getSystemInfoSync() // 获取系统信息
const $z = {
	test,
	common,
	systemInfo,
	route: route,
	store: store,
	px2rpx: common.px2rpx,
	rpx2px: common.rpx2px,
	throttle: common.throttle,
	line2hump: common.line2hump,
	hump2line: common.hump2line,
	sensation: common.sensation,
	deepMerge: common.deepMerge,
	deepClone: common.deepClone,
	timeFormat: common.timeFormat,
	setTimeout: common.setTimeout,
	queryParams: common.queryParams,
	safeAreaInsets: systemInfo.screenHeight - systemInfo.safeArea.bottom // 计算底部安全距离 直接获取safeAreaInsets.bottom在小程序上不准确 所以手动计算一下
}

// $z挂载到uni对象上
uni.$z = $z
