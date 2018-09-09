import Vue from 'vue'
import Router from 'vue-router'
import contentDocument from '@/components/ContentDocument'
import documentList from '@/components/DocumentList'
import contentTask from '@/components/ContentTask'
import taskList from '@/components/TaskList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'contentDocument',
      component: contentDocument
    },{
      path: '/document',
      name: 'contentDocument',
      component: contentDocument
    },{
      path: '/document/:id',
      name: 'contentDocument',
      component: contentDocument
    },{
      path: '/documentList',
      name: 'documentList',
      component: documentList
    },{
      path: '/task',
      name: 'task',
      component: contentTask
    },{//动态路由
      path: '/task/:id',
      name: 'task',
      component: contentTask
    },{
      path: '/taskList',
      name: 'taskList',
      component: taskList
    }
    /*{
      path: '/beedo',
      name: 'contentDocument1',
      component: contentDocument,
      children: [
        {
          path: '/document',
          name: 'contentDocument2',
          component: contentDocument
        },
        {
          path: '/documentList',
          name: 'documentList',
          component: documentList
        },
        {
          path: '/task',
          name: 'task',
          component: contentTask
        }
      ]
    }*/
  ]
})
