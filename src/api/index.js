const VERSION = 'v1.0.2'

const USER_LOGIN = `/api/${VERSION}/user/login`
const USER_PERMISSION = `/api/${VERSION}/user/permission/`
const USER_LOGOUT = `/api/${VERSION}/user/logout`
const USER_PUBKEY = `/api/${VERSION}/user/pubkey`
const USER_REFRESH_TOKEN = `/api/${VERSION}/user/refresh_token`

const BELL_LOG = `/api/${VERSION}/userconfig/actionlog/`

const DASHBOARD_STATISTICS = `/api/${VERSION}/dashboard/statistics`
const DASHBOARD_TREND = `/api/${VERSION}/dashboard/event-trend`

const EVENTS_LIST = `/api/${VERSION}/event/events/`
const EVENTS_ID = `/api/${VERSION}/event/events/`
const EVENTS_COUNT = `/api/${VERSION}/event/events/count`
const EVENTS_RELATED = `/api/${VERSION}/event/events/relation`
const EVENT_ACTION = `/api/${VERSION}/playbook/menu/action/`
const EVENT_ACTION_APPS = `/api/${VERSION}/playbook/menu/app/`
const EVENT_RUN_ACTION = `/api/${VERSION}/playbook/action/`

const EVENT_PLAYBOOK_IO = `/api/${VERSION}/event/pio-detail/`

const EVENT_PERIODIC_TASK = `/api/${VERSION}/event/periodictask/status/`
const EVENT_PERIODIC_TASKS = `/api/${VERSION}/event/periodictasks/`

const PLAYBOOK_LIST = `/api/${VERSION}/playbook/playbooks/`
const PLAYBOOK_RUN_TASK = `/api/${VERSION}/playbook/active/`
const PLAYBOOK_DETAIL = `/api/${VERSION}/playbook/playbooks/`
const PLAYBOOK_DELETE = `/api/${VERSION}/playbook/playbooks/`
const PLAYBOOK_RUN_PLAYBOOK = `/api/${VERSION}/playbook/switcher/`

const CONFIG_USER_INFO = `/api/${VERSION}/userconfig/basic/information/`
const CONFIG_USER_ONLINE = `/api/${VERSION}/userconfig/basic/online/`
const CONFIG_USER_PASSWORD = `/api/${VERSION}/userconfig/password/`
const CONFIG_USER_LIST = `/api/${VERSION}/userconfig/users/`
const CONFIG_USER_AD = `/api/${VERSION}/userconfig/ldap/search/`
const CONFIG_USER_OPERATION = `/api/${VERSION}/userconfig/users/`
const CONFIG_USER_ROLE = `/api/${VERSION}/userconfig/role/`
const CONFIG_USER_FORBID = `/api/${VERSION}/userconfig/users/active/`
const CONFIG_USER_PERMISSON = `/api/${VERSION}/userconfig/permission/`
const CONFIG_USER_ACTIONLOG = `/api/${VERSION}/userconfig/log/action/`

const CONFIG_USER_LOGINLOG = `/api/${VERSION}/userconfig/log/login/`
const CONFIG_USER_LADP = `/api/${VERSION}/userconfig/ldap/settings`

const CONFIG_APP_PLUGINS = `/api/${VERSION}/appconfig/plugins/`
const CONFIG_APP_UPDATE = `/api/${VERSION}/appconfig/plugins/update/`
const CONFIG_APP_TEST_PLUGINS = `/api/${VERSION}/appconfig/plugins/test/`
const CONFIG_APP_UPLOAD = `/api/${VERSION}/appconfig/plugins/upload/`
const CONFIG_APP_DOWNLOAD = `/api/${VERSION}/appconfig/plugins/download/`

const CONFIG_DATA_WARNRULES = `/api/${VERSION}/dataconfig/rules/`
const CONFIG_DATA_CEF = `/api/${VERSION}/dataconfig/cefmapping/`
const CONFIG_DATA_CEF_FIELD = `/api/${VERSION}/dataconfig/cefmessage/`

const CONFIG_DATA_CEF_INDEX = `/api/${VERSION}/dataconfig/index`
const CONFIG_DATA_ARTIFACTS = `/api/${VERSION}/dataconfig/artifacts/`

const CONFIG_LOG_INDICES = `/api/${VERSION}/dataconfig/logconfig/indices`
const CONFIG_LOG_TIMEFIELD = `/api/${VERSION}/dataconfig/logconfig/datefield`
const CONFIG_LOG_INDEX = `/api/${VERSION}/dataconfig/logconfig/index/`

export default {
  VERSION,
  USER_LOGIN,
  USER_PERMISSION,
  USER_LOGOUT,
  USER_PUBKEY,
  USER_REFRESH_TOKEN,

  BELL_LOG,

  DASHBOARD_STATISTICS,
  DASHBOARD_TREND,

  EVENTS_COUNT,
  EVENTS_LIST,
  EVENTS_ID,
  EVENTS_RELATED,
  EVENT_ACTION,
  EVENT_ACTION_APPS,
  EVENT_RUN_ACTION,

  EVENT_PLAYBOOK_IO,

  EVENT_PERIODIC_TASK,
  EVENT_PERIODIC_TASKS,

  PLAYBOOK_LIST,
  PLAYBOOK_RUN_TASK,
  PLAYBOOK_DETAIL,
  PLAYBOOK_DELETE,
  PLAYBOOK_RUN_PLAYBOOK,

  CONFIG_APP_PLUGINS,
  CONFIG_APP_UPDATE,
  CONFIG_APP_TEST_PLUGINS,
  CONFIG_APP_UPLOAD,
  CONFIG_APP_DOWNLOAD,

  CONFIG_USER_INFO,
  CONFIG_USER_ONLINE,
  CONFIG_USER_PASSWORD,
  CONFIG_USER_LIST,
  CONFIG_USER_AD,
  CONFIG_USER_OPERATION,
  CONFIG_USER_ROLE,
  CONFIG_USER_FORBID,
  CONFIG_USER_PERMISSON,
  CONFIG_USER_ACTIONLOG,
  CONFIG_USER_LOGINLOG,
  CONFIG_USER_LADP,

  CONFIG_DATA_CEF,
  CONFIG_DATA_CEF_FIELD,
  CONFIG_DATA_CEF_INDEX,
  CONFIG_DATA_WARNRULES,
  CONFIG_DATA_ARTIFACTS,

  CONFIG_LOG_INDICES,
  CONFIG_LOG_TIMEFIELD,
  CONFIG_LOG_INDEX,
}
