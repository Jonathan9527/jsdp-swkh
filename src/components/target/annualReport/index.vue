<template>
	<div class="annualReport" id="annualReportkh">
		<el-tabs type="border-card" @tab-click="tabclick">
			<el-tab-pane :label="labelStyle(item)" v-for="(item,index) in arrs" :key="index">
				<div class="asstopWrap">
					<el-form :inline="true"  class="demo-form-inline">
						<el-form-item label="考核指标类型：">
							<el-select v-model="formInline" size="mini" placeholder="请选择考核指标类型" clearable @change="search">
								<el-option :label="value.model_name" :value="value.model_name" v-for="(value,index) in kaoheOptions" :key="index"></el-option>
							</el-select>
						</el-form-item>
						<div class="btnworpbox" style="display: inline-block;float:none;">
							<el-button type="primary" class="bluebtnclass"> 保存</el-button>
							<el-button type="primary" class="bluebtnclass" @click="submission"> 提交审核</el-button>
							<el-button type="primary" class="bluebtnclass" @click="addInd"> 添加指标</el-button>
						</div>
					</el-form>
				</div>
				<!-- 表格 -->
				<el-table :data="tableData" style="width: 100%;margin-top:10px;" stripe >
					<el-table-column label="指标一级">
						<el-table-column prop="one_name" label="指标内容" width="200"></el-table-column>
						<el-table-column prop="one_value" label="分值" width="80"></el-table-column>
					</el-table-column>
					<el-table-column label="指标二级">
						<el-table-column label="指标内容" width="200">
							<template slot-scope="scope">
								<el-popover placement="right" width="400" trigger="hover" :visible-arrow="false" popper-class="tipClass"
								 :content="scope.row.two_name">
									<el-input type="textarea" slot="reference" :row='3' v-model="scope.row.two_name"></el-input>
								</el-popover>
							</template>
						</el-table-column>
						<el-table-column label="分值" width="80">
							<template slot-scope="scope">
								<el-input size="mini" v-model="scope.row.two_value" class="textCenter"></el-input>
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="指标三级">
						<el-table-column label="指标内容" width="300">
							<template slot-scope="scope">
								<el-popover placement="right" width="400" trigger="hover" :visible-arrow="false" popper-class="tipClass"
								 :content="scope.row.three_name">
									<el-input slot="reference" type="textarea" :row='3' v-model="scope.row.three_name"></el-input>
								</el-popover>

							</template>
						</el-table-column>
						<el-table-column label="分值" width="80">
							<template slot-scope="scope">
								<el-input size="mini" v-model="scope.row.three_value" class="textCenter"></el-input>
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column prop="assessSystem" label="考核频度" width="">
						<template slot-scope="scope">
							<el-select placeholder="请选择" size="mini" v-model="scope.row.options2">
								<el-option v-for="item in scope.row.options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="appear" label="上报说明" width="">
						<template slot-scope="scope">
							<el-popover placement="right" width="400" trigger="hover" :visible-arrow="false" popper-class="tipClass"
							 :content="scope.row.three_content">
								<el-input slot="reference" type="textarea" :row='3' v-model="scope.row.three_content"></el-input>
							</el-popover>
						</template>
					</el-table-column>
				</el-table>
				
			</el-tab-pane>
		</el-tabs>
		<!-- 添加指标弹窗-->
		<el-dialog title="添加指标" :visible.sync="addIndictor"  v-dialogDrag :close-on-click-modal="false" width="50%" class="addrole proupClass">
			<div class="clearfix">
				<el-form ref="form" :model="addIndictorform" label-width="120px" onsubmit="return false">
					<!-- {{one_name}} -->
					<el-form-item label="一级指标内容：">
						<el-select v-model="addIndictorform.one_name" placeholder="请选择" clearable  value-key="one_name">
							<el-option v-for="item in oneNameOptions" :key="item.id" :label="item.one_name" :value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="一级指标分值：">
						<el-input size="mini" v-model="addIndictorform.one_value" class="scopestext"></el-input>
					</el-form-item>
					
					<el-form-item label="二级指标内容：">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model="addIndictorform.two_name.two_name"></el-input>
						<el-button type="primary" class="bluebtnclass" size="mini" @click="addIndtows">选择二级指标内容</el-button>
					</el-form-item>
					<el-form-item label="二级指标分值：">
						<el-input size="mini" v-model="addIndictorform.two_value" class="scopestext"></el-input>
					</el-form-item>
					<el-form-item label="三级指标内容：">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model="addIndictorform.three_name"></el-input>
					</el-form-item>
					<el-form-item label="三级指标分值：">
						<el-input size="mini" v-model="addIndictorform.three_value" class="scopestext"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addIndictor = false" size="medium" class="proupbtnquxiao">取 消</el-button>
				<el-button type="primary"  class="proupbtnqueding"  @click="addIndictor2" size="medium">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 二级指标添加 -->
		<el-dialog title="二级指标查看" :close-on-click-modal="false"  v-dialogDrag :visible.sync="addIndictortow" width="50%" class="addrole proupClass">
			<!-- {{tableData}} -->
			<div class="clearfix">
				<el-table ref="multipleTable" :data="oneNameOptions" tooltip-effect="dark" style="width: 100%" stripe>

					<el-table-column width="55">
						<template slot-scope="scope">
							<el-radio :label="scope.row.two_name" v-model="radio" @change.native="getCurrentRow(scope.row)">&nbsp;</el-radio>
						</template>

					</el-table-column>
					<el-table-column label="二级指标列表" style="width: 100%">
						<template slot-scope="scope">{{ scope.row.two_name }}</template>
					</el-table-column>
				</el-table>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addIndictortow = false" class="proupbtnquxiao" size="medium">取 消</el-button>
				<el-button type="primary"  class="proupbtnqueding" @click="addIndictortow2" size="medium">确 定</el-button>
			</span>
		</el-dialog>


	</div>
