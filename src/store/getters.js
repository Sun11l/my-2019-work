const getters = {
  sidebar: state => state.app.sidebar,
  name: state => state.user.name,
  expireTime: state => state.user.expireTime,
  token: state => state.user.token,
  permission_routes: state => state.permisson.routes,
  menu: state => state.menu.menuData,
  roles: state => state.config.roles,
  addAppDialog: state => state.bus.addAppDialog,
  addEventDialog: state => state.bus.addEventDialog,
  permissionlist: state => state.config.permissionlist,
  playbooknodename: state => state.playbooknode.nodename,
  playbooknode: state => state.playbooknode.node,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  userPermission: state => state.user.userPermission
}
export default getters
