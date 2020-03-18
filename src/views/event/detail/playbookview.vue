<template>
  <div class="playbook-div">
    <div id="editor_main"></div>
  </div>
</template>

<script>
import Playbook from '../../../components/Playbook/previewEdit.js'

export default {
  coa: null,
  props: ['pids'],
  data () {
    return {
      mode: 'view',
      pid: '',
      nodename: '',
      isDisplay: false
    }
  },
  mounted () {
    this.show()
  },
  methods: {
    show (selectedId) {
      this.pid = selectedId
      console.log('pid')
      console.log(this.pid)
      this.$nextTick(() => {
        this.initPlaybook()
      })
    },
    initPlaybook () {
      this.coa = new Playbook({
        id: 'editor_main',
        mode: this.mode,
        pid: this.pid,
        ispreview: true,
        vueObj: this
      })
    }
  },
  watch: {
    nodename (val) {
      this.$store.dispatch('playbooknode/setNodeName', val)
    },
    isDisplay (val) {
      this.$emit('coaValue', val)
    }
  }
}
</script>

<style lang="scss">
.playbook-div {
  width: 100%;
  height: 100%;
}
</style>
