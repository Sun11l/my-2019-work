<template>
  <div class="playbook-wapper">
    <p class="head">{{nodename}}</p>
    <div class="container">
      <div class="box-msg">
        <p class="msg-state">运行状态：{{state}}</p>
        <p class="msg-state">运行结果：</p>
        <div class="msg-result">{{output}}</div>
      </div>
      <div class="box-IO">
        <el-tabs>
          <el-tab-pane label="输入" name="first">{{input}}</el-tab-pane>
          <el-tab-pane label="输出" name="second">{{output}}</el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      input: null,
      output: null,
      state: null,
      artifact: null,
      id: null,
      name: null,
    }
  },
  computed: {
    nodename () {
      var nodenames = this.$store.getters.playbooknodename
      var name = this.name
      var artifact = this.artifact
      var id = this.id
      // console.log(name)
      // console.log(artifact)
      // console.log(id)
      // name = 'connectivity_1'
      // name:'connectivity',artifact:'b_mk120BjBsvBBwYvQbD', id:'43498'
      if (!!name && !!artifact && !!id) {
        // eslint-disable-next-line vue/no-async-in-computed-properties
        this.$store.dispatch('events/getPlaybooknodeIO', { name, artifact, id })
          .then(res => {
            if (res.data[nodenames]) {
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              this.input = res.data[nodenames].input
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              this.output = res.data[nodenames].output
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              this.state = res.data[nodenames].output.failed ? '失败' : '成功'
            } else {
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              this.input = null
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              this.output = null
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              this.state = null
            }
          })
      }
      return name
    }
  }
}
</script>

<style lang='scss' scoped>
.playbook-wapper {
  text-align: left;
  .head {
    padding: 8px 20px;
    background: rgba(242, 242, 242, 1);
    font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑";
    font-weight: 700;
    font-style: normal;
    color: #666666;
  }
  .container {
    margin: 15px;
    font-size: 14px;
    height: 100%;
    p {
      font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑";
      padding: 10px 0;
    }
    .msg-result {
      background: #000;
      width: 100%;
      height: 250px;
      color: #fff;
    }
    .box-IO {
      .el-tab-pane {
        padding: 10px 0;
      }
    }
  }
}
</style>
