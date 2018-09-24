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
              <el-form label-position="left"
                       inline
                       class="demo-table-expand">
                <el-form-item>
                  <el-table
                    ref="multipleTable"
                    :data="props.row.elements"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @select="documentSelect"
                    @select-all="documentSelectAll"
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
                      prop="field"
                      width="120">
                      <template slot-scope="scope">
                        <el-input :id="'fieldInput_'+scope.row.id" size="mini" v-model="scope.row.field"
                                  placeholder="请输入字段"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      class="subUid"
                      label="子任务Uid"
                      prop="subUid"
                      width="120">
                      <template slot-scope="scope">
                        <el-input :id="'fieldInput_sub_'+scope.row.id" v-if="scope.row.dataType === 'URL'"
                                  size="mini" v-model="scope.row.subTaskUid"
                                  placeholder="请输入uid"></el-input>
                      </template>
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
        <el-col :span="4"><span class="hint">级别:</span></el-col>
        <el-col :span="8">
          <template>
            <el-select v-model="taskInfo.level" placeholder="请选择"
                       :change="dataLevelChange()">
              <el-option
                v-for="item in levels"
                :key="item.valueDateType"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-col>
      </el-row>
    </div>

    <div class="area">
      <el-row>
        <div id="cron" v-if="taskInfo.level === 0">
          <el-col :span="4"><span class="hint">schedule:</span></el-col>
          <el-col :span="8">
            <el-input placeholder="cron表达式" v-model="taskInfo.cron">
            </el-input>
          </el-col>
        </div>
        <div id="threadCoolSize" v-if="taskInfo.level === 0">
          <el-col :span="4"><span class="hint">线程池大小:</span></el-col>
          <el-col :span="8">
            <el-input placeholder="线程池大小(最大500) " v-model="taskInfo.threadCoolSize">
            </el-input>
          </el-col>
        </div>
      </el-row>
    </div>

    <div class="area">
      <el-row>
        <el-col :span="4"><span class="hint">任务名:</span></el-col>
        <el-col :span="8">
          <el-input placeholder="请输入表名 " v-model="taskInfo.name">
          </el-input>
        </el-col>
        <div id="collectionName" v-if="taskInfo.level === 0">
          <el-col :span="4"><span class="hint">集合名:</span></el-col>
          <el-col :span="8">
            <el-autocomplete
              class="inline-input"
              v-model="taskInfo.collectionName"
              :fetch-suggestions="querySearch"
              placeholder="请输入集合名"
              @select="handleSelect"
            ></el-autocomplete>
          </el-col>
        </div>
      </el-row>
    </div>

    <div class="area">
      <el-row>
        <el-col :span="4"><span class="hint">备注:</span></el-col>
        <el-col :span="20">
          <el-input placeholder="请输入备注 " v-model="taskInfo.memo">
          </el-input>
        </el-col>
        </el-col>
      </el-row>
    </div>

    <!--最终保存-->
    <div>
      <el-row>
        <el-button type="success" @click="dialogSave">保 存</el-button>
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
        levels: [
          {
            value: 0,
            label: '父类'
          }, {
            value: 1,
            label: '子类'
          }],
        treeDocuments: [],
        multipleSelection: [],
        selectedElementId: [],
        taskInfo: {
          level: 0,
          name: '',
          cron: '',
          threadCoolSize: '',
          collectionName: '',
          memo: '',
          parseNodes: []
        }
      }
    },
    mounted: function () {
      this.loadingData();
      this.httpGetTask();
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
      documentSelect(rows, row) {
        console.log(row, rows);
        if (rows.length === 0 || !this.rowInRows(rows, row)) {
          for (var i = 0; i < this.selectedElementId.length; i++) {
            if (this.selectedElementId[i] === row.id) {
              this.selectedElementId.splice(i, 1);
              break;
            }
          }
        } else {
          this.selectedElementId.push(row.id);
        }
        console.log(this.selectedElementId);

        //移除节点
        /*     if (rows.length === 0 || !this.rowInRows(rows, row)) {
               $("#fieldInput_" + row.id).attr("disabled", false);
               $("#fieldInput_sub_" + row.id).attr("disabled", false);
               node.elementInfoMap.delete(row.id);
               return;
             }*/

        //添加节点
        /*       if (node == null) {
                 node = {};
                 node.documentId = row.documentId;
                 node.elementInfoMap = {};
                 this.taskInfo.parseNodes.push(node);
               }
               taskElementInfo.field = row.field == null ? this.$comjs.uuid() : row.field;
               taskElementInfo.subTaskUid = row.subTaskUid;
               taskElementInfo.expand = row.expend;
               node.elementInfoMap[row.id] = taskElementInfo;

               $("#fieldInput_" + row.id).attr("disabled", true);
               $("#fieldInput_sub_" + row.id).attr("disabled", true);*/
      },
      findNode(documentId) {
        for (var i = 0; i < this.taskInfo.parseNodes.length; i++) {
          if (this.taskInfo.parseNodes[i].documentId === documentId) {
            return this.taskInfo.parseNodes[i];
          }
        }
      },
      rowInRows(rows, row) {
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].id === row.id) {
            return true
          }
        }
        return false;
      },
      documentSelectAll(rows, id) {
        console.log(rows, id);
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          //todo 寻找解决办法中
        }
      },
      //级别选择变化
      dataLevelChange() {
        //子

      },
      //保存
      httpPostTask() {
        //console.log(this.treeDocuments);
        console.log(this.taskInfo);
        //console.log(this.selectedElementId);
        for (var i = 0; i < this.selectedElementId.length; i++) {
          var elementId = this.selectedElementId[i];
          for (var j = 0; j < this.treeDocuments.length; j++) {
            var document = this.treeDocuments[j];
            for (var k = 0; k < document.elements.length; k++) {
              var element = document.elements[k];
              if (elementId == element.id) {
                console.log(elementId);
                var node = this.findNode(document.id);
                if (node == null) {
                  node = {};
                  node.documentId = document.id;
                  node.elementInfoMap = {};
                  this.taskInfo.parseNodes.push(node);
                }
                var taskElementInfo = {};
                taskElementInfo.elementId = elementId;
                taskElementInfo.field = element.field == null ? this.$comjs.uuid() : element.field;
                taskElementInfo.subTaskUid = element.subTaskUid;
                taskElementInfo.expand = element.expend;
                node.elementInfoMap[elementId] = taskElementInfo;
              }
            }
          }
        }
        console.log(this.taskInfo);
         this.axios.post("/api/task", this.taskInfo).then((res) => {
           this.$message(res.data.message);
           this.taskInfo.parseNodes = "";
         }).catch((err) => {
           this.$message(err.data);
         });
      },
      //更新
      httpPutTask() {
        this.axios.put("/api/task/" + this.taskInfo.uid, this.taskInfo).then((res) => {
          this.$message(res.data.message);
        }).catch((err) => {
          this.$message(err.data);
        });
      },
      dialogSave() {
        if (this.taskInfo.level > 0) {
          this.taskInfo.cron = '';
          this.taskInfo.collectionName = '';
          this.taskInfo.threadCoolSize = '';
        }

        console.log(this.taskInfo);
        this.$confirm('确认保存任务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(this.taskInfo);
          var uid = this.$route.params.id;
          if (uid == null) {
            this.httpPostTask();
          } else {
            this.httpPutTask();
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保持'
          });
        });
      },
      httpGetTask() {
        var uid = this.$route.params.id;
        if (uid == null) {
          return;
        }

        this.axios.get("/api/task/" + uid).then((res) => {
          if (res.data.status === 200) {
            this.taskInfo = res.data.data;
            this.$message(res.data.message);
          } else {
            this.$message({
              message: '获取数据失败',
              type: 'warning'
            });
          }

        }).catch((err) => {
          this.$message(err);
        });
      }
    }
  }
</script>

<style scoped>

</style>
