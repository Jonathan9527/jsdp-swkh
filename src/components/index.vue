<template>
  <div id="routerIndex">
    <div class="header">
      <div class="headLeft">
        <div class="logo">
          <img src="../assets/images/topbg.jpg" alt="">
        </div>
        <div class="title">
          <img src="../assets/images/danghui.png" alt="" width="50px;float: left;">
          <span style="line-height: 52px;float: right;margin-left:30px ;">{{title}} {{fubiaoti}}</span>
        </div>
      </div>
      <div class="headright">
        <!-- <a :href="uri" class="xiazai"><i class="icon iconfont icon-xiazai"></i>下载用户手册</a> -->
        <div class="users"><i class="iconfont icon-gerenzhongxin usergeren"></i>{{personal.roleData.department.name}}</div>
        
        <el-popover placement="bottom" trigger="click" >
          <el-button slot="reference" class="xiugaimima"><i class="el-icon-setting"></i></el-button>
          <p @click="xiugaimima2" class="shezhi" style="line-height: 30px;cursor: pointer;"><i class="icon iconfont icon-denglumima" style="color: #1800ff;font-weight: 700"></i> 修改密码</p>
          <p class="shezhi" style="line-height: 30px;"><a :href="uri" ><i class="icon iconfont icon-xiazai" style="color: #1800ff;font-weight: 700"></i> 下载用户手册</a></p>
        </el-popover>
        <!-- <p class="sx"><img src="../assets/images/形状 13.png" alt=""></p> -->
        <div class="exit" @click="exit"><i class="iconfont icon-tuichu"></i></div>

      </div>
    </div>
    <div class="main">
      <el-container accordion="true">
        <div class="aside" id="isCollapse">
          <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :unique-opened="false" router text-color="#fff">
            <template v-for="item in routes">
              <!--有二级菜单标题-->
              <el-submenu :index="String(item.id)"  class="nav-item">
                <!--二级菜单标题-->
                <template slot="title">
                  <b :class="item.icon"></b>
                  <span>{{item.label}}</span>
                </template>
                <template v-for="child in item.children" v-if="child.children.length == 0">
                  <!--二级菜单-->
                  <el-menu-item class="el-menu-item1"  @click="refreshCurrentRouter(child)"  :index="child.path" :key="child.path"
                    style="padding-left: 60px!important;">
                    <b :class="child.icon"></b>
                    <span>{{child.label}}</span>
                  </el-menu-item>
                </template>
                <template v-else>
                  <!--有三级菜单-->
                  <el-submenu class="el-menu-item2" :index="String(child.id)"  >
                    <!--三级菜单标题-->
                    <template slot="title">
                      <b :class="child.icon"></b>
                      <span>{{child.label}}</span>
                    </template>
                    
                    <template v-for="last in child.children" v-if="last.children.length == 0">
                      <el-menu-item class="el-menu-item3"  @click="refreshCurrentRouter(last)" :index="last.path" :key="last.path"  style="padding-left:70px">
                        {{last.label}}
                      </el-menu-item>

                      <!-- 有四级菜单 -->
                    <!-- <el-submenu class="el-menu-item2" :index="String(last.id)" v-if="last.children">
                        <template slot="title">
                            <b :class="last.icon"></b>
                            <span>{{last.label}}</span>
                          </template>
                          <el-menu-item class="el-menu-item3" :index="end.path" v-for="end in last.children" :key="end.path"  style="padding-left:80px">
                              {{end.label}}
                          </el-menu-item>
                    </el-submenu> -->

                    </template>

                  </el-submenu>
                </template>
              </el-submenu>
            </template>
          </el-menu>
        </div>
        <el-main class="scroll_bar">
          <div style="width: 100%">
            <TagsView></TagsView>
          </div>
          <div id="routerView" v-if="isRouterAlive">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </div>
    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="dialogVisibleMa" width="500px">
      <el-form ref="form" :model="form" label-width="80px">
        <!-- <el-form-item label="原密码：">
            <el-input v-model="form.password"></el-input>
          </el-form-item> -->
        <el-form-item label="新密码：">
          <el-input v-model="form.password1" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：">
          <el-input v-model="form.password2" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleMa = false">取 消</el-button>
        <el-button type="primary" @click="updataPass()">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  import TagsView from './common/tagsView.vue';
  import Cryptojs from '@/assets/js/cryptojs.js'

  export default {
    dialogVisibleMa: false,
    name: "index",
    components: {
      TagsView
    },
    data() {
      return {
        uri: "",
        personal: {
          user: {
            name: ""
          }
        },
        dialogVisibleMa: false,
        roleData: {},
        routes: [],
        form: {},
        isCollapse: true,
        activeIndex: '1',
        title: "综合考核信息管理系统",
        opens: ['examinationUnitMaterial'],
        fubiaoti: "",
        isRouterAlive:true
      }
    },
    created() {
      //初始化个人信息
      this.personal = JSON.parse(sessionStorage.personal)
      console.log(this.personal)

      // this.routes = routes
      this.onMenu()
    },
    mounted() {
      this.uri = globalConfig.server1 + "shouce/江苏省委组织部综合考核信息管理系统用户操作手册.docx"

      if (this.personal.roleData.role.role_flag == "综合考核" || this.personal.roleData.role.role_flag == "被考核单位") {
        this.fubiaoti = ""
      } else {
        this.fubiaoti = "(" + this.personal.roleData.role.role_flag + ")"
      }
      
    },
    activated() {},
    watch: {},
    computed: {
      super_admin() {
        return this.$store.state.app.super_admin;
      }
    },
    methods: {
     
      //修改密码
      xiugaimima2() {
        this.dialogVisibleMa = true
      },
      updataPass() {
        let id = JSON.parse(sessionStorage.personal).id

        if (this.form.password1 !== this.form.password2) {
          this.$message({
            type: 'error',
            message: '密码不一致'
          });
          return
        }
        let pwd = Cryptojs.Encrypt(this.form.password1)

        let params = {
          id: id,
          passWord: pwd
        }
        this.$http.post(globalConfig.server2 + 'user/updatePasswordByUserId', params).then(res => {
          if (res.data.response_code === '0') {
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.exit()
          } else {

          }

        })
      },
      //退出事件
      exit() {
        this.$router.push({
          path: "/login"
        })
      },
      // 左侧栏 展开/收起
      changeCollapse() {
        this.isCollapse = !this.isCollapse;
      },
      onMenu() {
        let roleaside = JSON.parse(sessionStorage.roleaside)
        this.routes = roleaside

        console.log(roleaside)
        this.$router.push({
          path: "/shouye"
        })

      },
      //遍历树找到第一个页面
      updataTreeIDFalse(data) {
        for (var i in data) {
          if (data[i].hidden == false) {

            return data[i]
            // break
          } else {
            this.updataTreeIDFalse(data[i].children);
          }
        }
      },
      getdepart(id) {
        let params = {
          user_id: id
        }
        this.$http.post(globalConfig.server1 + 'PersonalityAuditOfResponsibleUnits/selectDepartmentIdByUserId', params)
          .then(res => {

            if (res.data.response_code == '200') {
              let roleData = res.data.response_body
              this.personal.roleData = roleData
              // sessionStorage.setItem('roleData', JSON.stringify(roleData));
              sessionStorage.setItem('personal', JSON.stringify(this.personal));
              this.$router.push({
                path: "/"
              })
            } else {

            }
          })
      },
      refreshCurrentRouter(obj) {
        if (this.$route.path === obj.path) {
          this.isRouterAlive = false
          this.$nextTick(() => (this.isRouterAlive = true))
        }
      }
    }
  }

