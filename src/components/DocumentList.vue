<template>
  <div>
    <div class="area">
      <template>
        <el-table
          :data="tableDocumentData"
          style="width: 100%"
          highlight-current-row="true"
        >
          <el-table-column
            fixed
            type="index"
            label="序号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            width="320">
          </el-table-column>
          <el-table-column
            prop="url"
            label="解析地址"
            width="320">
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
                @click.native.prevent="$goRoute('/document/'+scope.row.id)"
                type="text"
                size="small">
                修改
              </el-button>
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableDocumentData)"
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
        tableDocumentData: []
      }
    },
    mounted: function () {
      this.loadingData();
    },
    methods: {
      //首次进来加载数据
      loadingData() {
        this.axios.get("/beedo/document/page/" + this.page.num + "/size/" + this.page.size).then((res) => {
          this.tableDocumentData = res.data.dataList;
          this.page.totalSize = res.data.totalSize;
        }).catch((err) => {
          this.$message(err);
        });
      },
      deleteRow(index, rows) {
        this.$confirm('此操作将永久删除该Document, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete("/beedo/document/" + rows[index].id).then((res) => {
            if(res.data.status == 200){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              rows.splice(index, 1);
            }else{
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

      },
      handleSizeChange(size) {
        console.log(`每页 ${size} 条`);
        this.page.size = size;
        this.loadingData();
      },
      handleCurrentChange(num) {
        console.log(`当前页: ${num}`);
        this.page.num = num;
        this.loadingData();
      }
    }
  }
</script>

<style scoped>

</style>
