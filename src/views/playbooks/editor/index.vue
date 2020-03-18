<template>
   <div class="playbook-editor">
    <div id="editor_main"></div>
  </div>
</template>

<script>
import Playbook from '../../../components/Playbook/index.js'

export default {
  name: 'playbook',
  coa: null,

  data () {
    return {
      title: '',
      pid: '',
      mode: '',
      save: false
    }
  },

  mounted () {
    if (this.$route.params.fn === 'handleView') {
      this.handleView(this.$route.params.pid, this.$route.params.name)
    } else if (this.$route.params.fn === 'handleEdit') {
      this.handleEdit(this.$route.params.pid, this.$route.params.name)
    } else {
      this.handleCreate()
    }
  },
  beforeDestroy () {
    console.log('beforeDestroy')
  },
  methods: {
    show () {
      this.$nextTick(() => {
        this.initPlaybook()
      })
    },
    initPlaybook () {
      this.coa = new Playbook({
        id: 'editor_main',
        mode: this.mode,
        pid: this.pid,
        onClose: (mode) => {
          mode ? this.save = true : this.save = false
          this.$router.push('/playbooks/index')
        },
      })
    },
    handleCreate () {
      this.title = '新建playbook'
      this.mode = 'edit'
      this.pid = ''
      this.show()
    },
    handleEdit (pid, title) {
      this.title = title
      this.mode = 'edit'
      this.pid = pid
      this.show()
    },
    handleView (pid, title) {
      this.title = title
      this.mode = 'view'
      this.pid = pid
      this.show()
    },
  },
  beforeRouteLeave (to, from, next) {
    if (this.$route.params.mode === 'view') {
      next()
    } else if (this.save) {
      this.$message({
        type: 'success',
        message: '保存成功!'
      })
      next()
    } else {
      this.$confirm('您还没保存，是否确认离开？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        if (this.coa) {
          this.coa.destory()
          this.coa = null
        }
        next()
      }).catch(() => {
        next(false)
      })
    }
  }
}
</script>

<style lang="scss">
.playbook-editor {
  position: relative;
  height: calc(100vh - 143px);
}
</style>
