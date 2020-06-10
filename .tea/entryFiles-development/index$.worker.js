if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


var AFAppX = self.AFAppX;
self.getCurrentPages = AFAppX.getCurrentPages;
self.getApp = AFAppX.getApp;
self.Page = AFAppX.Page;
self.App = AFAppX.App;
self.my = AFAppX.bridge || AFAppX.abridge;
self.abridge = self.my;
self.Component = AFAppX.WorkerComponent || function(){};
self.$global = AFAppX.$global;


function success() {
require('../../app');
require('../../node_modules/mini-antui/es/badge/index');
require('../../node_modules/mini-antui/es/tabs/index');
require('../../node_modules/mini-antui/es/tabs/tab-content/index');
require('../../node_modules/mini-antui/es/modal/index');
require('../../node_modules/mini-antui/es/am-checkbox/index');
require('../../components/count-down/index');
require('../../node_modules/mini-antui/es/input-item/index');
require('../../node_modules/mini-antui/es/list/index');
require('../../node_modules/mini-antui/es/list/list-item/index');
require('../../node_modules/mini-antui/es/picker-item/index');
require('../../node_modules/mini-antui/es/notice/index');
require('../../pages/index/index');
require('../../pages/diary/diary');
require('../../pages/mine/mine');
require('../../pages/calendar/calendar');
require('../../pages/schedule/schedule');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}