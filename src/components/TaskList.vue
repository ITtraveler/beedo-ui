<template>
  <div>
    <div class="area">
      <template>
        <el-table
          :data="taskListData"
          style="width: 100%"
          max-height="250">
          <el-table-column
            fixed
            type="index"
            label="序号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="任务名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="uid"
            label="uid"
            width="120">
          </el-table-column>
          <el-table-column
            prop="cron"
            label="cron"
            width="120">
          </el-table-column>
          <el-table-column
            prop="threadCoolSize"
            label="线程池大小"
            width="120">
          </el-table-column>
          <el-table-column
            prop="taskStatus"
            label="任务状态"
            width="120">
          </el-table-column>
          <el-table-column
            prop="gmtCreate"
            label="创建时间"
            width="120">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="220">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="$goRoute('/task/'+scope.row.uid)"
                type="text"
                size="small">
                修改
              </el-button>
              <el-button
                @click.native.prevent="deleteRow(scope.$index, taskListData)"
                type="text"
                size="small">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    data() {
      return {
        taskListData: [{
          uid: '1',
          name: '1',
          url: '1',
        }, {
          uid: '2',
          name: '1',
          url: '1',
        }]
      }
    },
    methods: {
      deleteRow(index, rows) {
        rows.splice(index, 1);
      }
    }
  }
</script>

<style scoped>

</style>
