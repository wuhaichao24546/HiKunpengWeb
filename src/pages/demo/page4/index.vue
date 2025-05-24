<template>
  <d2-container>
    <el-card>
      <div class="panel-search__results-group-inner">
        <el-input type="textarea" :row="10" style="width: 1000px;margin-right: 20px;" class="filter-item"
          placeholder="请输入您的问题" v-model="listQuery.msg" size="large" autoSize="true" showCount="true"> </el-input>
        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" disable="isLock"
          size="small">deepseek一下</el-button>
      </div>
    </el-card>
    <el-card>
      <div class="panel-search__results-group-inner">
        <template>
          <el-input type="textarea" :row="20" style="width: 1000px;" class="custom-textarea" placeholder="答案在这里展示呢"
            v-model="content" disabled="false" autoSize="true" size="large" showCount="true"> </el-input>
        </template>
      </div>
    </el-card>
  </d2-container>
</template>

<script>
import {
  deepseek,
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
      content: undefined,
      isLock: false,
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
        msg: undefined
      },
      sexOptions: [
        // {value:'1',label:'运动健康'},
        // {value:'2',label:'日常生活'},
        // {value:'3',label:'娱乐活动'},
        // {value:'4',label:'工作内容'}
      ],
      typeList: [
        { value: 'todo', label: '待完成' },
        { value: 'finish', label: '已完成' },
        { value: true, label: '逾期' },
        { value: false, label: '健康' }
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
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getListNew() {
      this.listLoading = true
      this.isLock = true
      deepseek(this.listQuery)
        .then(response => {
          this.content = response
          this.isLock = false
          console.log("============", response)
        })
    },
    handleFilter() {
      this.getListNew()
    },
    resizeTextarea() {
      if (!this.content.text) return
      this.$nextTick(() => {
        this.$refs.textareaRef.style.height = 'auto'
        this.$refs.textareaRef.style.height =
          this.$refs.textareaRef.scrollHeight + 2 + 'px'
      })
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
    resetForm() {
      this.$refs['elForm'].resetFields()
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
    cellClassName({ row, column, rowIndex, columnIndex }) {
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

.custom-textarea {
  height: 600px !important;
}
</style>