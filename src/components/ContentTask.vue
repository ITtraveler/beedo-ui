<template>
  <div>
    <div class="area">
      <template>
        <el-table
          :data="treeDocuments"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item>
                  <el-table
                    ref="multipleTable"
                    :data="props.row.elements"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @select="rowSelect(scope.$index,scope.row)"
                    >
                    <el-table-column
                      type="selection"
                      width="55">
                    </el-table-column>
                    <el-table-column
                      fixed
                      type="index"
                      label="序号"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      label="cssQuery"
                      prop="cssQuery"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      label="数据类型"
                      prop="dataType"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      label="数据结构"
                      prop="structureType"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      label="属性"
                      prop="attr"
                      width="80">
                    </el-table-column>
                    <el-table-column
                      label="备注"
                      prop="memo"
                      width="200"
                      show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                      label="数据库字段"
                      width="100"
                      prop="field"
                      show-overflow-tooltip>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            label="提取列表"
            width="100">
          </el-table-column>
          <el-table-column
            prop="url">
          </el-table-column>
          <el-table-column
            prop="name">
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="clearSelection()">取消选择</el-button>
          <el-button @click="moreDocuments()">更多</el-button>
        </div>
      </template>
    </div>
    <div class="area">
      <el-row>
        <el-col :span="4"><span class="hint">schedule:</span></el-col>
        <el-col :span="8">
          <el-input placeholder="请输cron表达式 " v-model="cron">
          </el-input>
        </el-col>
        <el-col :span="4"><span class="hint">线程数:</span></el-col>
        <el-col :span="8">
          <el-input placeholder="线程数量(最大500) " v-model="cron">
          </el-input>
        </el-col>
      </el-row>
    </div>

    <div class="area">
      <el-row>
        <el-col :span="4"><span class="hint">任务名:</span></el-col>
        <el-col :span="8">
          <el-input placeholder="请输入任务名 " v-model="cron">
          </el-input>
        </el-col>
        <el-col :span="4"><span class="hint">mongodb:</span></el-col>
        <el-col :span="8">
          <el-autocomplete
            class="inline-input"
            v-model="mongodb"
            :fetch-suggestions="querySearch"
            placeholder="请输入名"
            @select="handleSelect"
          ></el-autocomplete>
        </el-col>
      </el-row>
    </div>

    <div class="area">
      <el-row>
        <el-col :span="4"><span class="hint">备注:</span></el-col>
        <el-col :span="20">
          <el-input placeholder="请输入任务名 " v-model="memo">
          </el-input>
        </el-col>
        </el-col>
      </el-row>
    </div>

    <!--最终保存-->
    <div>
      <el-row>
        <el-button type="success">保 存</el-button>
      </el-row>
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
        treeDocuments: [],
        multipleSelection: [],
        mongodb: ''
      }
    },
    mounted: function () {
      this.loadingData();
    },
    methods: {
      clearSelection(rows) {
        this.$refs.multipleTable.clearSelection();
      },
      //首次进来加载数据
      loadingData() {
        this.axios.get("/api/document/page/" + this.page.num + "/size/" + this.page.size).then((res) => {
          this.treeDocuments = res.data.dataList;
        }).catch((err) => {
          this.$message(err);
        });
      },
      moreDocuments() {
        this.page.num++;
        this.axios.get("/api/document/page/" + this.page.num + "/size/" + this.page.size).then((res) => {
          this.treeDocuments = this.treeDocuments.concat(res.data.dataList);
        }).catch((err) => {
          this.$message(err);
        });
      },
      rowSelect(index,row){
        console.log(index,row);
        row.field='333';
      }
    }
  }
</script>

<style scoped>

</style>
