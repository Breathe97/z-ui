<template>
	<view v-if="visible">
		<view class="z-tabbar" :blurEffect="blurEffect" :style="[style]">
			<view class="z-flex z-tabbar-content" :style="[heightStyle]">
				<view class="z-flex-1 z-flex-col z-row-center z-col-center z-tabbar-item" :style="[heightStyle]" v-for="(item,index) in list" :key="index" @click="selectClick(index)">
					<image class="z-tabbar-item-icon" :src="active(index)?item.selectedIconPath:item.iconPath"></image>
					<text class="z-text z-tabbar-item-text" :style="[active(index)?textSelectStyle:textStyle]">{{ item.text }}</text>
				</view>
			</view>
			<view :style="[safeAreaInsetsStyle]"></view>
		</view>
		<!-- 除ios页面中需要额外处理下面的占位 -->
		<template v-if="platform !== 'ios'">
			<view style="z-index: -1;" :style="[heightStyle]"></view>
			<view style="z-index: -1;" :style="[safeAreaInsetsStyle]"></view>
		</template>
	</view>
</template>

<script>
	export default {
		name: 'z-tabbar',
		props: {
			options: {
				type: [String, Number, Object, Boolean, Array],
				default () {
					return ''
				}
			},
			// 默认状态
			value: {
				type: [Number],
				default () {
					return 0
				}
			},
			// 模糊效果 dark -暗风格模糊 ; extralight -高亮风格模糊;light -亮风格模糊;none -无模糊效果
			blurEffect: {
				type: [String],
				default () {
					return 'none'
				}
			},
			// 选项卡集合
			list: {
				type: [Array],
				default () {
					return []
				}
			},
			// 高度 px
			height: {
				type: [String, Number],
				default () {
					return 60
				}
			},
			// 自定义样式
			customStyle: {
				type: [Object],
				default () {
					return {}
				}
			},
			// 文字默认的样式
			textStyle: {
				type: [Object],
				default () {
					return {
						color: '#666666'
					}
				}
			},
			// 文字选中的样式
			textSelectStyle: {
				type: [Object],
				default () {
					return {
						color: '#2A85FD'
					}
				}
			}
		},
		data() {
			return {
				visible: false, // 当前组件状态
				platform: uni.$z.systemInfo.platform // 客户端平台，值域为：ios、android
			}
		},
		async created() {
			await this.$nextTick()
			await uni.$z.setTimeout(0)
			// 等待首页渲染完成再执行关闭否在在ios上adjustBottom可能存在偏差
			// 隐藏底部导航栏 隐藏后再显示自定义的tabbar
			uni.hideTabBar({
				success: () => {
					this.visible = true
				}
			})
		},
		methods: {
			// 选择菜单
			selectClick(index) {
				this.$emit('input', index) // 修改外层v-model的idnex值
				// uni.$z.sensation() // 触感
			}
		},
		computed: {
			// 整体
			style() {
				let _style = this.customStyle
				// 如果激活了模糊效果 并且没有设置背景颜色 那么在ios上背景会自动变为透明以便实现模糊效果
				// #ifdef APP-NVUE
				if (this.platform === 'ios' && this.blurEffect !== 'none' && !_style.backgroundColor) {
					_style.backgroundColor = 'rgba(255,255,255,0)'
				}
				// #endif
				// 强制属性 因为这是计算后的整体高度
				if (!_style.height) {
					_style.height = `${ this.height + Math.abs(uni.$z.safeAreaInsets) }px`
				}
				// console.log('--------->_style', _style)
				return _style
			},
			// 高度
			heightStyle() {
				return { 'height': `${ this.height }px` }
			},
			// 底部安全距离
			safeAreaInsetsStyle() {
				return {
					'width': '750rpx',
					'height': `${ uni.$z.safeAreaInsets }px`
				}
			},
			active() {
				return function(index) {
					return (this.value == index)
				}
			}
		},
		watch: {},
	}
</script>

<style lang="scss">
	.z-tabbar {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 750rpx;
		background-color: #ffffff;

		.z-tabbar-content {
			width: 750rpx;

			.z-tabbar-item {
				.z-tabbar-item-icon {
					height: 24px;
					width: 24px;
				}

				.z-tabbar-item-text {
					margin-top: 10px;
					height: 15px;
					line-height: 15px;
					font-size: 12px;
					color: #666666;
				}
			}
		}
	}
</style>
