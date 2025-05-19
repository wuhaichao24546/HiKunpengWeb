<template>
  <d2-container>
    <template slot="header">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right: 20px;" class="filter-item"
        placeholder="请输入标题" v-model="listQuery.title" size="small"> </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="small">搜索</el-button>
    </template>
    <el-button class="filter-item" v-permission:function="['userManager:btn_add']" style="margin-left: 10px;"
      @click="handleCreate" type="primary" size="mini"  icon="el-icon-circle-plus">添加待办</el-button>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" size="small" stripe highlight-current-row
      style="width: 100%;margin-top: 20px">
      <el-table-column align="center" label="序号" width="80" > <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template> </el-table-column>
      <el-table-column width="150" align="center" label="标题"> <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template> </el-table-column>
      <el-table-column width="300" align="center" label="描述" > <template slot-scope="scope">
        <span>{{ scope.row.description }}</span>
        </template> </el-table-column>
      <el-table-column width="100" align="center" label="计划完成时间" > <template slot-scope="scope">
          <span>{{ scope.row.planEndTime }}</span>
        </template> </el-table-column>
      <el-table-column width="100" align="center" label="分类" > <template slot-scope="scope">
          <span>{{ scope.row.className }}</span>
        </template> </el-table-column>
      <el-table-column width="100" align="center" label="状态" > <template slot-scope="scope">
          <span>{{getChangeType(scope.row.status)}}</span>
        </template> </el-table-column>
      <el-table-column width="100" align="center" label="是否逾期" > <template slot-scope="scope">
          <span v-if="scope.row.overdueFlag==false" style="color:#008000">{{getChangeType(scope.row.overdueFlag)}}</span>
          <span v-else style="color:#F7220B">{{getChangeType(scope.row.overdueFlag)}}</span>
      </template> </el-table-column>
      <el-table-column align="center" label="操作" width="250" fixed="right"> <template slot-scope="scope">
          <el-button v-permission:function="['userManager:btn_edit']" size="small" type="success"
            @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-permission:function="['userManager:btn_del']" size="small" type="danger"
          @click="handleDelete(scope.row)">删除
          </el-button>
          <el-button v-permission:function="['userManager:btn_del']" size="small" type="success"
            @click="handleClose(scope.row)">关闭
          </el-button>
        </template> </el-table-column>
    </el-table>
    <!-- <div v-show="!listLoading" class="pagination-container"> -->
    <template slot="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </template>
    <!-- </div> -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="150px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'create' || dialogStatus == 'update'" label="计划完成时间" placeholder="请输入完成时间" prop="planEndTime">
          <el-date-picker v-model="form.planEndTime" type="datetime" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="分类" prop="className">
          <el-select class="filter-item" v-model="form.className" placeholder="请选择">
            <el-option v-for="item in sexOptions" :key="item.id" :label="item.title" :value="item.title"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" placeholder="请输入内容"
            v-model="form.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus == 'create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  closeObj,
  pageClassObj,
  putObj
} from '@/api/admin/todo/index'
import { ceil } from 'lodash'
import { mapGetters } from 'vuex'
export default {
  name: 'userManager',
  data() {
    return {

      form: {
        title: undefined,
        status: 'todo',
        classId: undefined,
        className: undefined,
        planEndTime: undefined,
        repeatFlag: undefined,
        repeatType: undefined,
        description: undefined
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'blur'
          }
        ],
        planEndTime: [
          {
            required: true,
            message: '请输入完成时间',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        className: [
          {
            required: true,
            message: '请输入分类',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      sexOptions: [
        // {value:'1',label:'运动健康'},
        // {value:'2',label:'日常生活'},
        // {value:'3',label:'娱乐活动'},
        // {value:'4',label:'工作内容'}
      ],
      typeList:[
        {value:'todo',label:'待完成'},
        {value:'finish',label:'已完成'},
        {value:true,label:'逾期'},
        {value:false,label:'健康'}
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      userManager_btn_edit: this.hasPermissions(['userManager:btn_edit']),
      userManager_btn_del: false,
      userManager_btn_close: false,
      userManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true
      page(this.listQuery)
        .then(response => {
          this.list = response.rows
          this.total = response.total
          this.listLoading = false
        })
    },
    getListClass() {
      pageClassObj(this.listQuery)
        .then(response => {
          this.sexOptions = response
        })
    },
    handleFilter() {
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate() {
      this.getListClass()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      getObj(row.id)
        .then(response => {
          this.form = response
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.id)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
            })
        })
    },
    handleClose(row) {
      this.$confirm('此操作将永久关闭, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          closeObj(row.id)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '关闭成功',
                type: 'success',
                duration: 2000
              })
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
            })
        })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form)
            .then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    cellClassName({row, column, rowIndex, columnIndex}) {  
      if (row.title === 'test1') {  
      	// 返回你想要应用的CSS类名  
        return 'highlight-class'; 
      }  
      // 或者返回空字符串，表示不应用任何类
      return 'highlight-class';   
    },
    getChangeType(e) {
      for (var i = 0; i < this.typeList.length; i++) {
        if (this.typeList[i].value == e) { //value，label保持和上面定义一致
          return this.typeList[i].label;
        }
      }
    },
    resetTemp() {
      this.form = {
        title: undefined,
        status: 'todo',
        classId: undefined,
        className: undefined,
        planEndTime: undefined,
        repeatFlag: undefined,
        repeatType: undefined,
        description: undefined
      }
    }
  }
}
</script>
<style scoped>  
.highlight-class {  
  /* 设置你想要的背景颜色 */
  background-color: yellow;   
}  
</style>