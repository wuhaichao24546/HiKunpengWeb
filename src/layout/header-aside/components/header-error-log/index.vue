<template>
  <div>
    <el-tooltip
      effect="dark"
      :content="tooltipContentNew"
      placement="bottom">
      <el-button
        class="d2-ml-0 d2-mr btn-text can-hover"
        type="text"
        @click="handleClickNew">
        <d2-icon
          name="dot-circle-o"
          style="font-size: 20px"/>
      </el-button>
    </el-tooltip>
    <el-tooltip
      effect="dark"
      :content="tooltipContent"
      placement="bottom">
      <el-button
        class="d2-ml-0 d2-mr btn-text can-hover"
        type="text"
        @click="handleClick">
        <el-badge
          v-if="logLength > 0"
          :max="99"
          :value="logLengthError"
          :is-dot="logLengthError === 0">
          <d2-icon
            :name="logLengthError === 0 ? 'dot-circle-o' : 'bug'"
            style="font-size: 20px"/>
        </el-badge>
        <d2-icon
          v-else
          name="dot-circle-o"
          style="font-size: 20px"/>
      </el-button>
    </el-tooltip>
    <el-dialog
      :title="tooltipContent"
      :fullscreen="true"
      :visible.sync="dialogVisible"
      :append-to-body="true">
      <div class="d2-mb-10">
        <el-button type="danger" size="mini" @click="handleLogClean">
          <d2-icon name="trash-o"/>
          清空
        </el-button>
      </div>
      <d2-error-log-list/>
    </el-dialog>

    <el-dialog
      :title="tooltipContentNew"
      :fullscreen="true"
      :visible.sync="dialogVisibleNew"
      :append-to-body="true">
      <div class="d2-mb-10">
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
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  deepseek,
} from '@/api/admin/todo/index'
import { mapGetters, mapMutations } from 'vuex'
import D2ErrorLogList from './components/list'
export default {
  components: {
    D2ErrorLogList
  },
  data () {
    return {
      content: undefined,
      isLock: false,
      listQuery: {
        msg: undefined
      },
      dialogVisible: false,
      dialogVisibleNew: false
    }
  },
  computed: {
    ...mapGetters('d2admin', {
      logLength: 'log/length',
      logLengthError: 'log/lengthError'
    }),
    tooltipContentNew () {
      return 'deepseekAI'
    },
    tooltipContent () {
      return this.logLength === 0
        ? '没有日志或异常'
        : `${this.logLength} 条日志${this.logLengthError > 0
          ? ` | 包含 ${this.logLengthError} 个异常`
          : ''}`
    }
  },
  methods: {
    ...mapMutations('d2admin/log', [
      'clean'
    ]),
    handleClick () {
      if (this.logLength > 0) {
        this.dialogVisible = true
      }
    },
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
    handleClickNew () {
      this.dialogVisibleNew = true
    },
    handleLogClean () {
      this.dialogVisible = false
      this.clean()
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