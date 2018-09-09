<template>
  <div>
    <div class="area">
      <el-tree
        :data="treeDocument"
        show-checkbox
        node-key="id"
        :props="defaultProps">
      </el-tree>
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
        treeDocument: [{
          id: 1,
          label: '全选(任务节点选择)',
          children: [{
            id: 4,
            label: 'http://www.baidu.com   百度',
            children: [{
              id: 9,
              label: '表达式：（#add .b attr），  属性:（href），  数据类型：文本 ，   结构类型：字符串，   备注：测试专用'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }, {
            id: 4,
            label: 'http://www.lunshuge.com   论书阁',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }],
        mongodb: ''
      }
    },
    methods: {
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      loadAll() {
        return [
          {"value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号"},
          {"value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号"},
          {"value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113"}
        ]
      }
    },
    mounted() {
      this.restaurants = this.loadAll();
    }
  }
</script>

<style scoped>

</style>
