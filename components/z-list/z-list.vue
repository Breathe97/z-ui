<template>
	<view class="z-flex-col-1 z-list">
		<scroll-view class="z-flex-col-1" scroll-y="true" adjustBottom="true">
			<!-- #ifdef APP-NVUE -->
			<refresh v-if="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="refreshing ? 'show' : 'hide'">
				<view class="z-flex z-row-center" style="height: 50px;width: 750rpx;">
					<z-icon size="22" name="refresh" :style="[iconStyle]"></z-icon>
					<text class="z-text">{{ text }}</text>
				</view>
			</refresh>
			<!-- #endif -->
			<slot></slot>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'z-list',
		props: {
			// options: {
			// 	type: [String, Number, Object, Boolean, Array],
			// 	default () {
			// 		return ''
			// 	}
			// },
			// 是否开启下拉刷新
			refresh: {
				type: [Boolean],
				default () {
					return false
				}
			},
			// 下拉距离
			pullingDistance: {
				type: [String, Number],
				default () {
					return 150
				}
			}
		},
		data() {
			return {
				text: '下拉刷新',
				refreshing: true,
				iconStyle: {},
			}
		},
		created() {
			// this.adjustBottomString = this.adjustBottom.toString()
			// console.log('--------->this', this.adjustBottom, this.adjustBottomString)
		},
		methods: {
			// 关闭刷新 由外部调用
			async refreshEnd() {
				this.text = '刷新完成'
				await uni.$z.setTimeout(230)
				this.refreshing = false
			},
			// 触发刷新
			async onrefresh(e) {
				this.refreshing = true
				if (this.text === '松开刷新') {
					this.refreshing = true
					this.text = '正在刷新'
					this.$emit('refresh', e)
				} else {
					await uni.$z.setTimeout(0) // 必须要加一个 不知道为什么 不然就不好使
					this.refreshing = false
				}
			},
			// 下拉
			onpullingdown({ dy, viewHeight, pullingDistance }) {
				if (pullingDistance >= 0) return // 不是下拉
				// 因为默认是开启状态 所以每次一拉就应该恢复为关闭状态
				if (this.refreshing) {
					this.refreshing = false
				}
				pullingDistance = uni.$z.px2rpx(Math.abs(pullingDistance)) // 下拉距离 取绝对值
				this.setStyle(pullingDistance) // 设置图标旋转
				if (this.text !== '下拉刷新' && pullingDistance < this.pullingDistance) {
					this.text = '下拉刷新'
				}
				if (this.text !== '松开刷新' && pullingDistance > this.pullingDistance) {
					this.text = '松开刷新'
					uni.$z.sensation() // 触发震动提示用户已达到刷新条件
				}
			},
			// 设置图标旋转
			setStyle(pullingDistance) {
				// 通过pullingDistance 来计算选择角度
				let deg = pullingDistance / this.pullingDistance
				deg = deg >= 1 ? 1 : deg * 360
				this.iconStyle = {
					transform: `rotateZ(${deg}deg)`
				}
			}
		},
		watch: {},

	}
</script>

<style scoped lang="scss">
	.z-list {}
</style>