</template>

<script>
	export default {
		data() {
			return {
				//添加指标弹窗一级指标下拉框
				radio: '',
				oneNameOptions: [],
				towNameOptions: [],
				kaoheOptions:[],
				//表格
				tableData: [],

				//选项卡
				arrs: [{
					notFiled: "未提交",
				}, {
					notFiled: "审核中",
				}, {
					notFiled: "已退回",
				}, {
					notFiled: "已审核",
					
				}],
				addIndictor: false, // 添加指标
				addIndictortow: false, // 添加二级指标
				//初始化弹窗
				addIndictorform: {
					model_name:"",
					one_id:"",
					one_name: "",
					one_value: "",
					two_id:"",
					two_name:{},
					two_value: "",
					three_name: "",
					three_value: "",
				},
				formInline: '',
				erjizhi:''
			}
		},
		methods: {
			addInd() { //添加指标
				this.addIndictor = true
				this.quchong(this.tableData, this.oneNameOptions, "one_name")
			},
			addIndtows() { //二级指标添加
				this.addIndictortow = true
				this.quchong(this.tableData, this.towNameOptions, "tow_name")
			},

			// 添加指标
			addIndictor2() {
				let params = {
					model_name:this.formInline,
					one_id:this.addIndictorform.one_name.one_id,
					one_name: this.addIndictorform.one_name.one_name,
					one_value: this.addIndictorform.one_value,
					two_id:"",
					two_name: this.addIndictorform.two_name.two_name,
					two_value: this.addIndictorform.two_value,
					three_name: this.addIndictorform.three_name,
					three_value: this.addIndictorform.three_value,
				}
			
				if(this.addIndictorform.two_name.two_name == this.erjizhi){
					params.two_id = this.addIndictorform.two_name.two_id
				}
				
				this.$http.post(globalConfig.server2 + 'modelContent/insertModelContent', params).then(res => {
					if (res.data.response_code === '0') {
		
						this.$message({
							type: 'success',
							message: '添加成功!'
						});
						this.addIndictorform = {
							one_id:"",
							one_name: "",
							one_value: "",
							two_id:"",
							two_name:{},
							two_value: "",
							three_name: "",
							three_value: "",
						}
						this.addIndictor = false
						this.search()
					} else {

					}

				})
			},

			//提交审核
			submission() {
				let params = {
					model_name: this.formInline,
				}
				this.$http.post(globalConfig.server2 + 'model/updateAudit_status', params).then(res => {
					if (res.data.response_code === '0') {
						this.$message({
							type: 'success',
							message: '提交成功!'
						});
						this.tableData = []
					} else {

					}

				})
			},

			//选择二级指标内容
			addIndictortow2() {
				this.addIndictortow = false
			},

			getCurrentRow(val) {
				this.addIndictorform.two_name = JSON.parse(JSON.stringify(val)) 
				this.erjizhi = val.two_name
		
			},
			//选项卡
			labelStyle(item) {
				if (item.notFiled == '未提交') {
					return item.notFiled + "（" + 0 + "）"
				} else if (item.notFiled == '审核中') {
					return item.notFiled + "（" + 0 + "）"
				} else if (item.notFiled == '已退回') {
					return item.notFiled + "（" + 0 + "）"
				} else if (item.notFiled == '已审核') {
					return item.notFiled + "（" + 0 + "）"
				}

			},
			clearData() {
				this.addIndictorform = {}
			},
			tabclick(val) {
		
			},

			//查询
			search() {
				let params = {
					model_name: this.formInline,
				}
				this.$http.post(globalConfig.server2 + 'modelContent/selectModelContentByMsg', params).then(res => {
					if (res.data.response_code === '0') {
						
						this.tableData = res.data.response_body
						
						if(res.data.response_body == []){
							this.$message({
								type: 'success',
								message: '暂无数据!'
							});
						}
						
					} else if(res.data.response_code === '1'){
						
					}

				})
			},
			//指标模型下拉
			searchOption(){
				let de = JSON.parse(sessionStorage.getItem('personal')).roleData.department.id
				let params ={
					department_id: de
				}
				this.$http.post(globalConfig.server2 + 'modelContent/selectModelName',params).then(res =>{
					if(res.data.response_code == "0"){
						this.kaoheOptions = res.data.response_body
					}
				})
			},
			//去重
			quchong(oldArr, newArr, val) {
				for (var i = 0; i < oldArr.length; i++) {
					var flag = true;
					for (var j = 0; j < newArr.length; j++) {
						if (oldArr[i][val] == newArr[j][val]) {
							flag = false;
						};
					};
					if (flag) {
						newArr.push(oldArr[i]);
					};
				};
				return newArr
		
			}

		},
		mounted() {
			this.search()
			this.searchOption()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
	.el-tabs--border-card {
		min-height: 575px;
		margin-top: 10px;
	}

	.el-row {
		margin-top: 60px;
	}

	.el-row .sumintBtn {
		margin-left: 60px;
	}

	.scopestext {
		width: 60px;
	}

	.asstopWrap {
		margin-top: 10px;
		padding-bottom: 5px;
		overflow: hidden;

		.btnworpbox {
			float: right;
			
			button {
				margin-left: 20px;
			}
		}
	}

	.el-form-item__label {
		font-size: 16px;
	}

	.el-select-dropdown__item {
		font-size: 16px;
	}

	.subBtns {
		margin-top: 20px;

		button {
			margin-right: 20px;
		}
	}
</style>
<style lang="scss">
	#annualReportkh {
		.el-input--mini .el-input__inner {
			height: 38px;
			line-height: 38px;
		}

		.el-form-item__label {
			font-size: 16px;
			line-height: 42px;
		}

		.textCenter {
			input {
				text-align: center;
			}
		}
	}
</style>
