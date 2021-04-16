<template>
	<view>
		<!-- 调用遮罩层组件 -->
		<z-mask ref="z-mask" v-if="mask" @close="close" :duration="duration" :maskCloseAble="maskCloseAble" :customStyle="customStyleMask"></z-mask>
		<view v-if="visible" class="z-modal z-flex-col" :style="[style]">
			<template v-if="!$slots['default']">
				<view v-if="mode === 'left' || mode === 'right'" class="z-flex-col-1 z-col-center z-row-center">
					<text class="z-text z-flex" style="background-color: #55aaff;border-radius: 4rpx;color: white;" @click="close">关闭</text>
				</view>
				<view v-else class="z-flex-col-1 z-col-center z-row-center">
					<text class="z-text z-flex" style="background-color: #55aaff;border-radius: 4rpx;color: white;" @click="close">关闭</text>
				</view>
			</template>
			<slot v-else name="default"></slot>
			<!-- 底部安全区适配 -->
			<view v-if="mode === 'bottom' && safeAreaInsetBottom" :style="[safeAreaInsetsStyle]"></view>
		</view>
	</view>
</template>

<!-- 微信小程序, QQ小程序, app, h5使用wxs -->
<!-- #ifdef MP-WEIXIN || MP-QQ || APP-PLUS || H5  -->
<!-- <script src="./wxs.wxs" module="wxs" lang="wxs"></script> -->
<!-- #endif -->
<script>
	import mixin from '../../libs/mixin/mixin.js'
	export default {
		name: 'z-modal',
		mixins: [mixin],
		props: {
			// 动画时间
			duration: {
				type: [String, Number],
				default () {
					return 230
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
			},
			// 自定义样式 遮罩层
			customStyleMask: {
				type: [Object],
				default () {
					return {}
				}
			},
			// 关闭按钮
			closeBtn: {
				type: [Boolean],
				default () {
					return true
				}
			},
			// 底部安全处理
			safeAreaInsetBottom: {
				type: [Boolean],
				default () {
					return true
				}
			},
			// 弹出方向 top / center / bottom 
			mode: {
				type: [String],
				default () {
					return 'bottom'
				}
			},
			// 遮罩层开关
			mask: {
				type: [Boolean],
				default () {
					return true
				}
			},
			// 滑动开关 开启后可以拖动开关弹窗 父级页面可以滑动显示弹窗
			drag: {
				type: [Boolean],
				default () {
					return false
				}
			}
		},
		data() {
			return {
				visible: false, // dom创建销毁
				active: false, // dom显示隐藏
				rendering: false, // 组件过渡变化状态
				style: {}, // 组件首次渲染的动态样式
				height: 0, // 组件高度
				width: 0, // 组件宽度
			}
		},
		created() {
			this.initStyle() // 渲染组件关闭状态的样式
		},
		methods: {
			// 初始化组件样式
			initStyle() {
				const { screenHeight, screenWidth } = uni.$z.systemInfo // 屏幕的宽高
				let { duration, mode, customStyle } = this
				customStyle = this.customStyleInit(customStyle) // customStyle全部转为短横线
				// 通过customStyle中的height，width来生成高度 如果没有就自动生成一个默认值 
				// 之所以要这样做是因为在nvue中是没有宽度百分比的所以需要计算出一个准确值并且在调用transform时也需要传入一个确定的px
				// 初始化 弹窗内容宽高样式
				// 如果已经自定义高度了需要把他转化为px，
				if (customStyle.height) {
					// // 如果是rpx单位 
					if (customStyle.height.indexOf('rpx') !== -1) {
						this.height = uni.$z.rpx2px(customStyle.height.replace('rpx', ''))
					} else if (customStyle.height.indexOf('vw') !== -1) { // 如果是vw单位 根据屏幕宽度来转换
						this.height = screenWidth * (customStyle.height.replace('vw', '') / 100)
					} else if (customStyle.height.indexOf('vh') !== -1) { // 如果是vh单位 根据屏幕宽度来转换
						this.height = screenHeight * (customStyle.height.replace('vh', '') / 100)
					} else { // 剩下px 直接使用
						this.height = customStyle.height.replace('px', '')
					}
				}
				// 如果已经自定义宽度了需要把他转化为px，
				if (customStyle.width) {
					// // 如果是rpx单位 
					if (customStyle.width.indexOf('rpx') !== -1) {
						this.width = uni.$z.rpx2px(customStyle.width.replace('rpx', ''))
					} else if (customStyle.width.indexOf('vw') !== -1) { // 如果是vw单位 根据屏幕宽度来转换
						this.width = screenWidth * (customStyle.width.replace('vw', '') / 100)
					} else if (customStyle.width.indexOf('vh') !== -1) { // 如果是vh单位 根据屏幕宽度来转换
						this.width = screenHeight * (customStyle.width.replace('vh', '') / 100)
					} else { // 剩下px 直接使用
						this.width = customStyle.width.replace('px', '')
					}
				}
				let obj = {
					'width': '0',
					'height': '0',
					'transition-duration': `${ duration }ms`
				}
				// 通过mode渲染不同的布局
				switch (mode) {
					case 'left':
						if (!this.width) {
							this.width = screenWidth * 0.5 // 默认为屏幕的一半
						}
						if (!this.height) {
							this.height = screenHeight // 默认为屏幕的百分百
						}
						obj.top = '0'
						obj.left = '0'
						obj.transform = `translate(-${ this.width }px,0)`
						break
					case 'right':
						if (!this.width) {
							this.width = screenWidth * 0.5 // 默认为屏幕的一半
						}
						if (!this.height) {
							this.height = screenHeight // 默认为屏幕的百分百
						}
						obj.top = '0'
						obj.right = '0'
						obj.transform = `translate(${ this.width }px,0)`
						break
					case 'top':
						if (!this.width) {
							this.width = screenWidth // 默认为屏幕的百分百
						}
						if (!this.height) {
							this.height = screenHeight * 0.5 // 默认为屏幕的一半
						}
						obj.top = '0'
						obj.left = '0'
						obj.transform = `translate(0,-${ this.height }px)`
						break
					default: // 默认为bottom
						if (!this.width) {
							this.width = screenWidth // 默认为屏幕的百分百
						}
						if (!this.height) {
							this.height = screenHeight * 0.5 // 默认为屏幕的一半
						}
						this.height = uni.$z.safeAreaInsets + this.height // 需要加底部安全距离
						obj.bottom = '0'
						obj.left = '0'
						obj.transform = `translate(0,${ this.height }px)`
						break
				}
				obj = { ...obj, ...customStyle } // 合并customStyle
				obj.height = `${ this.height }px`
				obj.width = `${ this.width }px`
				this.style = obj
			},
			// 开启 // 关闭
			async show(visible = true) {
				if (this.rendering) return // 如果上一次的执行还未完成不再响应
				this.rendering = true // 渲染开始
				// 开启 
				if (visible) {
					this.mask && this.$refs['z-mask'].show() // 开启遮罩层
					await uni.$z.setTimeout(0) // nvue中上下层级问题 所以要先渲染遮罩层 再渲染弹出层 并且不能使用this.$nextTick() // 因为只需要z-mask中js执行完成为visible = true
					this.visible = true // dom创建
					await this.$nextTick() // 等待dom渲染
					await uni.$z.setTimeout(10) // 等待dom渲染 兼容低端安卓
					this.style.transform = 'translate(0,0)' // 显示
					await uni.$z.setTimeout(this.duration, (timer) => { this.rendering = timer }) // 等待动画完成
				} else {
					// 关闭
					let { mode, height, width } = this
					this.mask && this.$refs['z-mask'].show(false) // 关闭遮罩层
					// 隐藏 不同的mode transform不一样
					switch (mode) {
						case 'left':
							this.style.transform = `translate(-${ width }px,0)`
							break
						case 'right':
							this.style.transform = `translate(${ width }px,0)`
							break
						case 'top':
							this.style.transform = `translate(0,-${ height }px)`
							break
						default: // 默认为bottom
							this.style.transform = `translate(0,${ height }px)`
							break
					}
					await uni.$z.setTimeout(this.duration, (timer) => { this.rendering = timer }) // 等待动画完成
					this.visible = false // dom销毁
				}
				this.rendering = false // 渲染结束
			},
			// 关闭按钮
			close(e) {
				this.$emit('close', e)
				this.show(false)
			}
		},
		computed: {
			// 底部安全距离
			safeAreaInsetsStyle() {
				return {
					'width': '750rpx',
					'height': `${ uni.$z.safeAreaInsets }px`
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.z-modal {
		position: fixed;
		background-color: #ffffff;
		z-index: 9999;
		box-shadow: 0 0 40rpx 20rpx rgba(0, 0, 0, 0.05);
		transform: translate(0, 0);
		transition-property: transform;
		transition-timing-function: ease-out;
		transition-duration: 230ms;
	}
</style>
