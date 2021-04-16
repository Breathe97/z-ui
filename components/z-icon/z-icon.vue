<template>
	<view>
		<z-image v-if="isImage" :customStyle="sizeStyle" :src="name"></z-image>
		<text v-else class="z-icon" :style="[iconStyle]">{{ glyphs[name] }}</text>
	</view>
</template>
<script>
	import zIcon from './static/iconfont.json'
	let glyphs = {}
	// 把引入的json文件遍历转为Unicode
	for (let icon of zIcon.glyphs) {
		glyphs[icon.name] = unescape(`%u${ icon.unicode }`)
	}
	// #ifdef APP-NVUE
	const domModule = uni.requireNativePlugin('dom')
	domModule.addRule('fontFace', {
		'fontFamily': 'zIcon',
		'src': 'url(\'https://at.alicdn.com/t/font_2301545_0s4y1xec0i8e.ttf\')'
	})
	// #endif
	export default {
		name: 'z-icon',
		props: {
			// 图标名称
			name: {
				type: [String],
				default () {
					return ''
				}
			},
			// 图标颜色
			color: {
				type: [String],
				default () {
					return '#333333'
				}
			},
			// 图标大小 px
			size: {
				type: [String, Number],
				default () {
					return '24'
				}
			}
		},
		data() {
			return {
				glyphs: glyphs,
			}
		},
		methods: {},
		computed: {
			// 通过props[name]，判断传入的是不是一张图片
			isImage() {
				return this.name.indexOf('/') !== -1
			},
			// 宽高
			sizeStyle() {
				return {
					width: `${ this.size }px`,
					height: `${ this.size }px`
				}
			},
			// 动态生成图标的样式
			iconStyle() {
				return {
					'color': this.color,
					'font-size': `${ this.size }px`,
					'line-height': `${ this.size }px`
				}
			}
		},
		watch: {},
	}
</script>
<style scoped lang="scss">
	/* #ifndef APP-NVUE */
	@font-face {
		font-family: zIcon;
		src: url('https://at.alicdn.com/t/font_2301545_0s4y1xec0i8e.ttf');
	}

	/* #endif */
	.z-icon {
		font-family: zIcon;
		text-decoration: none;
		text-align: center;
		font-style: normal;
	}
</style>
