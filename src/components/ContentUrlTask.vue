<template>
  <div>
    <div class="area">
      <el-row>
        <el-col :span="4">
          <span class="hint">规则式URL:</span>
        </el-col>
        <el-col :span="18">
          <el-input
            placeholder="请输入URL表达式"
            v-model="urlExpression"
            clearable>
          </el-input>
        </el-col>
      </el-row>
    </div>

    <div class="area">
      <el-row>
        <el-col :span="4">
          <span class="hint">子任务uid:</span>
        </el-col>
        <el-col :span="16">
          <el-input
            placeholder="请输入子任务uid"
            v-model="subTaskUid"
            clearable>
          </el-input>
        </el-col>
      </el-row>
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
        levels: [
          {
            value: 0,
            label: '父类'
          }],
        collections: [],
        documentId: -1,
        elementId: -1,
        urlExpression: '',
        subTaskUrl: '',
        taskInfo: {
          level: 0,
          type: 'URL_EXPRESSION',
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
      this.httpGetTask();
      this.loadAllCollections();
    },
    methods: {
      /** 组件操作 **/

      /** http **/
      //保存
      httpPostTask() {
        this.handlePerDealData();
        this.axios.post("/beedo/task", this.taskInfo).then((res) => {
          this.$message(res.data.message);
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
            this.urlExpression = res.data.data.parseNodes[0].elementInfoMap[-1].urlExpression;
            this.subTaskUid = res.data.data.parseNodes[0].elementInfoMap[-1].subTaskUid;
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
        var node = {};
        node.documentId = this.documentId;
        node.elementInfoMap = {};
        this.taskInfo.parseNodes.push(node);

        var taskElementInfo = {};
        taskElementInfo.elementId = this.elementId;
        taskElementInfo.subTaskUid = this.subTaskUid;
        taskElementInfo.urlExpression = this.urlExpression;
        node.elementInfoMap[this.elementId] = taskElementInfo;

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
            message: '已取消保存'
          });
        });
      },
      //获取获取集合名
      loadAllCollections() {
        this.axios.get("/beedo/task/collections").then((res) => {
          if (res.data.status === 200) {
            var collectionNames = res.data.data;
            for (var i = 0; i < collectionNames.length; i++) {
              this.collections[i] = {value: collectionNames[i]};
            }
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
      querySearch(queryString, cb) {
        var restaurants = this.collections;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        cb(results);
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      }
    }
  }
</script>

<style scoped>

</style>