</script>

<style lang="scss">
  @import "../assets/css/common.scss";

  #routerIndex {
    

    .xiugaimima {
      color: #fff;
      background:transparent;
      border:0;
      font-size:18px;
    }

    /*左侧栏样式*/

    .nav-item {
      >.el-submenu__title {
        border-bottom: 1px solid #ccc;
        height: 60px;
        line-height: 60px;
        background-color: linear-gradient(120deg, rgba(59, 120, 211, 1) 1%, rgba(68, 131, 227, 1) 100%);

        >span {
          font-size: 18px !important;
          font-weight: normal;
          color: #fff;
          padding-left: 10px;
        }

      }

      &.is-opened {
        >.el-submenu__title {
          background-color: #00388D !important;
        }

        >span {
          color: #FFFFFF !important;
        }

      }

      &.is-opened {
        >.el-submenu__title>span {
          color: #FFFFFF !important;
        }
      }
    }

    .el-menu.el-menu--inline {
      .el-menu-item.el-menu-item1 {
        font-weight: normal !important;
        color: #666 !important;
        background-color: rgba(189, 189, 189, 0.20) !important;
        border-bottom: 1px solid #e6e6e6;


        span {
          font-size: 17px !important;
        }

        &.is-active {
          color: #fff !important;
          background-color: #94B8EE !important;
        }
      }
    }

    .el-icon-arrow-down {
      color: #fff !important;
    }

    .el-menu-item2.el-submenu {
      .el-submenu__icon-arrow {
        color: #FFF !important;
        font-size: 16px !important;
      }

      .el-submenu__icon-arrow {
        color: #666 !important;
      }

      >.el-submenu__title {
        color: #666 !important;
        background-color: #EEEEEE !important;
        height: 54px;
        line-height: 54px;
        border-bottom: 1px solid #e6e6e6;
        padding-left: 30px !important;

        span {
          font-size: 17px !important;
          font-weight: 100 !important;
        }
      }

      .el-menu.el-menu--inline {
        .el-menu-item3 {
          font-size: 16px;
          font-weight: normal;
          color: #777777 !important;
          background-color: #DBDBDB !important;
          height: 65px;
          line-height: 65px;
          border-bottom: 1px solid #eaeaea;

          &.is-active {
            color: #1960CB !important;
          }
        }
      }
    }

    .el-menu-item3 {
      border-bottom: 1px solid #DBDBDB;
      color: #777777 !important;
    }

    .header {
      background-color: #fff;
      @include flex;
      height: 88px;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 12;
      @include box_shadow(rgba(189, 189, 189, 0.20), 20px);

      .headLeft {
        border-width: 0px;
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 0px;
        -moz-box-shadow: none;
        -webkit-box-shadow: none;
        box-shadow: none;
        font-family: '微软雅黑';
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        line-height: 66px;

        .logo {
          float: left;
          height: 88px;
          width: 100%;

          img {
            height: 88px;
            width: 100%;
          }
        }

        .title {
          color: #fff;
          font-size: 34px;
          position: absolute;
          left: 75px;
          top: 18px;
          letter-spacing: 5px;
        }
      }

      .headright {
        position: absolute;
        right: 0;
        width: 18%;
        height: 100%;
        overflow: hidden;
        line-height: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 3%;

        .setting {
          float: left;
          font-size: 20px;
          cursor: pointer;
          padding-right: 5%;
          color: #fff;
          border-right: 1px solid #366fb1;
        }

        .exit {
          float: left;
          cursor: pointer;
          padding-left: 5%;

          .iconfont {
            font-size: 20px;
            color: #fff;
          }
        }

        .users {
          width: 75%;
          display: flex;
          justify-content: flex-start;
          float: right;
          align-items: center;
          color: #FFFFFF;

          .iconfont {
            font-size: 20px;
            margin-right: 12px;
          }
        }
      }

    }

    .main {
      margin-top: 22px;

      #routerView {
        background: #fff;
        min-width: 1200px;
        min-height: 600px;
        margin: 15px 0 0 15px;
        padding: 25px;
      }

      .el-container {
        .aside {
          position: fixed;
          left: 0;
          top: 88px;
          height: 100%;
          z-index: 66;
          overflow: auto;

          b,
          i {
            color: #fff;
          }

          b {
            font-size: 26px;
          }

          span,
          i:last-of-type {
            font-size: 14px;
          }

          .el-menu--collapse {
            width: 65px;
            height: 100%;
          }

          .el-menu-vertical-demo:not(.el-menu--collapse) {
            width: 245px;
            min-height: 100%;
            padding-bottom: 130px;
            /* max-height: 35px; */
          }

          .el-menu-item1 {
            padding-left: 54px;
          }

          .el-menu-item2 {
            padding-left: 0px
          }

          .el-menu-item2 .el-submenu__icon-arrow {
            left: 20px;
            right: 208px;
          }

          .el-menu-item3 {
            padding-left: 74px
          }
        }

        .el-main {
          margin-top: 66px;
          /* min-height: 500px; */
          // padding: 10px 20px;
          margin-left: 245px;
          @include transition;
        }

        .hideSidebar {
          margin-left: 65px;
        }
      }

      .el-submenu__title>b {
        color: #fff !important;
        font-size: 18px !important;
        font-weight: 300;
      }
    }

    .top {
      margin: 0;
    }

    .tag_span {
      color: #333333;
    }

    .el-table--enable-row-transition {
      border: none;
    }

    .el-submenu__title {
      display: flex;
      align-items: center;
    }

    .el-submenu__title>b {
      // display: block;
      width: 21px;
      // height: 21px;
      color: #000 !important;
    }

  }

  .nav-item {
    background: linear-gradient(0deg, rgba(0, 71, 177, 1) 0%, rgba(21, 87, 187, 1) 100%) !important;
  }

  // 	 .nav-item:hover {
  // 	 background:linear-gradient(0deg,rgba(0,71,177,1) 0%,rgba(21,87,187,1) 100%) !important;
  // 	 }

</style>
