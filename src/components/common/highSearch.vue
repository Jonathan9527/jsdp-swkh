<template>
  <div>
    <div id="highRanking">
      <div :class="showHigh">
        <el-form :inline="true" onsubmit="return false" size="mini">
          <el-form-item>
            <el-input v-model="keywords" placeholder="请输入关键字" @keyup.enter.native="searchWord()"
                      class="search_input" clearable>
              <el-button @click="searchWord()" slot="append" type="primary" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="highGrade">高级</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="high_grade" v-show="isHigh">
        <el-form :inline="true" onsubmit="return false" :model="params" size="mini" label-width="100px">
          <div class="filterTitle">
            <i class="el-icons-fa-bars"></i>&nbsp;&nbsp;高级搜索
          </div>
          <el-row class="el_row_border">
            <el-col :span="12" class="el_col_border" v-for="(item,index) in list" :key="item.type"
                    :class="{'noBottom': list.length%2 !== 0 && list.length - 1 === index}">
              <el-row>
                <el-col :span="8">
                  <div class="el_col_label">{{item.label}}</div>
                </el-col>
                <el-col :span="16" class="el_col_option">
                  <!--组织架构-->
                  <el-form-item v-if="item.showType.includes('organ')">
                    <el-input v-model="organParam[item.paramKey]" :placeholder="item.placeholder"
                              :readonly="item.readonly"
                              @focus="openOrgan(item.organParams)">
                      <el-button slot="append" icon="el-icon-search" @click="emptyOrgan(item.paramKey)">清空</el-button>
                    </el-input>
                  </el-form-item>
                  <!--输入框-->
                  <el-form-item v-if="item.showType.includes('input')">
                    <el-input v-model="params[item.paramKey]" :placeholder="item.placeholder" :readonly="item.readonly"
                              clearable></el-input>
                  </el-form-item>
                  <!--时间范围-->
                  <el-form-item v-if="item.showType.includes('dateRange')">
                    <el-date-picker
                      v-model="params[item.paramKey]"
                      :type="item.inputType"
                      :picker-options="pickerOptions"
                      :value-format="item.format"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      align="right">
                    </el-date-picker>
                  </el-form-item>
                  <!--时间筛选-->
                  <el-form-item v-if="item.showType.includes('dateTime')">
                    <el-date-picker
                      v-model="params[item.paramKey]"
                      :type="item.inputType"
                      :value-format="item.format"
                      :placeholder="item.placeholder"
                      align="right"
                      clearable
                      :picker-options="pickerOptions">
                    </el-date-picker>
                  </el-form-item>
                  <!--下拉框-->
                  <el-form-item v-if="item.showType.includes('select')">
                    <el-select v-model="params[item.paramKey]" :placeholder="item.placeholder" clearable>
                      <el-option v-for="val in item.value" :label="val.dictionary_name" :value="val.id"
                                 :key="val.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <div class="btnOperate" :class="{'btnOperateTop': list.length%2 !== 0}">
            <el-button type="primary" size="mini" @click="search">搜索</el-button>
            <el-button type="primary" size="mini" @click="resetting">重置</el-button>
            <el-button type="primary" size="mini" @click="highGrade">取消</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <!--组织架构-->
    <Organization :module="organModule" @close="organModule = false" @succeed="closeOrgan" :data="form"></Organization>
  </div>
</template>

<script>
  import Organization from './organization.vue'

  export default {
    name: "high-search",
    components: {Organization},
    props: ['highData','showHigh'],
    data() {
      return {
        keywords: '',
        isHigh: false,//高级 show/hide
        params: {},//搜索数据
        organParam: {},//组织架构
        list: [],//筛选列表
        organModule: false,//组织架构
        form: {},//组织架构
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      highData(val) {
        this.list = val;
      }
    },
    computed: {},
    methods: {
      // 组织架构
      openOrgan(params) {
        this.form = params;
        this.organModule = true;
      },
      closeOrgan(val, params) {
        if (val) {
          this.params[params.key] = val[0].id;
          this.organParam[params.key] = val[0].name;
        }
        this.organModule = false;
      },
      searchWord() {
        let form = {};
        this.list.forEach((res) => {
          form[res.paramKey] = res.valueType;
          for (let key in form) {
            for (let item in this.params) {
              if (key === item) {
                form[key] = this.params[key];
              }
            }
          }
        });
        form.keywords = this.keywords;
        this.$emit('onSearch', form);
      },
      search() {
        this.searchWord();
        this.highGrade();
      },
      // 清空部门 / 员工
      emptyOrgan(key) {
        this.params[key] = '';
        this.organParam[key] = '';
        this.organParam = Object.assign({}, this.organParam);
      },
      resetting() {
        this.params = {};
        this.organParam = {};
      },
      highGrade() {
        this.isHigh = !this.isHigh;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common.scss";
  //高级搜索
  .highRanking {
    div {
      margin-bottom: 0;
    }
    .noTabs {
      @include flex;
      justify-content: flex-end;
    }
    .haveTabs {
      /*position: absolute;*/
      /*top: 0;*/
      /*right: 0;*/
      /*z-index: 6;*/
    }
    .high_grade {
      position: absolute;
      top: 40px;
      right: 0;
      left: 0;
      padding: 0;
      background: #fff;
      @include box_shadow(#aaa, 20px);
      z-index: 12;
      $el_row_border: 1px solid #DDDDDD;
      .filterTitle {
        border-bottom: $el_row_border;
        padding: 8px 18px;
        font-weight: bold;
      }
      .el-row.el_row_border {
        .el_col_border {
          background-color: #f3f3f3;
          border-bottom: $el_row_border;
        }
        .noBottom {
          border-bottom: none;
        }
        .el-row {
          @include flex-items;
          .el_col_label {
            background: #fff;
            padding: 15px 30px;
          }
          .el_col_option {
            padding: 0 12px;
          }
        }
      }
      .btnOperate {
        padding: 12px;
        @include flex-justify;
      }
      .btnOperateTop {
        border-top: $el_row_border;
      }
    }
  }
</style>
