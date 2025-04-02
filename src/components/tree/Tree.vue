<template>
  <a-col :span="4" style="min-width:200px">
    <div style="background-color:#fff;border-radius:8px;border:1px solid #a09c9c">
      <div style="border-bottom:1px solid #a09c9c;width:100%;height:50px;">
        <a-icon
          style="margin-top:13px;margin-left:10px;font-size:26px;color:orange;float:left;margin-right:12px;"
          type="profile"
        />
        <div style="font-size:18px;font-weight:bold;line-height:50px;">组织机构</div>
      </div>
      <a-input-search style="width: 90%;margin-left:5%;margin-top:10px;" @change="onChange" />
      <a-row style="margin-top:4px;">
        <a-col :span="12" class="buttonHover">
          <div @click="clickOpenOrclose(0)" class="collspanButton">
            <a-icon type="plus-circle" style="color:green;margin-right:4px;" theme="filled" /><span>展开全部</span>
          </div>
        </a-col>
        <a-col :span="12" class="buttonHover">
          <div @click="clickOpenOrclose(1)" class="collspanButton">
            <a-icon type="minus-circle" style="color:red;margin-right:4px;" theme="filled" /><span>折叠全部</span>
          </div>
        </a-col>
      </a-row>
      <div style="margin-left:14px;padding:5px;height:80vh;overflow:scroll">
        <a-tree
          ref="treeX"
          :show-line="showLine"
          :show-icon="true"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :tree-data="treeData"
          @expand="onExpand"
          @select="onSelect"
        >
          <!-- <a-icon type="plus-square"  slot="switcherIcon"/> -->
          <a-icon slot="child" type="minus" />
          <template slot="title" slot-scope="{ title }">
            <span v-if="title.indexOf(searchValue) > -1">
              {{ title.substr(0, title.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
        </a-tree>
      </div>
    </div>
  </a-col>
</template>

<script>
import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'
import { getDictionary } from '@/api/dictionary.js'
export default {
  data() {
    return {
      showLine: true,
      showIcon: false,
      expandedKeys: [],
      treeData: [{ title: '', key: '007', children: [], scopedSlots: { title: 'title' } }],
      expandedKeysList: [],
      searchValue: '',
      autoExpandParent: true,
      dataList: []
    }
  },
  created() {
    this.initConfig()
    this.getTreeList()
    setTimeout(() => {
      this.clickOpenOrclose(0)
    }, 300)
  },
  methods: {
    initConfig() {
      getDictionary('system_name').then(res => {
        this.treeData[0].title = res.result[0].value
      })
    },
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const key = node.key
        this.dataList.push({ key, title: node.title })
        if (node.children) {
          this.generateList(node.children)
        }
      }
    },

    getParentKey(key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        let node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    getTreeList() {
      getAction('/sys/user/TreeNodeList').then(res => {
        if (res.success) {
          let arr = this.treeDataChange(res.result)
          this.generateList(res.result)
          this.treeData[0].children = res.result
        } else {
          this.$message.error(res.message)
        }
      })
    },
    treeDataChange(arr) {
      arr.forEach(element => {
        element.scopedSlots = { title: 'title' }
        if (element.children.length > 0) {
          this.treeDataChange(element.children)
        }
      })
    },
    onSelect(selectedKeys, info) {
      console.log('selected', selectedKeys, info)
      this.$emit('click', selectedKeys, info)
    },
    do(root) {
      for (let i = 0; i < root.length; i++) {
        var node = root[i]
        if (node.children) {
          this.expandedKeysList.push(node.key)
          this.do(node.children)
        }
      }
    },
    async clickOpenOrclose(num) {
      if (num == 0) {
        this.expandedKeysList = []
        await this.do(this.treeData)
        this.expandedKeys = this.expandedKeysList
      } else {
        this.expandedKeys = []
      }
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 改变节点的状态
    changeTreeNodeStatus(node) {
      node.expanded = this.expandAll
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的自身expanded状态
        node.childNodes[i].expanded = this.expandAll
        // 遍历子节点
        if (node.childNodes[i].childNodes.length > 0) {
          this.changeTreeNodeStatus(node.childNodes[i])
        }
      }
    },
    onChange(e) {
      let value = e.target.value
      let expandedKeys = this.dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.treeData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    }
  }
}
</script>
<style scoped>
.collspanButton {
  width: 100%;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 16px;
  font-weight: bold;
}
.collspanButton >>> * {
  cursor: pointer;
}

.buttonHover:hover {
  background-color: orange;
  cursor: pointer;
}
/* // 自定义配置padding距离 */
/* ::v-deep .ant-tree-node-content-wrapper-normal { */
/* padding-left:15px !important; */
/* } */
/* // 打开sholine="true"时让子项的line线隐藏 */
::v-deep .ant-tree.ant-tree-show-line .ant-tree-child-tree li:not(:last-child)::before {
  border-left: none !important;
}
/* // 调整改变line线位置并把实线改为虚线 */
::v-deep .ant-tree.ant-tree-show-line li:not(:last-child)::before {
  border-left: 1px dashed #d9d9d9;
  top: 10px;
  left: 11px;
}
</style>
