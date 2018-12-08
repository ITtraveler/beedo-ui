<template>
  <div>
    <div class="area">
      <div style="text-align: left;padding: 12px;">提取列表</div>
      <el-collapse>
        <div v-for="item in treeDocuments">
          <el-collapse-item :title="item.name" :name="item.id">
            <template slot-scope="props">
              <el-form label-position="left"
                       inline
                       class="demo-table-expand">
                <el-form-item>
                  <el-table
                    ref="multipleTable"
                    :data="item.elements"
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
                      label="操作"
                      width="120">
                      <template slot-scope="scope">
                        <el-popover
                          placement="top"
                          width="300"
                          hight="300"
                          trigger="click">
                          <div>
                            <div>
                              <el-input :id="'fieldInput_field_'+scope.row.id" size="mini" v-model="scope.row.field"
                                        placeholder="数据库字段"></el-input>

                              <el-input :id="'fieldInput_sub_'+scope.row.id" v-if="scope.row.dataType === 'URL'"
                                        style="margin-top: 10px"
                                        size="mini" v-model="scope.row.subTaskUid"
                                        placeholder="子任务uid"></el-input>
                              <el-input :id="'fieldInput_def_'+scope.row.id"
                                        style="margin-top: 10px"
                                        size="mini" v-model="scope.row.defValue"
                                        placeholder="默认值"></el-input>
                            </div>
                            <div style="margin-top: 10px">
                              <el-switch
                                :id="'fieldInput_exp_'+scope.row.id"
                                v-if="scope.row.structureType === 'ARRAY'"
                                v-model="scope.row.expand"
                                inactive-text="数据展开:">
                              </el-switch>
                              <el-switch
                                :id="'fieldInput_index_'+scope.row.id"
                                v-model="scope.row.isIndex"
                                inactive-text="唯一性:">
                              </el-switch>
                              <el-switch
                                :id="'fieldInput_blank_'+scope.row.id"
                                v-model="scope.row.isNotBlank"
                                inactive-text="去空:">
                              </el-switch>
                            </div>
                          </div>

                          <el-button slot="reference">设置</el-button>
                        </el-popover>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-form>
            </template>
          </el-collapse-item>
        </div>
      </el-collapse>
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

    <div class="area">
      <el-row>
        <el-col :span="4"><span class="hint">级别:</span></el-col>
        <el-col :span="8">
          <template>
            <el-select v-model="taskInfo.level" placeholder="请选择">
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
      /** 组件操作 **/
      clearSelection(rows) {
        this.$refs.multipleTable.clearSelection();
      },

      documentSelect(rows, row) {
        //rows.lenght == 0 为取消选择操作，反之
        console.log("select event:", row, rows);
        console.log(rows.__ob__.dep.id);
        if (rows.length === 0 || !this.rowInRows(rows, row)) {
          for (var i = 0; i < this.selectedElementId.length; i++) {
            if (this.selectedElementId[i].elementId === row.id) {
              //从中移除
              this.selectedElementId.splice(i, 1);
              break;
            }
          }
        } else {
          var select = {};
          select.elementId = row.id;
          //当前组件id
          select.depId = rows.__ob__.dep.id;
          //添加
          this.selectedElementId.push(select);
        }

        console.log("selectedElementId:", this.selectedElementId)
      },

      documentSelectAll(rows) {
        console.log("select all event:", rows);
        var depId = rows.__ob__.dep.id;
        //删除
        if (rows.length === 0) {
          var newSelectedElementId = [];
          for (var i = 0; i < this.selectedElementId.length; i++) {
            if (depId != this.selectedElementId[i].depId) {
              newSelectedElementId.push(this.selectedElementId[i]);
            }
          }
          this.selectedElementId = newSelectedElementId;
        } else { //全选
          for (var i = 0; i < rows.length; i++) {
            var curElementId = rows[i].id;
            var inSelected = false;
            for (var j = 0; j < this.selectedElementId.length; j++) {
              if (curElementId == this.selectedElementId[j].elementId) {
                inSelected = true;
                break;
              }
            }
            if (!inSelected) {
              var select = {};
              select.elementId = curElementId;
              //当前组件id
              select.depId = depId;
              this.selectedElementId.push(select);
            }
          }
        }
        console.log("selectedElementId:", this.selectedElementId)
      },

      /** http **/
      //首次进来加载数据
      loadingData() {
        this.axios.get("/beedo/document/page/" + this.page.num + "/size/" + this.page.size).then((res) => {
          this.treeDocuments = res.data.dataList;
          this.page.totalSize = res.data.totalSize;
          //todo 设置已选项
        }).catch((err) => {
          this.$message(err);
        });
      },
      moreDocuments() {
        //this.page.num++;
        this.axios.get("/beedo/document/page/" + this.page.num + "/size/" + this.page.size).then((res) => {
          this.treeDocuments = this.treeDocuments.concat(res.data.dataList);
        }).catch((err) => {
          this.$message(err);
        });
      },
      //保存
      httpPostTask() {
        this.handlePerDealData();
        this.axios.post("/beedo/task", this.taskInfo).then((res) => {
          this.$message(res.data.message);
          this.taskInfo.parseNodes = "";
        }).catch((err) => {
          this.$message(err.data);
        });
      },
      //更新
      httpPutTask() {
        this.handlePerDealData();
        this.axios.put("/beedo/task/" + this.taskInfo.uid, this.taskInfo).then((res) => {
          this.$message(res.data.message);
        }).catch((err) => {
          this.$message(err.data);
        });
      },

      httpGetTask() {
        var uid = this.$route.params.id;
        if (uid == null) {
          return;
        }

        this.axios.get("/beedo/task/" + uid).then((res) => {
          if (res.data.status === 200) {
            this.taskInfo = res.data.data;
            console.log(this.taskInfo);
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
      },

      /** other **/
      //提交数据前置处理
      handlePerDealData() {
        //先清空原始配的节点
        this.taskInfo.parseNodes = [];
        //console.log(this.treeDocuments);
        console.log(this.taskInfo);

        //重新配置节点
        for (var i = 0; i < this.selectedElementId.length; i++) {
          var elementId = this.selectedElementId[i].elementId;
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
                taskElementInfo.defValue = element.defValue;
                taskElementInfo.isIndex = element.isIndex;
                taskElementInfo.isNotBlank = element.isNotBlank;
                node.elementInfoMap[elementId] = taskElementInfo;
              }
            }
          }
        }
        console.log(this.taskInfo);
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
      handleSizeChange(size) {
        console.log(`每页 ${size} 条`);
        this.page.size = size;
        this.loadingData();
      },
      handleCurrentChange(num) {
        console.log(`当前页: ${num}`);
        this.page.num = num;
        this.loadingData();
        //todo 已经被选项打勾

      }
    }
  }
</script>

<style scoped>

</style>
