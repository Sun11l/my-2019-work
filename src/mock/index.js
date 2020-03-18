const Mock = require('mockjs')
import API from '@/api/index'

Mock.mock(API.USER_LOGIN, 'post', require('./json/userInfo'));
Mock.mock(API.USER_PUBKEY, 'get', require('./json/userInfo'));
Mock.mock(API.CONFIG_USER_INFO, 'get', require('./json/userInfo'));
Mock.mock(API.USER_PERMISSION, 'get', require('./json/userInfo'));
// Mock.mock(API.USER_PERMISSION, 'get', require('./json/userInfo'));
// CONFIG_USER_INFO CONFIG_USER_PERMISSON
// Mock.mock('/user/userInfo', 'get', require('./json/userInfo'));