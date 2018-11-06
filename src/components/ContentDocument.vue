<template>
  <div>
    <!--url-->
    <div>
      <el-input placeholder="请要解析的url地址" v-model="documentInfo.url" class="input-with-select">
        <el-select v-model="documentInfo.protocol" slot="prepend" placeholder="请选择">
          <el-option label="http://" value="http://"></el-option>
          <el-option label="https://" value="https://"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getHtmlData()"></el-button>
      </el-input>

      <div class="area">
        <el-input
          resize="vertical"
          type="textarea"
          :rows="5"
          placeholder="html显示处"
          v-model="htmlContent">
        </el-input>
        <!-- <editor v-model="content" @init="editorInit" lang="html" theme="chrome" width="500" height="100"></editor>-->
      </div>
    </div>

    <!--配置-->
    <div class="area">
      <div class="area">
        <el-row>
          <el-col :span="4"><span class="hint">元素选择:</span></el-col>
          <el-col :span="20">
            <el-input placeholder="请输入元素(节点) " v-model="element.cssQuery">
            </el-input>
          </el-col>
        </el-row>
      </div>
      <div class="area">
        <el-row>
          <el-col :span="4"><span class="hint">数据类型:</span></el-col>
          <el-col :span="5">
            <template>
              <el-select v-model="element.dataType" placeholder="请选择"
                         :change="dataTypeChange()">
                <el-option
                  v-for="item in optionsDataType"
                  :key="item.valueDateType"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-col>
          <el-col :span="3">
            <el-input id="element-attr" placeholder="属性" v-model="element.attr" hidden="hidden">
            </el-input>
          </el-col>
          <el-col :span="4"><span class="hint">结构类型:</span></el-col>
          <el-col :span="6">
            <template>
              <el-select v-model="element.structureType" placeholder="请选择">
                <el-option
                  v-for="item in optionsStructureType"
                  :key="item.valueStructureType"
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
          <el-col :span="4"><span class="hint">备注:</span></el-col>
          <el-col :span="16">
            <el-input placeholder="备注信息" v-model="element.memo">
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-view" circle title="测试" @click="cssQueryTest"></el-button>
            <el-button type="success" icon="el-icon-check" circle title="添加" @click="addElement()"></el-button>
          </el-col>
        </el-row>
      </div>
      <div class="area">
        <el-col :span="4"><span class="hint">筛选结果:</span></el-col>
        <el-col :span="20">
          <el-input
            disabled="true"
            resize="vertical"
            type="textarea"
            :rows="2"
            placeholder="筛选结果"
            v-model="testArea">
          </el-input>
        </el-col>
      </div>
    </div>

    <!--配置列表-->
    <div class="area" style="display: inline-block;">
      <template>
        <el-table
          :data="documentInfo.elements"
          style="width: 100%"
          max-height="250">
          <el-table-column
            fixed
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="cssQuery"
            label="元素 (节点)"
            width="120">
          </el-table-column>
          <el-table-column
            prop="dataType"
            label="数据类型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="attr"
            label="数据属性"
            width="120">
          </el-table-column>
          <el-table-column
            prop="structureType"
            label="结构类型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="memo"
            label="备注"
            width="300">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, documentInfo.elements)"
                type="text"
                size="small">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>

    <!--最终保存-->
    <div>
      <el-row>
        <el-button type="success" @click="dialogSave()">保 存</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    name: "",
    data() {
      return {
        disable: false,
        protocol: 'http://',
        htmlContent: '',
        testArea: '',
        optionsDataType: [
          {
            value: 'TEXT',
            label: '文本'
          }, {
            value: 'HTML',
            label: 'HTML'
          }, {
            value: 'ATTR',
            label: '属性'
          }, {
            value: 'URL',
            label: '链接'
          }],
        valueDateType: 'TEXT',

        optionsStructureType: [
          {
            value: 'STRING',
            label: '字符串'
          }, {
            value: 'ARRAY',
            label: '数组'
          }],
        valueStructureType: 'STRING',

        element: {
          cssQuery: '',
          dataType: '',
          structureType: '',
          attr: '',
          memo: ''
        },
        documentInfo: {
          protocol: 'http://',
          elements: []
        }
      }
    },
    mounted: function () {
      this.httpGetDocument();
    },
    methods: {
      //获取html
      getHtmlData() {
        var url = this.documentInfo.protocol + this.documentInfo.url;
        this.axios.get("/api/document/parse/url?parseUrl=" + url).then((res) => {
          this.$message(res.data.message);
          this.htmlContent = res.data.data;
        }).catch((err) => {
          this.$message(err);
        });

      },
      //是否显示属性输入框
      dataTypeChange() {
        if (this.element.dataType == 'ATTR' || this.element.dataType == 'URL') {
          $('#element-attr').show();
        } else {
          $('#element-attr').hide();
        }
      },
      //删除一行element
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      addElement() {
        if (this.element.cssQuery === '' || this.element.dataType === '' || this.element.structureType === '') {
          this.$message({
            message: '警告，请完善信息！',
            type: 'warning'
          });
          return;
        }
        var newElement = this.$comjs.cloneObj(this.element);
        this.documentInfo.elements.push(newElement);
      },
      cssQueryTest() {
        if (this.element.cssQuery == '') {
          return;
        }

        var url = this.documentInfo.protocol + this.documentInfo.url;
        this.axios.get("/api/document/parse/query?parseUrl=" + encodeURIComponent(url) + "&cssQuery=" +
          encodeURIComponent(this.element.cssQuery))
          .then((res) => {
            if (res.data.status === 200) {
              this.testArea = res.data.data;
            } else {
              this.$message({
                message: '测试失败',
                type: 'warning'
              });
            }
          }).catch((err) => {
          this.$message(err);
        });
      },
      httpGetDocument() {
        var id = this.$route.params.id;
        if (id.isNaN) {
          return;
        }
        this.axios.get("/api/document/" + id).then((res) => {
          if (res.data.status === 200) {
            this.documentInfo = res.data.data;
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
      httpPostDocument() {
        this.axios.post("/api/document", this.documentInfo).then((res) => {
          this.$message(res.data.message);
        }).catch((err) => {
          this.$message(err.data);
        });
      },
      httpPutDocument() {
        this.axios.put("/api/document", this.documentInfo).then((res) => {
          this.$message(res.data.message);
        }).catch((err) => {
          this.$message(err.data);
        });
      },
      dialogSave() {
        this.$prompt('起个名称', '提示', {
          inputValue: this.documentInfo.name,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\u4e00-\u9fa5\w-_]+/,
          inputErrorMessage: '存在空字符'
        }).then(({value}) => {
          this.documentInfo.name = value;
          var id = this.$route.params.id;
          if (isNaN(id)) {
            this.httpPostDocument();
          } else {
            this.httpPutDocument();
          }
        }).catch((e) => {
          this.$message('操作失败' + e);
        });
      }
    }
  }
</script>

<style scoped>
  .el-select {
    width: 100px;
    float: left;
  }

  .el-col .el-select {
    width: 200px;
  }

  .hint {
    float: left;
  }


</style>
