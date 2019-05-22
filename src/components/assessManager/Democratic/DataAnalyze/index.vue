<template>
	<div class="DataAnalyze"  id='dataanlyCalssh'>
		<div class="headlineWrap" v-show="yincang">
			<p class="martop">分析类型选择</p>
			<div class="radioTop">
				<el-radio v-model="radio" label="1">党政班子</el-radio>
				<el-radio v-model="radio" label="2">党政成员</el-radio>
			</div>
		</div>
		<div class="analyzeContent">
			<p class="martop" v-show="yincang">分析属性选择</p>
			<div class="checkedbox">
				<dangzhengbanzi v-show="radio==1" ></dangzhengbanzi>
				<dangzhengcy v-show="radio==2"  @close="closeModles"></dangzhengcy>
			</div>
		</div>

	</div>
</template>
<script>
	import dangzhengbanzi from "./compontents/dangzhengbanzi.vue"
	import dangzhengcy from "./compontents/dangzhengcy.vue"

	
	export default {
		components: {
			dangzhengbanzi,
			dangzhengcy,
		},
		data() {
			return {
        radio: '1',
        yincang:true,
        banziShow:false
			}
		},
		methods: {
			closeModles(val){
        this.yincang = val
      }
		},
		mounted() {

		}

	}
</script>
<style scoped lang="scss">
	.DataAnalyze {
		.headlineWrap {
			padding: 30px 0px 20px 5px;
			overflow: hidden;

			.radioTop {
				margin: 25px 0;
			}

			p {
				display: inline-block;
				font-size: 20px;
				color: #333;
			}

			button {
				float: right;
			}

		}
		.martop {
			font-weight: bolder;
			color: #000;
		}
		.analyzeContent {
			padding: 0px 0px 20px 5px;
			overflow: hidden;
			width: 100%;

			p {
				display: inline-block;
				font-size: 20px;
				color: #333;
			}

			.checkedbox {
				margin: 25px 0;
				vertical-align: text-top;
				width: 100%;
			}
		}
	}
</style>
<style lang="scss">
	#dataanlyCalssh {
		.radioTop {
			.el-radio__label {
				font-size: 18px;
			}
		}

	}
</style>
