<template>
	<view class="z-flex z-input" v-if="visible">
		<input class="z-flex-row-1" v-model="inputText" :disabled="inputType==='select'" :type="inputType" :focus="inputFocus" :placeholder="placeholder" :style="[customStyle,colorStyle,backgroundColorStyle,heightStyle,fontSizeStyle]" :placeholder-style="placeholderStyle" />
		<view class="z-flex z-input-select" v-if="inputType==='select'" @touchend.prevent="clearInput">
			<z-icon class="z-flex" name="arrow-right" size="20" :color="customStyle.color"></z-icon>
		</view>
		<view class="z-flex z-input-clear" v-else-if="inputText && clear" @touchend.prevent="clearInput">
			<z-icon class="z-flex" name="clear" size="20" :color="customStyle.color"></z-icon>
		</view>
		<view class="z-input-view" v-if="lookPassword && type==='password'" @click="changeType">
			<z-icon class="z-flex" :name="inputType==='password'?'show':'hide'" size="20" :color="customStyle.color"></z-icon>
		</view>
		<view class="z-input-right" v-if="$slots['right']">
			<slot name="right"></slot>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'z-input',
		props: {
			// 输入框类型
			type: {
				type: [String],
				default () {
					return 'text'
				}
			},
			// 默认状态
			value: {
				type: [String],
				default () {
					return ''
				}
			},
			// 输入框提示
			placeholder: {
				type: [String],
				default () {
					return ''
				}
			},
			// 提示语样式
			placeholderStyle: {
				type: [String],
				default () {
					return ''
				}
			},
			// 是否加一个清除按钮
			clear: {
				type: [Boolean],
				default () {
					return false
				}
			},
			// 是否自动获取焦点
			focus: {
				type: [Boolean],
				default () {
					return false
				}
			},
			// 是否可以查看密码
			lookPassword: {
				type: [Boolean],
				default () {
					return false
				}
			},
			// 自定义样式
			customStyle: {
				type: [Object],
				default () {
					return {}
				}
			},
		},
		data() {
			return {
				visible: false, // 当前组件状态
				inputText: '',
				inputType: '',
				inputFocus: false,
			}
		},
		created() {
			this.inputText = this.value
			this.inputType = this.type
			this.visible = true // 只有当this.inputType改变后才渲染
			this.inputFocus = this.focus
		},
		methods: {
			// 清除
			async clearInput(e) {
				this.inputFocus = false
				this.inputText = ''
				await uni.$z.setTimeout(10)
				this.inputFocus = true
			},
			// 密码显示隐藏
			changeType() {
				if (this.inputType === 'text') {
					this.inputType = 'password'
				} else {
					this.inputType = 'text'
				}
			}
		},
		computed: {
			fontSizeStyle() {
				return {
					fontSize: this.customStyle.fontSize || '14px'
				}
			},
			heightStyle() {
				return {
					height: this.customStyle.height || '80rpx'
				}
			},
			colorStyle() {
				return {
					color: this.customStyle.color || '#333333'
				}
			},
			backgroundColorStyle() {
				return { backgroundColor: this.customStyle.backgroundColor || '#ffffff' }
			},
		},
		watch: {
			inputText(a) {
				this.$emit('input', this.inputText) // 修改外层v-model的值
			}
		},
	}
</script>
<style scoped lang="scss">
	.z-input {

		.z-input-select,
		.z-input-clear,
		.z-input-view,
		.z-input-right {
			padding: 0 10rpx;
		}
	}
</style>
