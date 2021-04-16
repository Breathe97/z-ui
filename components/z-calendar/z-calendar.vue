<template>
	<view class="z-calendar">
		<view class="z-flex z-row-center options">
			<view class="z-flex z-row-center options-item" @click="changeCurrent(-12)">
				<z-icon name="arrow-left-double" size="20"></z-icon>
			</view>
			<view class="z-flex z-row-center options-item" @click="changeCurrent(-1)">
				<z-icon name="arrow-left" size="20"></z-icon>
			</view>
			<view class="z-flex z-row-center options-text">
				<text class="z-text z-text-center options-text">{{ months[current].title }}</text>
			</view>
			<view class="z-flex z-row-center options-item" @click="changeCurrent(1)">
				<z-icon name="arrow-right" size="20"></z-icon>
			</view>
			<view class="z-flex z-row-center options-item" @click="changeCurrent(12)">
				<z-icon name="arrow-right-double" size="20"></z-icon>
			</view>
		</view>
		<view class="z-flex z-row-center lable">
			<view class="z-flex z-row-center lable-item" v-for="(item,index) in lable" :key="index">
				<text class="z-text">{{ item }}</text>
			</view>
		</view>
		<swiper class="z-flex z-row-between month" :duration="300" :current="current" :circular="circular" @change="change" @animationfinish="animationfinish">
			<swiper-item class="z-flex z-row-center z-flex-wrap month-item" v-for="(month,monthIndex) in months" :key="monthIndex">
				<view class="z-flex z-row-center month-bg-text"><text class="z-text">{{ month.text }}</text></view>
				<view class="z-flex z-row-center day" v-for="(day,dayIndex) in month.days" :key="dayIndex">
					<view class="day-bg-left" :class="[`day-bg-left-${ shape }`]"></view>
					<view class="day-bg-right" :class="[`day-bg-right-${ shape }`]"></view>
					<view class="z-flex z-row-center day-text" :class="[`day-text-${shape}`]">
						<text class="z-text">{{ day ? day.text : '' }}</text>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	// 草稿
	// 所以舍弃 重新构建 渲染左中右三个轮播
	// 滑动完成后把index修正为1， 并且根据当前月重新生成左右两月
	export default {
		name: 'z-calendar',
		props: {
			// 形状：方块？圆形 square circle
			shape: {
				type: [String],
				default () {
					return 'circle' // square circle
				}
			},
		},
		data() {
			return {
				lable: ['日', '一', '二', '三', '四', '五', '六'],
				current: 0,
				noChange: false,
				oldCurrent: 0,
				circular: true, // 是否能够继续滑动
				months: [], // 日历合集
				month: {}, // 当前显示的月
				list: [], // 已选择的列表
				key: 0
			}
		},
		created() {
			this.initDays('1970', '05')
		},
		methods: {
			animationfinish(e) {
				// console.log(`--------->e`, e);
				// if (this.current = 0) {
				// 	// this.current = 0
				// 	this.current = 4
				// }
				this.current = 4
				this.months = this.months.slice(1, 12)
				console.log('--------->this.months', this.months)
			},
			// 按钮切换日历
			changeCurrent(num) {
				// if (!this.circular && this.current === 0 && num === -1) return
				let month = this.months[this.current]
				let timeStamp = new Date(month.timeStr).getTime()
				let y = uni.$z.timeFormat(timeStamp, 'yyyy')
				let m = uni.$z.timeFormat(timeStamp, 'mm')
				y = Number(y) // 转为数字方便下面计算
				// 向左
				switch (num) {
					case -12:
						// 把整个日历全部向后一年
						if (y === 1970) return
						y = y - 1
						this.initDays(y, m)
						break
					case -1:
						// 如果是1月需要变成前一年的12月
						if (this.current === 0) {
							this.change({ detail: { current: 11 } })
						} else {
							this.change({ detail: { current: this.current + num } })
						}
						break
					case 1:
						// 如果是12月需要变为后一年的1月
						if (this.current === 11) {
							this.change({ detail: { current: 0 } })
						} else {
							this.change({ detail: { current: this.current + num } })
						}
						break
					case 12:
						// 把整个日历全部向后一年
						y = y + 1
						this.initDays(y, m)
						break
					default:
						break
				}
			},
			// 监听滑动后需要更改dayConfig，以准备下一次的滑动 并且当为1970/01，不允许重复滑动
			change(e) {
				// console.log(`--------->e`, e);

				if (this.noChange) return
				// this.circular = true // 滑动结束后默认是可以继续滑动的
				// 如果传入的是1970/02 那么current为1，
				const { current } = e.detail
				this.current = current
				// if (current < 3) {
				// 	this.current = 2
				// 	this.circular = false
				// 	console.log(`--------->this.circular `, this.circular);
				// 	return
				// }
				// console.log('--------->{ current, source }', { current, source })
				let month = this.months[current]
				let timeStamp = new Date(month.timeStr).getTime()
				let y = uni.$z.timeFormat(timeStamp, 'yyyy')
				let m = uni.$z.timeFormat(timeStamp, 'mm')
				y = Number(y) // 转为数字方便下面计算
				m = Number(m) // 转为数字方便下面计算
				// 但是如果当前的时间是1970/01 那么不允许再向左滑动
				// console.log('--------->y,m', y, m)
				if (y === 1970 && m < 3) {
					// this.circular = false
					// this.key = new Date().getTime()
					// console.log('--------->不生成', )
					return
				}
				// 开始生成新的月份
				let _y = y // 默认为当前年
				let _m = m // 默认为当前月
				// 向左滑动 把左边第三个修改成预期的月历
				if (this.oldCurrent - current === 1 || this.oldCurrent - current === -11) {
					// console.log(`--------->向左,${this.oldCurrent}->${current}当前月份${month.timeStr}`, )
					if (_m === 1 || _m === 2) {
						_m = 12 - (2 - _m)
						_y = _y - 1
					} else {
						_m = m - 2
					}
				}
				// 向右滑动 把右边第三个修改成预期月历
				if (this.oldCurrent - current === -1 || this.oldCurrent - current === 11) {
					// console.log(`--------->向右,${this.oldCurrent}->${current}当前月份${month.timeStr}`, )
					if (_m === 11 || _m === 12) {
						_m = (_m + 2) - 12
						_y = _y + 1
					} else {
						_m = m + 2
					}
				}
				_m = `${ _m }`.length === 1 ? `0${ _m }` : `${ _m }` // 补足位数
				let _month = {
					days: this.generateDays(_y, _m),
					text: _m,
					title: `${ _y }年${ _m }月`,
					timeStr: `${ _y }/${ _m }/01 00:00:00`
				}
				this.months.splice(Number(_m) - 1, 1, _month)
				this.oldCurrent = current // 记录上一次的current
			},
			// 初始化日历 传入y:年份,m-月份,自动生成一年的日历[1,2,3,4,5,6,7,8,9,10,11,12]
			initDays(y = '', m = '') {
				this.noChange = true // 初始化前 应该关闭change的监听 因为下面的current会动态改变 有影响
				// 如果都是0那就默认为当前时间
				const today = new Date().getTime() // 当前时间 时间戳
				// 传入不合法参数默认为今天
				if (!y) {
					y = uni.$z.timeFormat(today, 'yyyy')
				}
				if (!m || Number(m) > 12) {
					m = uni.$z.timeFormat(today, 'mm')
				}
				y = Number(y) // 转为数字方便下面计算
				m = Number(m) // 转为数字方便下面计算
				this.current = m - 1
				let _y, _m // 即将生成的日历 年 月
				// 遍历生成12个日历
				this.months = []
				for (let i = 0; i < 12; i++) {
					// console.log('--------->i', i, m)
					_y = `${ y }` // y不变
					_m = i + 1
					_m = `${ _m }`.length === 1 ? `0${ _m }` : `${ _m }` // 补足位数
					let month = {
						days: this.generateDays(_y, _m),
						text: _m,
						title: `${ _y }年${ _m }月`,
						timeStr: `${ _y }/${ _m }/01 00:00:00`
					}
					this.months.push(month)
				}
				this.noChange = false
				// console.log('--------->this.months', this.months)
			},
			// 生成日历 传入y:年份,m-月份 这里需要自动补位
			generateDays(y = 0, m = 0) {
				// console.log('--------->传入y,m', y, m)
				// 对y和m做一个限制，防止传入异常数据
				if (y < 1970) {
					y = 1970 // 最小为1970年
				}
				if (m < 0) {
					m = 1 // 最小为1月
				}
				if (m > 12) {
					m = 12 // 最大为12月
				}
				const timeStamp = new Date(`${ y }/${ m }/01 00:00:00`).getTime() // 该月份的第一天
				const dayTimeStamp = 1000 * 60 * 60 * 24 // 一天的毫秒数
				let days = []
				// 从该月份第一个天开始遍历31天
				for (let i = 1; i <= 31; i++) {
					let _timeStamp = timeStamp + (i - 1) * dayTimeStamp // 从第一天开始计算后31天的时间戳
					let _m = uni.$z.timeFormat(_timeStamp, 'mm') // 当前月份
					if (m !== _m) {
						break // 如果当前月已经不是传入的月份 结束循环
					}
					i = `${ i }`.length === 1 ? `0${ i }` : `${ i }` // 天数需要两位数如01日
					let day = {
						timeStamp: _timeStamp,
						timeStr: `$ {y }/${ m }/${ i } 00:00:00`, // 时间字符串格式
						text: i, // 天数 数字
						isToday: false, // 是否为今天
						disabled: false, // 是否被禁用 (后面单独处理 当这一天所有时间都被禁用才会被禁用)
					}
					days.push(day)
				}
				// 处理当前合集 如果第一天不是周日就往前添加null，占位
				let workingcase = new Date(timeStamp).getDay()
				// 循环workingcase-1天 填充当月的天合集
				for (let i = 0; i <= (workingcase - 1); i++) {
					days.unshift(null)
				}
				const lastLength = 7 - (days.length % 7)
				// 再次循环后面填充占位到能被7整除
				for (let i = 0; i < lastLength; i++) {
					days.push(null)
				}
				return days
			}
		},
	}
