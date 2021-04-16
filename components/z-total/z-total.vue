<template>
	<view class="z-total z-flex z-row-center" :style="[style]">
		<text class="z-text">{{ text }}</text>
	</view>
</template>
<script>
	import mixin from '../../libs/mixin/mixin.js'
	export default {
		name: 'z-total',
		mixins: [mixin],
		props: {
			// 文本内容
			text: {
				type: [String],
				default () {
					return '提示内容'
				}
			},
			// 动画时间
			duration: {
				type: [String, Number],
				default () {
					return 500
				}
			},
			// 自定义样式
			customStyle: {
				type: [Object],
				default () {
					return {}
				}
			},
			// 弹出方向 top / bottom / center
			mode: {
				type: [String],
				default () {
					return 'bottom'
				}
			}
		},
		data() {
			return {
				visible: false, // 当前组件状态
				rendering: false, // 组件渲染状态
				options: {}, // 所有参数设置
				style: {} // 组件内的动态样式
			}
		},
		async mounted() {
			await this.initStyle() // 渲染组件关闭状态的样式
		},
		methods: {
			// 初始化组件样式
			async initStyle(options = {}) {
				this.options = await this.optionsInit(options) // 初始化options参数
				this.style.transform = 'scale(0)' // 缩放为0
				await this.styleChange(false, false) // 组件关闭时的样式
			},
			// 指令调用
			async show(visible = true) {
				let { duration } = this.options
				this.styleChange(true, false) // 开启
				await uni.$z.setTimeout(300)
				this.styleChange(false) // 关闭
			},
			// 改变当前组件样式,开启状态？关闭状态，改变时是否使用动画过渡
			async styleChange(visible = true, transition = true) {
				this.style = JSON.parse(JSON.stringify(this.style))
				let { duration, zIndex, mode } = this.options
				let obj = {
					'top': 'auto', // 这里需要重置 不然nvue上会保留上次的自定义传入的值 无解 垃圾
					'bottom': 'auto',
					'z-index': '9998',
					'background-color': 'rgba(0, 0, 0, 0.3)',
					'transition-property': transition ? 'opacity, transform' : 'none',
					'transition-timing-function': 'ease-out',
					'transition-duration': `${ duration }ms`
				}
				switch (mode) {
					case 'top':
						obj.top = '200rpx'
						break
					case 'center':
						// obj.top = '200rpx'
						break
					case 'bottom':
						obj.bottom = '200rpx'
						obj.transform = visible ? 'translateY(0)' : `translateY(200rpx)`
						break
				}
				obj = { ...obj, ...this.options.customStyle } // 合并customStyle, 用户配置的style优先级最高 操作不当可破坏组件本身
				obj.opacity = visible ? '1' : '0' // 通过opacity来控制dom的渐变效果
				this.style = { ...this.style, ...obj }
				// console.log('--------->this.style', this.style)
			},
		},
		computed: {},
		watch: {},
		provide() {
			return {
				_this: this // provide->inject 传递父级组件的this
			}
		},
		inject: ['_this'] // provide->inject 接收父级组件的this, this._this
	}
</script>
<style scoped lang="scss">
	.z-total {
		position: fixed;
		left: 150rpx;
		height: 70rpx;
		opacity: 1;
		background-color: rgba(0, 0, 0, 0.3);
		bottom: 200rpx;
		width: 450rpx;
		// transform: scale(0);
		border-radius: 6rpx;
		// transition-property: opacity, transform;
		// transition-timing-function: ease-out;
		// transition-duration: 300ms;

		animation-name: mymove;

		.z-text {
			color: #ffffff;
		}
	}

	@keyframes mymove {
		from {
			background-color: red;
		}

		to {
			background-color: blue;
		}
	}

	/*Safari 和 Chrome:*/
	@-webkit-keyframes mymove {
		from {
			background-color: red;
		}

		to {
			background-color: blue;
		}
	}
</style>
