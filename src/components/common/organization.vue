<template>
  <div id="organization">
    <el-dialog :close-on-click-modal="false" title="组织架构" :visible.sync="organizationVisible" width="785px" center>
      <div class="organPadding">
        <!--搜索-->
        <div class="searchStaff">
          <div class="selectItem">
            <div class="onTags">
              <div class="outer" v-for="item in form">
                <el-tag type="info" closable size="medium" @close="handleClose(item)">
                  {{item.name}}
                </el-tag>
              </div>
            </div>
            <!--@keyup.native.8="backSpace"-->
            <div class="outer" style="flex-grow:1">
              <el-input v-model="params.keywords" @keyup.native.enter="searchStaff" placeholder="请输入企业联系人"
                        size="mini"></el-input>
            </div>
          </div>
          <div>
            <ul class="scroll_bar" :style="leftUl" v-if="staffList.length > 0">
              <li v-for="item in staffList" @click="chooseType(item, staffList)">
                <div class="search">
                  <div class="staffData">
                    <img v-if="item.avatar" :src="item.avatar">
                    <img src="../../assets/images/head.png" v-else>
                    <div>
                      <p>{{item.name}}</p>
                      <p>{{item.name}}</p>
                    </div>
                  </div>
                  <i v-if="checkData.indexOf(item.id) > -1" class="el-icon-check"></i>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!--筛选-->
        <div class="filterOrgan">
          <div class="filterTop" @click="filterOrgan(1)">
            南京乐伽商业管理有限公司
          </div>
          <div class="pitchOnData" v-show="pitchOnData.length > 0">
          <span v-for="(item,index) in pitchOnData" @click="removePitch(item.id, index)">
            <span v-if="pitchOnData.length > 1 && index !== 0">></span>
            {{item.name}}
          </span>
          </div>
          <ul class="scroll_bar checkDepart" :style="rightUl">
            <li v-for="item in list.children">
              <el-checkbox-group v-model="checkDepart" :disabled="organType === 'staff'"
                                 @change="chooseType(item, list.children)">
                <el-checkbox :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
              </el-checkbox-group>
              <div class="nextLevel" @click="nextLevel(item.id, item)">下级</div>
            </li>
            <li class="listUsers" v-for="item in list.users" @click="chooseType(item, list.users)"
                v-if="organType !== 'depart'">
              <div class="staffData">
                <div class="imgData">
                  <img v-if="item.avatar" :src="item.avatar">
                  <img src="../../assets/images/head.png" v-else>
                  <div v-if="checkData.indexOf(item.id) > -1">
                    <i class="el-icon-check"></i>
                  </div>
                </div>
                <div>
                  <p>{{item.name}}</p>
                  <p>{{item.name}}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" :disabled="form.length < 1" @click="confirmSelect">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "organization",
    props: ['module', 'data'],
    data() {
      return {
        organizationVisible: false,

        url: globalConfig.server,
        list: [],               //所有数据
        leftUl: {
          height: '',           //左侧 列表高度
        },
        rightUl: {
          height: '',           //右侧 列表高度
        },
        params: {
          limit: 20,
          page: 1,
          keywords: '',
        },
        staffList: [],          //员工列表
        parent_id: '',          //当前层级 id
        pitchOnData: [],        //面包屑
        checkDepart: [],        //复选框 部门
        checkData: [],          //选中员工
        form: [],
        lengths: '',
        organType: '',
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        this.organizationVisible = val;
      },
      organizationVisible(val) {
        if (!val) {
          this.$emit('close');
          this.close_();
          globalConfig.header = {'Accept': 'application/json'};
          this.$http.defaults.headers = globalConfig.header;
        } else {
          globalConfig.header = {'Accept': 'application/json'};
          this.$http.defaults.headers = globalConfig.header;
          this.filterOrgan(1);
          this.$nextTick(() => {
            this.leftHeight();
            this.rightHeight();
          })
        }
      },
      form() {
        this.$nextTick(() => {
          this.leftHeight();
        })
      },
      data(val) {
        this.lengths = val.length;
        this.organType = val.type;
      },
    },
    computed: {},
    methods: {
      // 搜索/员工
      searchStaff() {
        if (this.params.keywords === '') {
          this.staffList = [];
          return;
        }
        this.$http.get(this.url + 'organization/other/staff-list', {
          params: this.params
        }).then(res => {
          if (res.data.code === '70010') {
            this.staffList = res.data.data.data;
          } else {
            this.staffList = [];
          }
        })
      },
      // 部门/员工
      filterOrgan(id) {
        if (this.parent_id === id) return;
        this.list = [];
        this.pitchOnData = id === 1 ? [] : this.pitchOnData;
        this.$http.get(this.url + 'organization/other/org-tree?id=' + id).then(res => {
          this.parent_id = id;
          this.rightHeight();
          if (res.data.code === '70050') {
            this.list = res.data.data;
            this.evaluate(this.list.children, this.checkDepart);
          } else {
            this.prompt('warning', res.data.msg);
          }
        })
      },
      // 复选框 动态增加选项
      evaluate(list, check) {
        list.forEach((res) => {
          check.forEach((item) => {
            if (res.id === item) {
              this.checkDepart.push(res);
            }
          })
        })
      },
      // 删除标签页
      handleClose(item) {
        let status = this.isExist(item, this.form);
        this.form.splice(status, 1);
        this.checkData.splice(status, 1);
        this.departStaff(item, this.checkDepart);
      },
      //回退删除 标签
      backSpace() {
        if (this.params.keywords === '' && this.checkData.length > 0) {
          this.form.pop();
          this.checkData.pop();
          this.checkDepart.pop();
        }
      },
      // 部门/员工同时存在 删除复选框
      departStaff(item, data) {
        data.forEach((res, index) => {
          if (item.id === res) {
            this.checkDepart.splice(index, 1);
          }
        })
      },
      // 判断是否存在
      isExist(item, data) {
        for (let i = 0; i < data.length; i++) {
          if (item.id === data[i].id) {
            return i;
          }
        }
        return -1;
      },
      // 部门 / 员工
      chooseType(item, data) {
        let status = this.isExist(item, this.form);
        if (status > -1) {
          this.form.splice(status, 1);
          this.checkData.splice(status, 1);
        } else {
          this.chooseData(item, data);
        }
      },
      // 选中
      chooseData(item, data) {
        if (this.form.length > this.lengths - 1) {
          this.prompt('warning', '超出数量限制!');
          this.checkDepart.pop();
          return;
        }
        data.forEach(res => {
          if (item.id === res.id) {
            this.checkData.push(res.id);
            this.form.push(res);
          }
        });
      },
      // 下级 面包屑
      nextLevel(id, item) {
        let data = {};
        data.id = item.id;
        data.name = item.name;
        this.pitchOnData.push(data);
        this.filterOrgan(id);
      },
      // 删除 面包屑
      removePitch(id, index) {
        this.filterOrgan(id);
        this.pitchOnData.splice(index + 1);
      },
      // 确定
      confirmSelect() {
        this.$emit('succeed', this.form, this.data);
      },
      close_() {
        this.params.search = '';
        this.staffList = [];          //员工列表
        this.pitchOnData = [];        //面包屑
        this.checkDepart = [];        //复选框 部门
        this.checkData = [];          //选中员工 / 部门
        this.form = [];               //返回数据
        this.parent_id = '';          //父级ID
      },
      // ul高度
      leftHeight() {
        let height = $('.selectItem').height();
        this.leftUl.height = (420 - height - 12) + 'px';
      },
      // ul高度
      rightHeight() {
        let height = $('.pitchOnData').height();
        if (height !== 0) {
          this.rightUl.height = (420 - height - 68) + 'px';
        } else {
          this.rightUl.height = (420 - 48) + 'px';
        }
      },
    },
  }
