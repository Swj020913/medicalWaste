## 基本创建
<org-tree :data="data"/>


### data数据

data: {
  id: 0,
  label: "XXX科技有限公司",
  children: [
    {
      id: 2,
      label: "产品研发部",
      children: [
        {
          id: 5,
          label: "研发-前端"
        },
        {
          id: 6,
          label: "研发-后端"
        },
        {
          id: 9,
          label: "UI设计"
        },
        {
          id: 10,
          label: "产品经理"
        }
      ]
    },
    {
      id: 3,
      label: "销售部",
      children: [
        {
          id: 7,
          label: "销售一部"
        },
        {
          id: 8,
          label: "销售二部"
        }
      ]
    },
    {
      id: 4,
      label: "财务部"
    },
    {
      id: 9,
      label: "HR人事"
    }
  ]
}

### api 

- 排列方式 horizontal
- 修改背景色 label-class-name
- 折叠展示 collapsable
- labelWidth
- selectedKey
- props
- judge
- NodeClass
- selectedClassName
- renderContent


### 事件

- 展开 on-expand
- 移入 on-node-mouseover
- 移出 on-node-mouseout



#### 自定义方块颜色

judge 是一个Object格式 里面存在着一个值 {swtich:true || false} 不传或者传入false 都默认为不需要自定义class

新增NodeClass 参数 NodeClass 是一个Array格式 类似于Echarts的 color 参数，

如果有放入你需要的class 如果没有则采取默认格式

  NodeClass:[
      "myred",
      "myger",
      "myblue"
  ]


在data数据中需要的项中添加 你就需要这样做

  {
      id: 5,
      label: "研发-前端",
      swtich: "myred"
  },
  {
      id: 6,
      label: "研发-后端",
      swtich: "myger"
  },


html

<org-tree 
	:data="data" 
  :horizontal="true"  
	name="test"    
  :label-class-name="labelClassName"
	collapsable
	@on-expand="onExpand"
	@on-node-mouseover="onMouseover"
  @on-node-mouseout="onMouseout"
  :judge="judge"
  :NodeClass="NodeClass"
/>


[vue-tree-color](https://github.com/CrazyMrYan/vue-tree-color)

