<template>
  <el-row class="tac">
    <el-col>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>网页提取</span>
          </template>
          <el-menu-item-group>
            <template slot="title">网页提取</template>
            <el-menu-item index="1-1" @click="$goRoute('/document')">提取操作台</el-menu-item>
            <el-menu-item index="1-2" @click="$goRoute('/documentList')">提取列表</el-menu-item>
          </el-menu-item-group>
          <!--  <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">网页提取</template>
              <el-menu-item index="1-4-1">提取操作台</el-menu-item>
              <el-menu-item index="1-4-1">提取列表</el-menu-item>
            </el-submenu>-->
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>配置任务</span>
          </template>
          <el-menu-item-group>
            <template slot="title">爬虫任务</template>
            <el-menu-item index="2-1" @click="$goRoute('/task')">配置任务</el-menu-item>
            <el-menu-item index="2-2" @click="$goRoute('/urlTask')">URL任务</el-menu-item>
            <el-menu-item index="2-3" @click="$goRoute('/taskList')">任务列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="3">
          <i class="el-icon-tickets"></i>
          <span slot="title">报告</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    data(){
      return {
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style scoped>

</style>
