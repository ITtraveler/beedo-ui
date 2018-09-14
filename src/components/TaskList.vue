<template>
  <div>
    <div class="area">
      <template>
        <el-table
          :data="taskListData"
          style="width: 100%">
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
    <div class="area">
      <template>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.num"
            :page-sizes="[20, 40, 80, 160]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.totalSize">
          </el-pagination>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    data() {
      return {
        page: {
          size: 20,
          num: 1,
          totalSize: 0
        },
        taskListData: []
      }
    },
    mounted: function () {
      this.loadingData();
    },
    methods: {
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      //首次进来加载数据
      loadingData() {
        this.axios.get("/api/task/page/" + this.page.num + "/size/" + this.page.size).then((res) => {
          this.taskListData = res.data.dataList;
          this.page.totalSize = res.data.totalSize;
        }).catch((err) => {
          this.$message(err);
        });
      },
      deleteRow(index, rows) {
        this.$confirm('此操作将永久删除该解析任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete("/api/task/" + rows[index].uid).then((res) => {
            if (res.data.status == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              rows.splice(index, 1);
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              });
            }
          }).catch((err) => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          });

        }).catch(() => {
          this.$message('已取消删除');
        });
      }
    }
  }
</script>

<style scoped>

</style>
