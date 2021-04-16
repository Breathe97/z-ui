<template>
	<view class="z-page-bg">
		<video v-if="isVideo" id="myVideo" :style="[style]" :src="url" :muted="false" :controls="false" autoplay loop></video>
		<z-image v-else :customStyle="style" :src="url" mode="aspectFill"></z-image>
	</view>
</template>

<script>
	export default {
		name: 'z-page-bg',
		props: {
			// 默认背景图片高度
			height: {
				type: [String],
				default () {
					return ''
				}
			},
			// 背景图片、视频地址或链接
			url: {
				type: [String],
				default () {
					return ''
				}
			},
			// 是否为视频背景
			isVideo: {
				type: [Boolean],
				default () {
					return false
				}
			},
			// 默认背景填充颜色
			backgroundColor: {
				type: [String],
				default () {
					return ''
				}
			}
		},
		data() {
			return {
				screenHeight: uni.$z.systemInfo.screenHeight // 整个屏幕的高度
			}
		},
		computed: {
			// 自动生成
			style() {
				return {
					height: `${ this.height || uni.$z.px2rpx(this.screenHeight) }rpx`,
					width: '750rpx',
					backgroundColor: this.backgroundColor
				}
			}
		}
	}
</script>

<style>
	.z-page-bg {
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
	}
</style>
