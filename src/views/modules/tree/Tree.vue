<template>
  <tree @click="clickTree" />
</template>
<script>
import Tree from '@/components/tree/Tree'
export default {
  components: {
    Tree
  },
  data() {
    return {}
  },
  methods: {
    clickTree(item) {
      console.log(item)
    }
  }
}
</script>
<style scoped>
.ant-layout-content {
  background-color: #ffffff;
}
</style>