</script>

<style lang="scss">
  @import "../../assets/css/common.scss";

  #organization {
    .el-dialog__body {
      background-color: #f8f8f8;
      padding: 20px;
    }
    .organPadding {
      height: 420px;
      overflow: hidden;
      @include flex-items;
      .searchStaff, .filterOrgan {
        background-color: #fff;
        overflow: hidden;
        height: 100%;
        border: 1px solid #e0e0e0;
        @include border_radius(6px);
        img {
          width: 35px;
          height: 35px;
          margin-right: 12px;
          @include border_radius(50%);
        }
        &:hover {
          border-color: $themeColor;
        }
      }
      /*左*/
      .searchStaff {
        width: 440px;
        margin-right: 10px;
        .selectItem, .onTags {
          @include flex-items;
          flex-wrap: wrap;
        }
        .selectItem {
          padding-bottom: 8px;
        }
        input {
          border: none;
          padding-left: 6px;
        }
        .outer {
          margin: 10px 0 0 10px;
          div {
            width: 100%;
          }
        }
        ul {
          border-top: 1px solid #eee;
          margin: 0 10px;
          overflow: hidden;
          overflow-y: auto;
        }
      }
      /*右*/
      .filterOrgan {
        width: 300px;
        .filterTop {
          text-align: center;
          padding: 16px 0;
          cursor: pointer;
          @include box_shadow(#eee, 10px);
          &:hover {
            color: $themeColor;
          }
        }
        .pitchOnData {
          background-color: #f5f5f5;
          padding: 10px;
          color: $themeColor;
          > span {
            line-height: 22px;
            cursor: pointer;
            &:hover {
              color: #1D7FFB;
            }
          }
        }
        .checkDepart {
          overflow-x: hidden;
          overflow-y: auto;
          .listUsers {
            cursor: pointer;
          }
          li {
            padding: 0 18px;
            height: 50px;
            @include flex-items;
            justify-content: space-between;
            &:hover {
              background-color: rgb(223, 237, 250);
            }
            .el-checkbox {
              @include flex-items;
              .el-checkbox__label {
                max-width: 160px;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
            .nextLevel {
              cursor: pointer;
              padding: 0 10px;
              min-width: 50px;
              border-left: 1px solid #e0e0e0;
              color: #bbb;
              &:hover {
                color: $themeColor;
                border-left: 1px solid $themeColor;
              }
            }
          }
        }
      }
      .staffData {
        @include flex-items;
        .imgData {
          position: relative;
          div {
            position: absolute;
            top: 0;
            color: #fff;
            font-size: 22px;
            width: 35px;
            height: 35px;
            background-color: rgba(0, 0, 0, 0.1);
            @include border_radius(50%);
            @include items-justify;
          }
        }
        div {
          color: #606266;
          p:last-of-type {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
          }
        }
      }
      .search {
        @include flex-items;
        justify-content: space-between;
        height: 50px;
        cursor: pointer;
        padding: 0 12px;
        &:hover {
          background-color: rgb(223, 237, 250);
        }
      }
    }
    .el-dialog__footer {
      .dialog-footer {
        .el-button {
          padding: 10px 20px;
          width: 150px;
        }
      }
    }
  }
</style>
