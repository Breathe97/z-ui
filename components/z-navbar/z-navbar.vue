<template>
	<view>
		<view class="z-navbar" :style="[style]">
			<!-- 状态栏占位 -->
			<view class="z-navbar-status-bar" :style="[statusBarStyle]"></view>
			<view class="z-flex z-navbar-content" :style="[heightStyle]">
				<!-- 导航栏标题 -->
				<view class="z-flex z-navbar-title" :style="[contentHeightStyle]">
					<text class="z-line-1 z-navbar-title-text" :style="[color]" v-if="!$slots['title']">{{ title }}</text>
					<slot v-else name="title"></slot>
				</view>
				<!-- 导航栏左侧 -->
				<view class="z-flex z-navbar-left" :style="[contentHeightStyle]">
					<view v-if="isBack" class="z-flex z-navbar-left-back" @click="back">
						<z-icon name="arrow-left" size="24" :color="color.color"></z-icon>
						<text v-if="isBackText" class="z-text" :style="[color]">返回</text>
					</view>
					<slot v-if="$slots['left']" name="left"></slot>
				</view>
				<!-- 导航栏右侧 -->
				<view class="z-flex z-row-right z-navbar-right" :style="[contentHeightStyle,menuButtonStyle]">
					<slot v-if="$slots['right']" name="right"></slot>
				</view>
			</view>
		</view>
		<!-- 因为上面是fixed布局 所以下面生成两个等高的view占位 -->
		<view style="z-index: -1;" :style="[statusBarStyle]"></view>
		<view style="z-index: -1;" :style="[heightStyle]"></view>
	</view>

</template>

<script>
	export default {
		name: 'z-navbar',
		props: {
			options: {
				type: [String, Number, Object, Boolean],
				default () {
					return ''
				}
			},
			// 返回按钮
			isBack: {
				type: [Boolean],
				default () {
					return true
				}
			},
			// 返回按钮文字
			isBackText: {
				type: [Boolean],
				default () {
					return false
				}
			},
			title: {
				type: [String],
				default () {
					return ''
				}
			},
			// 状态栏高度 如果有胶囊 会根据胶囊动态改变整体高度
			height: {
				type: [String, Number],
				default () {
					return 44
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
				statusBarHeight: uni.$z.systemInfo.statusBarHeight,
				navbarheight: 40, // 默认的是40px
				menuButtonInfo: { width: 0 }
			}
		},
		created() {
			// 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
			// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			// 如果存在胶囊 就按照胶囊来重新分配高度
			this.navbarheight = this.menuButtonInfo.height + ((this.menuButtonInfo.top) - this.statusBarHeight) * 2
			// console.log('--------->menuButtonInfo', this.navbarheight, this.menuButtonInfo)
			// #endif
		},
		methods: {
			// 返回
			back() {
				uni.$z.route({ type: 'back' })
			}
		},
		computed: {
			// 整体
			style() {
				let _style = this.customStyle
				// 默认属性必须有
				if (!_style.backgroundColor) {
					_style.backgroundColor = '#ffffff'
				}
				if (!_style.borderBottom) {
					_style.borderBottom = ''
				}
				if (!_style.color) {
					_style.color = this.titleColor
				}
				return _style
			},
			// 整体的高度 传入的this.height / 主要内容高度
			heightStyle() {
				let _style = { height: `${ this.navbarheight }px` }
				let offsetBottom = this.height - this.navbarheight
				// 如果传入的高度更大 应该取传入的高度，多余的高度应该直接变为padding-bottom
				if (offsetBottom > 0) {
					_style = { height: `${ this.height }px`, paddingBottom: `${ offsetBottom }px` }
				}
				// console.log('--------->_style', _style)
				return _style
			},
			// 主要内容高度 跟随胶囊 
			contentHeightStyle() {
				let _style = { height: `${ this.navbarheight }px` }
				// console.log(`--------->_style`, _style);
				return _style
			},
			// 文字颜色
			color() {
				return { color: this.customStyle.color || '#333333' }
			},
			// 状态栏高度 占位
			statusBarStyle() {
				return {
					'height': `${ this.statusBarHeight }px`
				}
			},
			// 胶囊占位
			menuButtonStyle() {
				return {
					'padding-right': `${ this.menuButtonInfo.width + 16 }px`
				}
			}
		},
		watch: {
			customStyle: {
				immediate: true,
				handler: (a) => {
					let color = '#000000'
					// 根据传入的颜色动态设置状态栏样式
					if (a.color) {
						color = a.color
					}
					uni.setNavigationBarColor({ frontColor: color, backgroundColor: '' })
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.z-navbar {
		position: fixed;
		left: 0;
		top: 0;
		width: 750rpx;
		z-index: 9;

		.z-navbar-status-bar {
			width: 750rpx;
		}

		.z-navbar-content {
			position: relative;
			width: 750rpx;
			flex-direction: row;

			.z-navbar-title {
				position: absolute;
				left: 225rpx;
				top: 0;
				width: 300rpx;
				height: 40px;

				.z-navbar-title-text {
					width: 300rpx;
					text-align: center;
					font-size: 16px;
				}
			}

			.z-navbar-left {
				padding-left: 16px;
				width: 375rpx;
				height: 40px;
				flex-direction: row !important;

				.z-navbar-left-back {
					line-height: 1;
				}
			}

			.z-navbar-right {
				width: 375rpx;
				height: 40px;
			}
		}
	}
</style>
