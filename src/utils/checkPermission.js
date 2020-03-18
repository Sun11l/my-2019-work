import store from '@/store'

export function checkPermission (module) {
  let userPermission = store.getters.userPermission
  module = module.toLowerCase()

  if (userPermission && userPermission.length > 0 && (userPermission instanceof Array !== true)) {
    userPermission = JSON.parse(userPermission)
  }
  // 如果是超管 提前return出去
  if (userPermission[0] === 'You are super user, have all permission.') return true

  let flag = false
  for (let ele of userPermission) {
    if (ele.module === module) {
      if (ele.read_only) {
        flag = false
      } else {
        flag = true
      }
    }
  }
  return flag
}

export function checkSuperUser () {
  // 主要作用于 ‘用户配置’ 部分：超管之外的账号不能访问‘修改密码’、‘权限管控’、‘XX日志’、等等部分
  let userPermission = store.getters.userPermission

  if (userPermission && userPermission.length > 0 && (userPermission instanceof Array !== true)) {
    userPermission = JSON.parse(userPermission)
  }
  if (userPermission[0] === 'You are super user, have all permission.') {
    return true // 超管账号
  } else {
    return false
  }
}
