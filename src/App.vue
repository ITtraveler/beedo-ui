<template>
  <div id="app">
    <el-container>
      <!--Header-->
      <el-header>Beedo</el-header>
      <el-container>
        <!--Aside-->
        <el-aside width="200px">
          <NavMenuLeft/>
        </el-aside>
        <el-container>
          <!--Main-->
          <el-main>
           <!-- <ContentDocument/>-->
     <!--       <DocumentList/>-->
          <!--  <ContentTask/>-->
            <!-- 路由匹配到的组件将渲染在这里 -->
            <router-view></router-view>
          </el-main>
          <el-footer>我是不是创造者，我只是一个搬运工</el-footer>
        </el-container>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import NavMenuLeft from './components/NavMenuLeft'
import ContentDocument from './components/ContentDocument'
import DocumentList from './components/DocumentList'
import ContentTask from './components/ContentTask'

export default {
  name: 'App',
  components: {
    NavMenuLeft,
    ContentDocument,
    DocumentList,
    ContentTask
  }
}
</script>

<style>
  .el-header{
    background-color: #545c64;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .area{
    margin-top: 12px;
    margin-bottom: 12px;
  }

  .hint{
    color: #606266;
    display:block;
    margin: 8px;
    font-size: 14px;
  }
</style>
