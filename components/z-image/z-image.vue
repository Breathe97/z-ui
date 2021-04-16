<template>
	<view class="z-image">
		<image :src="imageSrc" :style="[customStyle]" :mode="mode"></image>
	</view>
</template>
<script>
	export default {
		name: 'z-image',
		props: {
			// mode
			mode: {
				type: [String],
				default () {
					return ''
				}
			},
			// 资源路径
			src: {
				type: [String],
				default () {
					return ''
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
			return {}
		},
		computed: {
			// 处理传入的是图片
			imageSrc() {
				let _src = this.src
				// 如果是网络地址直接使用
				if (_src.indexOf('http') === 0) return _src
				// 这里遵循vue方式传入@表示根路径，然后自动处理不同平台的资源路径
				if (_src.indexOf('@/') === 0) {
					_src = _src.replace('@/', '../../')
					// #ifdef MP-WEIXIN
					_src = `../${ _src }` // 微信小程序相对路径会多一个../ ,原因是小程序相对路径是根据z-icon这个组件当前位置往回退的，而app端是相对当前页面的路径资源
					// #endif
					// console.log(`--------->_src`, _src);
					return _src
				}
			}
		},
	}
</script>
<style scoped lang="scss">

</style>