</script>

<style lang="scss" scoped>
	.z-calendar {
		background-color: #ffffff;
		width: 750rpx;
		padding: 0 32rpx;

		.options {
			width: 686rpx;
			height: 90rpx;

			.options-item {
				width: 60rpx;
			}

			.options-text {
				width: 200rpx;
			}
		}

		.lable {
			width: 686rpx;
			height: 90rpx;

			.lable-item {
				height: 90rpx;
				width: 98rpx;
			}
		}

		.month {
			width: 686rpx;
			height: 540rpx;

			.month-item {
				position: relative;

				.month-bg-text {
					position: absolute;
					width: 100rpx;
					height: 100rpx;
					left: 293rpx;
					top: 220rpx;

					.z-text {
						font-size: 290rpx;
						color: #F4F4F4;
					}
				}

				.day {
					position: relative;
					height: 90rpx;
					width: 98rpx;

					.day-bg-left,
					.day-bg-right {
						flex: 1;
					}

					.day-bg-left-square,
					.day-bg-right-square {
						height: 80rpx;
						// background-color: rgba(42, 130, 253, 0.1);
					}

					.day-bg-left-circle,
					.day-bg-right-circle {
						height: 70rpx;
						// background-color: rgba(42, 130, 253, 0.1);
					}

					.day-text {
						position: absolute;
					}

					.day-text-square {
						left: 9rpx;
						top: 5rpx;
						width: 80rpx;
						height: 80rpx;
						border-radius: 10rpx;
					}

					.day-text-circle {
						left: 14rpx;
						top: 10rpx;
						width: 70rpx;
						height: 70rpx;
						border-radius: 50%;
					}
				}
			}
		}
	}
</style>
