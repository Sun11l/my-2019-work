const state = {
  menuData: [
    {
      path: '/login',
      hidden: true
    },
    {
      path: '/401',
      hidden: true
    },
    {
      path: '/404',
      hidden: true
    },
    {
      path: '/',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: '仪表盘', icon: 'dashboard', affix: true }
        }
      ]
    },
    {
      path: '/event',
      children: [
        {
          path: 'index',
          name: 'Event',
          meta: { title: '事件', icon: 'event' }
        }
      ]
    },
    {
      path: '/playbooks',
      children: [
        {
          path: 'index',
          name: 'Playbooks',
          meta: { title: '工作流', icon: 'playbooks' }
        }
      ]
    },
    {
      path: '/config',
      redirect: '/config/app',
      alwaysShow: true,
      name: 'Config',
      meta: {
        title: '设置',
        icon: 'setting',
      },
      children: [
        {
          path: 'app',
          name: 'AppConfig',
          meta: {
            title: '应用设置',
          }
        },
        {
          path: 'user',
          name: 'UserConfig',
          meta: {
            title: '用户设置',
          }
        },
        {
          path: 'data',
          name: 'DataConfig',
          meta: {
            title: '数据配置',
          }
        },
        {
          path: 'logs',
          name: 'LogsConfig',
          meta: {
            title: '日志配置',
          }
        }
      ]
    },
  ]
}

export default {
  namespaced: true,
  state
}
