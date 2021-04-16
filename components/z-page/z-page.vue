<template>
	<view class="z-page z-flex-col" :style="[style]">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: 'z-page',
		props: {
			options: {
				type: [String, Number, Object, Boolean],
				default () {
					return ''
				}
			},
			// 是否为视频背景
			bgOfVideo: {
				type: [Boolean],
				default () {
					return false
				}
			},
		},
		data() {
			return {
				screenHeight: uni.$z.systemInfo.screenHeight // 整个屏幕的高度
			}
		},
		created() {},
		methods: {},
		computed: {
			style() {
				return {
					height: `${ uni.$z.px2rpx(this.screenHeight) }rpx`,
					width: '750rpx'
				}
			}
		},
		watch: {}
	}
</script>

<style lang="scss">
	.z-page {
		position: fixed;
		left: 0;
		top: 0;
	}
</style>
