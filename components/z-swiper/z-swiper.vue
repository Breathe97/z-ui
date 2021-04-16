<template>
	<swiper class="z-swiper" :style="[style]" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :circular="circular" :indicator-color="indicatorColor" :indicator-active-color="indicatorActiveColor">
		<swiper-item v-for="(item,index) in list" :key="index">
			<z-image :src="item.image" :style="[style]" :customStyle="style"></z-image>
		</swiper-item>
	</swiper>
</template>
<script>
	export default {
		name: 'z-swiper',
		props: {
			// 轮播图列表
			list: {
				type: [Array],
				default () {
					return []
				}
			},
			// 高度
			height: {
				type: [Number, String],
				default () {
					return 300
				}
			},
			// 宽度
			width: {
				type: [Number, String],
				default () {
					return 750
				}
			},
			// 是否显示面板指示点
			indicatorDots: {
				type: [Boolean],
				default () {
					return true
				}
			},
			// 指示点颜色
			indicatorColor: {
				type: [String],
				default () {
					return 'rgba(255, 255, 255, 0.3)'
				}
			},
			// 当前选中的指示点颜色
			indicatorActiveColor: {
				type: [String],
				default () {
					return '#ffffff'
				}
			},
			// 是否自动切换
			autoplay: {
				type: [Boolean],
				default () {
					return false
				}
			},
			// 当前所在滑块的 index
			current: {
				type: [Number],
				default () {
					return 0
				}
			},
			// 自动切换时间间隔
			interval: {
				type: [Number],
				default () {
					return 5000
				}
			},
			// 是否采用衔接滑动，即播放到末尾后重新回到开头
			circular: {
				type: [Boolean],
				default () {
					return true
				}
			},
			// 滑动方向是否为纵向
			vertical: {
				type: [Boolean],
				default () {
					return false
				}
			},
			// 当开启时，会根据滑动速度，连续滑动多屏
			acceleration: {
				type: [Boolean],
				default () {
					return false
				}
			},
			// 自定义样式
			customStyle: {
				type: [Object],
				default () {
					return {}
				}
			}
		},
		data() {
			return {}
		},
		created() {},
		methods: {},
		computed: {
			// 整体
			style() {
				let _style = this.customStyle
				// 默认属性
				if (!_style.height) {
					_style.height = '300rpx'
				}
				if (!_style.width) {
					_style.width = '750rpx'
				}
				return _style
			}
		},
		watch: {},
	}
</script>
<style scoped lang="scss">
	.z-swiper {
		.z-swiper-item {}
	}
</style>
