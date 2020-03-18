import moment from 'moment'
const vfilters = {
  filterSeverityColor (severity) {
    switch (severity.toLowerCase()) {
      case 'high':
        return '高'
      case 'medium':
        return '中'
      case 'low':
        return '低'
      default:
        return '未知'
    }
  },
  filterSeverity (severity) {
    if (!severity) return false
    switch (severity.toLowerCase()) {
      case 'high':
        return '高'
      case 'medium':
        return '中'
      case 'low':
        return '低'
      default:
        return '未知'
    }
  },
  filterStatus (status) {
    switch (parseInt(status)) {
      case 0:
        return '运行'
      case 1:
        return '完成'
      case 2:
        return '等待'
      case 3:
        return '失败'
    }
  },
  filterEventStatus (status) {
    switch (parseInt(status)) {
      case 0:
        return '00000'
      case 1:
        return '11111'
      case 2:
        return '22222'
      case 3:
        return '33333'
      default:
        return '未知'
    }
  },
  formatTime (time, format) {
    if (!time) {
      return '-'
    }
    format = format || 'YYYY-MM-DD HH:mm:ss'
    return moment(time).format(format)
  },
  describeStatus (status) {
    if (!status) return false
    switch (status.toLowerCase()) {
      case 'new':
        return '“New”表示工作流已创建成功'
      case 'in-progress':
        return '“In-Progress”表示工作流正在正常运行'
      case 'closed':
        return '“Closed”表示工作流已正常运行结束'
    }
  },
  playbookStatus (status) {
    switch (status) {
      case 0:
        return '未激活'
      case 1:
        return '已激活'
      case 2:
        return '任务派发中'
      default:
        return '未知'
    }
  },
  cefDesc (field) {
    let data = {
      '@timestamp': '同步时间',
      '@version': '版本',
      AlarmID: '告警ID',
      AlterType: '更改类型',
      ApplicationProtocol: '应用协议',
      AttackClassification: '攻击分类',
      AttackCredibility: '攻击信誉',
      AttackDirection: '攻击方向',
      AttackId: '攻击ID',
      AttackLevel: '攻击等级',
      AttackName: '攻击名',
      AttackNumber: '攻击次数',
      AttackSubclassification: '攻击分类',
      AttackTime: '攻击时间',
      DestIp: '目标IP地址',
      DestPort: '目标端口',
      DestSystem: '目标系统',
      DetectionMechanism: '检测机制',
      DeviceAlArmId: '设备号',
      DeviceName: '设备名称',
      Domain: '域名',
      HostName: '主机名称',
      Interface: '接口',
      LayerData: '传输数据',
      NetworkProtocol: '网络协议',
      ProcessingResult: '处理结果',
      SrcIp: '源IP地址',
      SrcName: '源系统名称',
      SrcOs: '源系统',
      SrcPort: '源端口',
      facility: '设施',
      facility_label: '设施标签',
      host: '主机IP地址',
      message: '信息',
      priority: '优先级',
      severity: '危险等级',
      severity_label: '告警标签',
      tags: '标签',
      description: '描述',
      dest_ip: '目标IP',
      dest_port: '目标端口',
      gateway_name: '网关名称',
      server_group_name: '服务器分组',
      severityInfo: '危险等级描述',
      source_ip: '源IP地址',
      src_port: '源端口',
      violation_id: '违规编号',
      violation_type: '违规类型',
      warn_type: '告警分类',
      accessrequested: '访问要求',
      agentguid: '代理guid',
      agentplatform: '代理平台',
      agentversion: '代理版本',
      amcorecontentversion: '恶意软件版本',
      analyzer: '分析器',
      analyzercontentcreationdate: '分析器连接创建日期',
      analyzercontentversion: '分析器连接版本',
      analyzerdatversion: '分析器数据转换',
      analyzerdetectionmethod: '分析器检测方法',
      analyzerengineversion: '分析器引擎版本',
      analyzergtiquery: '分析器GTI',
      analyzerhostname: '分析器主机名',
      analyzeripv4: '分析器IPV4',
      analyzeripv6: '分析器IPV6',
      analyzermac: '分析器mac地址',
      analyzername: '分析器名称',
      analyzerreginfo: '分析器信息',
      analyzerruleid: '分析规则id',
      analyzerrulename: '分析规则名称',
      analyzertechnologyversion: '分析技术版本',
      analyzerversion: '分析器版本',
      apiname: '接口名称',
      attackvectortype: '攻击向量类型',
      autoguid: '默认GUID',
      autoid: '默认ID',
      bladename: '刀片服务器名称',
      certcompany: '证书公司创建者',
      certname: '证书名',
      certpksha1hash: '证书公钥sha1哈希值',
      certsha1hash: '证书sha1哈希值',
      cleanable: '可清洗',
      computername: '计算机名称',
      contentversion: '内容版本',
      cpuserialnum: 'CPU序列号',
      cpuspeed: 'CPU速率',
      cputype: 'CPU类型',
      detectedutc: '检测时间',
      detectiontype: '检测类型',
      direction: '方向',
      domainname: '域名',
      durationbeforedetection: '检测持续时间',
      eventautoid: '事件ID',
      eventid: '事件ID',
      eventtimelocal: '事件本地时间',
      filecompany: '文件所属公司',
      filemd5hash: '文件MD5哈希值',
      filesha1hash: '文件sha1哈希值',
      firstactionstatus: '首次威胁状态',
      firstattemptedaction: '首次行动',
      flags: '标志',
      freediskspace: '剩余磁盘空间',
      freememory: '剩余内存',
      ipaddress: 'IP地址',
      iphostname: 'IP主机名',
      ipv4x: 'ipv4x地址',
      ipxaddress: 'ipx地址',
      isportable: '可携带',
      lastupdate: '最后更新时间',
      ldaporgunit: 'LDAP配置',
      location: '位置',
      managementtype: '管理类型',
      name: '名称',
      naturallangdescription: '自然语言描述',
      netaddress: '网络地址',
      nodecreateddate: '节点创建时间',
      nodename: '节点名称',
      numofcpu: 'CPU名称',
      objecttype: '对象类型',
      osbitmode: '系统位模式',
      osbuildnum: '系统编译号',
      osoemid: '系统oemID',
      osplatform: '系统平台',
      osservicepackver: '系统补丁版本',
      ostype: '系统类型',
      osversion: '系统版本',
      productversion: '产品版本',
      promptcomments: '及时评论',
      receivedutc: '接收到事件时间',
      reputation: '事件可信度',
      rpsensitivitylevel: '敏感等级',
      ruleid: '规则编号',
      rulesname: '规则名称',
      secondactionstatus: '第二次操作状态',
      secondattemptedaction: '第二次尝试操作',
      securityposture: '安全趋势',
      serverid: '服务ID',
      serverkeyhash: '服务器秘钥哈希值',
      sourceaccesstime: '访问时间',
      sourcecreatetime: '创建时间',
      sourcedescription: '威胁源描述',
      sourcedevicedisplayname: '源设备显示名称',
      sourcedevicepid: '源设备PID',
      sourcedeviceserialnumber: '源设备连载号',
      sourcedevicevid: '源设备号',
      sourcefilepath: '源文件路径',
      sourcefilesize: '源文件大小',
      sourcehash: '源hash值',
      sourcehostname: '源主机名',
      sourceipv4: '源IPV4地址',
      sourceipv6: '源IPV6地址',
      sourcemac: '源mca地址',
      sourcemodifytime: '源修改时间',
      sourceparentprocesshash: '源父级进程hash',
      sourceparentprocessname: '源父级进程名',
      sourceparentprocesssigned: '源父级进程标签',
      sourceparentprocesssigner: '源父级进程',
      sourceport: '源端口',
      sourceprocesshash: '源进程hash',
      sourceprocessname: '源进程名',
      sourceprocesssigned: '源进程签名',
      sourceprocesssigner: '源进程签名者',
      sourcesharename: '源分享名',
      sourcesigned: '源标签',
      sourcesigner: '源签名者',
      sourceurl: '源URL',
      sourceurlratingcode: '威胁源等级码',
      sourceurlwebcategory: '威胁源URL类别',
      sourceusername: '源用户名',
      subnetmask: '子网掩码',
      systemdescription: '系统描述',
      sysvolfreespace: '系统卷剩余空间',
      targetaccesstime: '目标访问时间',
      targetcreatetime: '威胁产生时间',
      targetdescription: '威胁目标描述',
      targetdevicedisplayname: '目标设备显示名称',
      targetdevicepid: '目标设备PID',
      targetdeviceserialnumber: '威胁目标设备号',
      targetdevicevid: '威胁目标设备ID',
      targetfilename: '威胁目标文件名',
      targetfilesize: '威胁目标文件大小',
      targethash: '威胁目标hash值',
      targethostname: '威胁目标主机名',
      targetipv4: '威胁目标IPV4地址',
      targetipv6: '威胁目标IPV6地址',
      targetmac: '威胁目标mac地址',
      targetmodifytime: '威胁目标修改时间',
      targetname: '威胁目标名',
      targetparentprocesshash: '威胁目标父进程hash值',
      targetparentprocessname: '威胁目标进程名称',
      targetparentprocesssigned: '威胁目标父进程标签',
      targetparentprocesssigner: '威胁目标父进程签署者',
      targetpath: '威胁目标路径',
      targetport: '威胁目标端口',
      targetprocessname: '威胁目标进程名',
      targetprotocol: '威胁目标网络协议',
      targetsharename: '目标分享名',
      targetsigned: '目标标签',
      targetsigner: '目标签名者',
      targeturl: '威胁目标URL',
      targetusername: '威胁目标用户名',
      taskname: '任务名称',
      tenantid: '租户id',
      thetimestamp: '检测到威胁事件',
      threatactiontaken: '威胁采取行动',
      threatcategory: '威胁类别',
      threatdetectedoncreation: '威胁检测机制',
      threateventid: '威胁事件ID',
      threathandled: '威胁处理',
      threatimpact: '威胁影响',
      threatname: '威胁名称',
      threatseverity: '威胁等级',
      threattype: '威胁类型',
      timezone: '时区',
      topic: '主题',
      totaldiskspace: '总磁盘空间',
      totalphysicalmemory: '物理内存',
      type: '类型',
      username: '用户名',
      vdi: 'VDI'
    }
    return data[field]
  }
}

export default vfilters
