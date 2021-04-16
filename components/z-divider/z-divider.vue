<template>
	<view class="z-flex z-row-center z-divider">
		<view class="z-divider-left" :style="[colorStyle]"></view>
		<slot></slot>
		<view class="z-divider-right" :style="[colorStyle]"></view>
	</view>
</template>
<script>
	export default {
		name: 'z-divider',
		props: {
			color: {
				type: [String],
				default () {
					return '#999999'
				}
			}
		},
		computed: {
			colorStyle() {
				return { backgroundColor: this.color }
			}
		}
	}
</script>
<style scoped lang="scss">
	.z-divider {

		.z-divider-left,
		.z-divider-right {
			flex: 1;
			height: 1rpx;
		}
	}
</style>
