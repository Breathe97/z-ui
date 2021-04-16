<template>
	<view class="z-flex">
		<button class="z-flex-1 z-flex z-row-center z-button" :style="[style]">
			<slot></slot>
		</button>
	</view>
</template>
<script>
	export default {
		name: 'z-button',
		props: {
			// mode
			mode: {
				type: [String],
				default () {
					return ''
				}
			},
			// 资源路径
			src: {
				type: [String],
				default () {
					return ''
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
		computed: {
			style() {
				let _style = this.customStyle
				if (!_style.height) {
					_style.height = '80rpx'
				}
				if (!_style.backgroundColor) {
					_style.backgroundColor = '#2A82FD'
				}
				if (!_style.color) {
					_style.color = '#ffffff'
				}
				if (!_style.fontSize) {
					_style.fontSize = '32rpx'
				}
				return this.customStyle
			},
		},
	}
</script>
<style scoped lang="scss">
	.z-button {
		padding: 10rpx 20rpx;
		border: 0px;

		&::after {
			border: 0px;
		}
	}
</style>
