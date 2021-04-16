<template>
	<view v-if="visible" class="z-mask z-flex-col" :style="[style]" :blurEffect="blurEffect" @touchmove.stop.prevent="() => {}" @tap="close">
		<slot></slot>
	</view>
</template>

<script>
	import mixin from '../../libs/mixin/mixin.js'
	export default {
		name: 'z-mask',
		mixins: [mixin],
		props: {
			// 动画时间
			duration: {
				type: [String, Number],
				default () {
					return 230
				}
			},
			// 高斯模糊效果 "dark" - 暗风格模糊 "extralight" - 高亮风格模糊 "light" - 亮风格模糊 "none" - 无模糊效果
			blurEffect: {
				type: [String],
				default () {
					return 'light' // ['dark', 'extralight', 'light', 'none']
				}
			},
			// 遮罩层是否可点击关闭
			maskCloseAble: {
				type: [Boolean],
				default () {
					return true
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
			return {
				visible: false, // dom创建销毁
				rendering: false, // 组件过渡变化状态 之所以来控制是避免在渲染操作过快 安卓低性能设备会闪烁卡顿 造成更加恶劣的体验，因此改为只能完全开启后才能关闭 完全关闭后才能再次开启
				style: {}, // 组件首次渲染的动态样式
			}
		},
		created() {
			this.initStyle() // 渲染组件关闭状态的样式
		},
		methods: {
			// 初始化组件样式 即在组件关闭时的状态
			initStyle() {
				let { duration, customStyle } = this
				customStyle = this.customStyleInit(customStyle) // customStyle全部转为短横线
				let obj = {
					'opacity': '0',
					'height': `${ uni.$z.systemInfo.screenHeight }px`,
					'transition-duration': `${ duration }ms`
				}
				this.style = { ...obj, ...customStyle } // 合并样式
			},
			// 开启 // 关闭
			async show(visible = true) {
				if (this.rendering) return // 如果上一次的执行还未完成不再响应
				this.rendering = true // 渲染开始
				if (visible) {
					this.visible = true // dom创建
					await this.$nextTick() // 等待dom渲染
					await uni.$z.setTimeout(10) // 等待dom渲染 兼容低端安卓
					this.style.opacity = '1' // 显示
					await uni.$z.setTimeout(this.duration) // 等待动画完成
				} else {
					this.style.opacity = '0' // 隐藏
					await uni.$z.setTimeout(this.duration) // 等待动画完成
					this.visible = false // dom销毁
				}
				this.rendering = false // 渲染结束
			},
			// 关闭按钮
			close(e) {
				if (!this.maskCloseAble) return
				this.$emit('close', e)
				this.show(false)
			},
		}
	}
</script>

<style>
	.z-mask {
		position: fixed;
		width: 750rpx;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		overflow: hidden;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 9998;
		transition-property: opacity;
		transition-timing-function: ease-out;
		transition-duration: 230ms;
	}
</style>
