<template>
  <div id="app">
    <div style="width: 100%;height: 50px;"></div>

    <el-row :gutter="5">
      <el-col :span="10" :offset="14">
        <el-col :span="1">（</el-col>
        <el-col :span="4">
          <el-input v-model="Year"></el-input>
        </el-col>
        <el-col :span="1">）</el-col>
        <el-col :span="2">年&nbsp; </el-col>
        <el-col :span="4">
          <el-input v-model="Year"></el-input>
        </el-col>
        <el-col :span="2">字&nbsp;第</el-col>
        <el-col :span="4">
          <el-input v-model="Year"></el-input>
        </el-col>
        <el-col :span="1">号</el-col>
      </el-col>
    </el-row>

    <h1>航空加油单</h1>

    <el-row>
      <el-col :span="4" :offset="2">
        油料名称：
        <el-select v-model="select_oil_name" placeholder="请选择" style="width: 100px;">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-col :span="3">
        密度：
        <el-input v-model="Year" style="width: 80px;"></el-input>
      </el-col>
      <el-col :span="2" :offset="20">
        计算单位：升
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="20" :offset="2">
        <el-container>


          <el-header style="height: 370px;">
            <el-table :data="tabledata" border height="300"  highlight-current-row :summary-method="getSummaries"
              show-summary>
              <el-table-column label="日期" align="center" header-align="center" width="150px">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet&&scope.row.newOne">
                    <el-date-picker v-model="scope.row.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions0" format="yyyy-MM-dd">
                    </el-date-picker>
                  </span>
                  <span v-else>{{scope.row.date}}</span>
                </template>
              </el-table-column>


              <el-table-column label="用油单位" prop="unit" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.unit" placeholder="请选择" v-show="scope.row.isSet&&scope.row.newOne">
                    <el-option v-for="item in units" :key="item.value" :label="item.label" :value="item.label"></el-option>
                  </el-select>
                  <span v-show="!scope.row.isSet">{{scope.row.unit}}</span>
                </template>
              </el-table-column>


              <el-table-column label="机型" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.type" placeholder="请选择" v-show="scope.row.isSet&&scope.row.newOne">
                    <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.label"></el-option>
                  </el-select>
                  <span v-show="!scope.row.isSet">{{scope.row.type}}</span>
                </template>
              </el-table-column>


              <el-table-column label="机号" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.machine" placeholder="请选择" v-show="scope.row.isSet&&scope.row.newOne">
                    <el-option v-for="item in machines" :key="item.value" :label="item.label" :value="item.label"></el-option>
                  </el-select>
                  <span v-show="!scope.row.isSet">{{scope.row.machine}}</span>
                </template>
              </el-table-column>


              <el-table-column label="流量表" align="center" header-align="center">
                <el-table-column label="流量表初始值" align="center" header-align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.initialvalue" placeholder="请输入" v-show="scope.row.isSet&&scope.row.newOne"
                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                    <span v-show="!scope.row.isSet">{{scope.row.initialvalue}}</span>
                  </template>
                </el-table-column>


                <el-table-column label="流量表终读书" align="center" header-align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.finalvalue" placeholder="请输入" v-show="scope.row.isSet&&scope.row.newOne"
                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                    <span v-show="!scope.row.isSet">{{scope.row.finalvalue}}</span>
                  </template>
                </el-table-column>


              </el-table-column>
              <el-table-column label="加油数量" align="center" header-align="center">
                <el-table-column prop="train" label="训练" align="center" header-align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.train" placeholder="请输入" v-show="scope.row.isSet&&scope.row.newOne"></el-input>
                    <span v-show="!scope.row.isSet">{{scope.row.train}}</span>
                  </template>
                </el-table-column>


                <el-table-column prop="ground" label="地面维护" align="center" header-align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.ground" placeholder="请输入" v-show="scope.row.isSet&&scope.row.newOne"></el-input>
                    <span v-show="!scope.row.isSet">{{scope.row.ground}}</span>
                  </template>
                </el-table-column>


                <el-table-column prop="ssnbs" label="扫雪吹啥" align="center" header-align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.ssnbs" placeholder="请输入" v-show="scope.row.isSet&&scope.row.newOne"></el-input>
                    <span v-show="!scope.row.isSet">{{scope.row.ssnbs}}</span>
                  </template>
                </el-table-column>
              </el-table-column>


              <el-table-column label="机务签字" align="center" header-align="center"></el-table-column>


              <el-table-column label="操作" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click.native.prevent="changeRow(scope.$index)" size="small"><span v-if="scope.row.newOne">{{scope.row.isSet?'保存':"修改"}}</span></el-button>
                  <el-button type="text" @click.native.prevent="deleteRow(scope.$index)" size="small">移除</el-button>
                </template>
              </el-table-column>
            </el-table>

          </el-header>


          <el-footer>
            <el-row style="float: left;">
              备注：
            </el-row>
            <el-row>
              <el-col>
                <el-input type="textarea" placeholder="请输入内容" v-model="textarea" :rows="4"></el-input>
              </el-col>
            </el-row>
            <el-row style="padding-top: 10px;">
              <el-col :span="4" :offset="1">
                <el-col :span="8">
                  场站：
                </el-col>
                <el-col :span="16">
                  <el-input v-model="Year"></el-input>
                </el-col>

              </el-col>
              <el-col :span="5" :offset="4">
                <el-col :span="14">
                  油车（井）号码:
                </el-col>
                <el-col :span="10">
                  <el-input v-model="Year" style="display: inline;"></el-input>
                </el-col>

              </el-col>
              <el-col :span="5" :offset="4">
                <el-col :span="14">
                  司机（加油员）:
                </el-col>
                <el-col :span="10">
                  <el-input v-model="Year"></el-input>
                </el-col>

              </el-col>
            </el-row>
            <el-row :gutter="5" style="margin: 10px;">
              <el-col :span="2">
                <el-button type="primary" @click="addRow()">+新增</el-button>
              </el-col>
              <el-col :span="2" :offset="1">
                <el-button type="success" icon="el-icon-success" @click="submit()">保存</el-button>
              </el-col>
              <el-col :span="2" :offset="17">
                <el-button type="danger" icon="el-icon-error">关闭</el-button>
              </el-col>

            </el-row>
          </el-footer>

        </el-container>
      </el-col>

    </el-row>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        Year: '',

        options: [{
            value: '选项1',
            label: '柴油'
          },
          {
            value: '选项2',
            label: '食用油'
          },
          {
            value: '选项3',
            label: '机油'
          }
        ],
        select_oil_name: '',

        types: [{
            value: '选项1',
            label: '歼灭机'
          },
          {
            value: '选项2',
            label: '无人机'
          },
          {
            value: '选项3',
            label: '运货机'
          }
        ],
        machines: [{
            value: '选项1',
            label: '001'
          },
          {
            value: '选项2',
            label: '002'
          },
          {
            value: '选项3',
            label: '003'
          }
        ],

        textarea: '', //备注信息

        tabledata: [], //表数据

        units: [{
            value: '选项1',
            label: '升'
          },
          {
            value: '选项2',
            label: '公斤'
          }
        ],

        pickerOptions0: { //日期选择今天或之前
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },

        newData: [],
      }
    },
    methods: {
      getSummaries(param) {
        const {
          columns,
          data
        } = param;
        let units=[]
        for(let x in data){
          units[x]=data[x].unit
        }
        const sums = [];
        columns.forEach((column, index) => {
          if (index == 0) {
            sums[index] = '总计（升）';
          }
          if(index==9){
            sums[index] = '总计：';
          }
          if(index==10){
            sums[index]= Number(sums[7]+sums[8]+sums[6])
          }
          let i=0;
          if (column.property !== undefined&&column.property!=="unit") {
            //加了prop属性的el-table-column 才能找到column.property
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)&&units[i]=='升') {
                  return prev + curr; //多行相加
                } else {
                  return prev;
                }
                i++;
              }, 0);
            } else {
              sums[index] = 0;
            }
          }
        });
        return sums;
      },
 
      //添加
      addRow() {
        let data = {
          date: '',
          unit: '',
          type: '',
          machine: '',
          initialvalue: '',
          finalvalue: '',
          train: '',
          ground: '',
          ssnbs: '',
          signature: '谢思文',
          newOne: true,
          isSet: true
        };
        this.tabledata.push(data);
      },
      deleteRow(index) { //在这要看是新建的数据还是老数据
        this.tabledata.splice(index, 1);
      },
      changeRow(index) {
        if (this.tabledata[index].isSet) { //当前正在编辑，显示保存键,一下内容为暂时保存
          this.tabledata[index].isSet = false
        } else { //当前已经暂时保存，显示修改键盘，将重新修改
          this.tabledata[index].isSet = true
        }
      },
      submit() {
        for (let i in this.tabledata) {
          if (this.tabledata[i].isSet) {
            alert("没保存完")
            return false
          }
        }
        //
        for (let i in this.tabledata) {
          if (this.tabledata[i].newOne) {
            delete this.tabledata[i].newOne
            delete this.tabledata[i].isSet
            this.newData.push(this.tabledata[i])
            console.log(this.newData) //上传添加
          }
        }
      }
    },

  }
</script>

<style scoped>
  >>>.el-input__inner {
    height: 25px;
    padding: 5px;
    margin: 0px 5px 5px 5px;

  }

  .el-table {
    overflow: visible !important;
  }
  .el-table .el-input{
    width: 75px;
  }
  .el-date-picker{
    width: 150px;
  }
  .el-select{
    width: 85px;
  }
  #app {
    text-align: center;
  }

  #page_header {
    float: right;
    top: 20px;
    display: inline
  }
  /* 
  
  .tb-edit .el-input {
    display: none
  }

  .tb-edit .current-row span .el-input {
    display: block
  }
 
  .tb-edit .current-row .el-input+span {
    display: none
  } */
</style>
