var http = require('../../lib/http.js')
Page({
  data: {
    diaryArr:[],
    memoArr:[],
    timeArr:[],
    diaryItem:'',
    isShowTail:false,
    isDelete:false,
    deleteItem:{},
    showLoading:false,
    myFormat1: ['天', '时', '分', '秒'],
    memoCount:0,
    stateList:[
      '../../images/cool.png',
      '../../images/flushed.png',
      '../../images/sad.png',
      '../../images/angry.png'
    ],
    isClear:false,
    tabs: [
      {
        title: '日记本',
        // badgeType: 'dot',
      },
      {
        title: '备忘录'
      },
      {
        title: '纪念日',
        
      },
    ],
    activeTab: 0,
    userId:''
  },
  onLoad(query) {
    // 页面加载
    var self = this
    // my.getAuthCode({
    //         scopes: 'auth_user',
    //         success: (res) => {
    //           my.getAuthUserInfo({
    //             success: (userInfo) => {
    //               let datas = {
    //                 authCode: res.authCode,
    //                 avatar: userInfo.avatar,
    //                 nickName: userInfo.nickName,
    //                 // userId:res.data.userId
    //               }
    //               self.linkLogin(datas)
    //             }
    //           });
    //         },
    //       });
    my.getStorage({
      key: 'userInfo',
      success: function(res) {
        if(res.data){
          self.setData({
            userId:res.data.userId
          })
          self.getDiary(res.data.userId)
        }else{
          my.getAuthCode({
            scopes: 'auth_user',
            success: (res) => {
              my.getAuthUserInfo({
                success: (userInfo) => {
                  let datas = {
                    authCode: res.authCode,
                    avatar: userInfo.avatar,
                    nickName: userInfo.nickName,
                    // userId:res.data.userId
                  }
                  self.linkLogin(datas)
                }
              });
            },
          });
        }
      },
      fail: function(res){

      }
    })
    
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },


  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handleTabChange({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handlePlusClick() {
    my.alert({
      content: 'plus clicked',
    });
  },
  linkLogin (datas) {
    var self = this
    my.request({
      url: http.roots + "saveOpenID",
      method: 'POST',
      header: {
          "Content-Type": "application/x-www-form-urlencoded"
      },
      data: datas,
      dataType: 'json',
      success: function(res) {
        if(res.data.sta == 1){
          let data2 = {
            ...datas,
            ...res.data.data
          }
          my.setStorage({
            key: 'userInfo',
            data: data2,
            success: function() {
              
            }
          });
          self.getDiary(res.data.data.userId)
          self.setData({
            userId:res.data.data.userId
          })
        }
      },
      fail: function(res) {
        console.log('失败')
      },
      complete: function(res) {
        
      }
    });
  },

  getDiary(userid){
    var self = this
    my.request({
      url: http.roots + "getDiary",
      method: 'POST',
      header: {
          "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        userId:userid
      },
      dataType: 'json',
      success: function(res) {
        self.setData({
          diaryArr:res.data.data.diary.reverse(),
          memoArr:res.data.data.memo.reverse(),
          timeArr:res.data.data.time.reverse(),
        })
        if(res.data.data.memoCount != 0){
          self.setData({
            ["tabs[1].badgeType"]:'text',
            ["tabs[1].badgeText"]:res.data.data.memoCount
          })
        }else{
          self.setData({
            ['tabs[1].badgeType']:'',
            ["tabs[1].badgeText"]:''
          })
        }
        if(res.data.data.timeCount != 0){
          self.setData({
            ['tabs[2].badgeType']:'dot'
          })
        }else{
          self.setData({
            ['tabs[2].badgeType']:''
          })
        }
      },
      fail: function(err) {
        console.log('失败')
        console.log(err)
      }
    });
  },

  newDiary:function(){
      my.navigateTo({
          url: '../diary/diary?idx='+ this.data.activeTab
      })
    },
    deletes:function(e){
      let t = e.currentTarget.dataset.item
      t.userId = this.data.userId
      t.types = this.data.activeTab
      this.setData({
        isDelete:true,
        deleteItem: t,
      })
    },
    onModalClick(){
      
      this.data.timeArr.forEach(val => {
        if(val._id == this.data.deleteItem._id){
          val.isClear = true
        }
      })
      this.setData({
        showLoading:true
      })
      var self = this
      
      my.request({
      url: http.roots + 'deleteDiary',
      method: 'POST',
      header: {
          "Content-Type": "application/x-www-form-urlencoded"
      },
      data: self.data.deleteItem,
      dataType: 'json',
      success: function(res) {
        if(res.data.sta == 1){
          self.setData({
            isDelete:false,
            showLoading:false
          })
          my.showToast({
            type: 'success',
            content: '删除成功',
            duration: 2000
          });
        }else{
          my.showToast({
            type: 'success',
            content: '删除失败',
            duration: 2000
          });
        }
        getCurrentPages()[getCurrentPages().length - 1].onLoad()
        // self.setData({
        //   diaryArr:res.data.data.diary,
        //   memoArr:res.data.data.memo,
        //   time:res.data.data.time
        // })
      },
      fail: function(res) {
        console.log('失败')
      }
    });

    },
    onModalClose(){
      this.setData({
        isDelete:false
      })
    },
    onDetailClose(){
      this.setData({
        isShowTail:false
      })
    },
    modify(e){
      let idx = this.data.activeTab
      my.navigateTo({
          url: '../diary/diary?idx='+idx+'&data=' + JSON.stringify(e.currentTarget.dataset.item)
      })
    },
    stateChange(e){
      var self = this
      let t = e.target.dataset.item
      t.state = e.detail.value
      t.userId = this.data.userId
      my.request({
        url: http.roots + 'changeState',
        method: 'POST',
        data: t,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if(res.data.sta == 1){
            my.request({
              url: http.roots + 'getDiary',
              method: 'POST',
              data: {
                userId: self.data.userId
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                if(res.data.sta == 1){
                  self.setData({
                    diaryArr:res.data.data.diary.reverse(),
                    memoArr:res.data.data.memo.reverse(),
                    timeArr:res.data.data.time.reverse(),
                    memoCount: res.data.data.memoCount,
                    timeCount: res.data.data.memoCount,
                  })

                  if(res.data.data.memoCount != 0){
                    self.setData({
                      ["tabs[1].badgeType"]:'text',
                      ["tabs[1].badgeText"]:res.data.data.memoCount
                    })
                  }else{
                    self.setData({
                      ['tabs[1].badgeType']:'',
                      ["tabs[1].badgeText"]:''
                    })
                  }
                  if(res.data.data.timeCount != 0){
                    self.setData({
                      ['tabs[2].badgeType']:'dot'
                    })
                  }else{
                    self.setData({
                      ['tabs[2].badgeType']:''
                    })
                  }
                }
              }
            })
          }
        }
      })
    },
    showTail(e){
      this.setData({
        diaryItem:e.currentTarget.dataset.item,
        isShowTail:true,
      })
    }
});
