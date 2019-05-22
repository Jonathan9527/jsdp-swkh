<template>
  <div class="hello">
    <div class="denglu">
      <div class="danghui">
        <img src="../assets/images/danghui.png" alt="" width="75px">
        <p>综合考核信息管理系统</p>

      </div>
      <div class="login_wrap">
        <img src="../assets/images/dlt.png" alt="" style="margin: 12% 2% 12% 8%;width: 36%;">
        <div class="login_box">
          <h3 class="ueselogin">用户登录</h3>
          <p style="font-size: 14px;color:#959595;line-height: 14px;margin: 0;">User login</p>
          <el-form :model="ruleForm2" status-icon ref="ruleForm2" class="demo-ruleForm login_input">
            <el-form-item label="" prop="name">
              <el-input v-model.number="ruleForm2.name" placeholder="用户名"></el-input>
              <i class="iconfont icon-geren usergeren"></i>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input type="password" v-model="ruleForm2.password" autocomplete="off" placeholder="输入密码"
                @keyup.enter.native="login"></el-input>
              <i class="iconfont icon-denglumima usergeren"></i>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login" class="longinBtn">登 录</el-button>
              <!-- <el-button @click="resetForm('ruleForm2')">重置</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cryptojs from '@/assets/js/cryptojs.js'

  export default {

    data() {
      //账号密码验证
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('账号不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            callback();
          }
        }, 10);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (value.length < 6) {
            callback(new Error('密码不能小于6位数字'));
          } else {
            callback();
          }
        }
      };
      return {
        //账号密码初始化
        ruleForm2: {
          name: '',
          password: ''
        },
        rules: {
          name: [{
            validator: checkAge,
            trigger: 'blur'
          }],
          password: [{
            validator: validatePass,
            trigger: 'blur'
          }]
        },
        personal: {},

      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$router.push({
              path: "/"
            })
          } else {

            return false;
          }
        });
      },
      //获取权限
      getrole(id) {
        let params = {
          user_id: id
        }
        this.$http.post(globalConfig.server1 + 'user/getRoleByUser_id', params).then(res => {

          if (res.data.response_code == '200') {
            let roleData = res.data.response_body
            this.personal.roleData = roleData
            // sessionStorage.setItem('roleData', JSON.stringify(roleData));
            sessionStorage.setItem('personal', JSON.stringify(this.personal));


            this.getcebian(roleData.role.id)
          } else {
            this.$message({
              message: res.data.response_desc,
              type: 'error'
            });
          }
        })
      },
      // 登录
      login() {
        let pwd = Cryptojs.Encrypt(this.ruleForm2.password)

        this.$http({
          url: globalConfig.server3 + 'login',
          method: 'post',
          data: {
            username: this.ruleForm2.name,
            password: pwd
          },
          transformRequest: [function (data) {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(res => {
          if (res.data.response_code === "200") {
            let loginData = res.data.response_body
            this.personal = loginData

            this.getrole(loginData.id)

          }
        }).catch(error => {

        })

      },
      getcebian(val) {
        let params = {
          roleId: val
        }
        this.$http.post(globalConfig.server2 + 'button/select-button-tree-roleId', params).then(res => {
          if (res.data.code == '200') {
            console.log(res.data.data)
            let roleaside = res.data.data.children
            sessionStorage.setItem('roleaside', JSON.stringify(roleaside));
            this.$message({
              message: '登录成功',
              type: 'success'
            });
            this.$router.push({
              path: "/"
            })
          } else {
            this.$message({
              message: '登录失败',
              type: 'error'
            });
          }

        })
      },
    },

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .denglu {
    position: absolute;
    top: 5%;
    width: 100%;
    height: 95%;

    img {
      vertical-align: middle;
      float: left;
    }

    p {
      line-height: 70px;
      display: inline-block;
      font-size: 40px;
      color: #fff;
      margin-left: 30px;
    }
  }

  .danghui {
    margin: 3% auto;
    width: 45%;
  }

  .hello {
    width: 100%;
    height: 100%;
    background: url("../assets/images/dlbg.png") no-repeat;
    background-size: cover;
    min-width: 1000px;
  }

  .login_wrap {
    width: 45%;
    height: 425px;
    margin: 0 auto;
    background: #fff;
    border-radius: 5px;
  }

  el-form-item {
    margin-bottom: 28px;
  }

  .login_input {
    margin-top: 40px;
  }

  .login_box {
    width: 35%;
    margin: 5% 6%;
    text-align: left;
    float: right;
  }

  .ueselogin {
    font-size: 25px;
    color: #0058B9;
    text-align: left;
    padding: 30px 0 15px 0;
  }

  .longinBtn {
    width: 100%;
    margin-top: 28px;
    font-size: 20px;
  }

  .usergeren {
    position: absolute;
    top: 1px;
    left: 25px;
    font-size: 19px;
  }

</style>
<style lang="scss">
  .login_box {
    .el-input__inner {
      padding-left: 60px;
      font-size: 16px;
    }
  }

</style>
