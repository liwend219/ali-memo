import ajax from '../../lib/fetch'
var util = require('../../lib/time.js')
Page({
  data: {
    info:{
        txt:''
    },
    tmpData:{},
    diaryArr:[],
    memoArr:[],
    deleteHole:false,
    timeArr:[],
    showComment:false,
    diaryItem:'',
    isShowTail:false,
    versionInfo:{},
    showNotice:false,
    isDelete:false,
    deleteItem:{},
    showLoading:false,
    myFormat1: ['天', '时', '分', '秒'],
    memoCount:0,
    holeDType:1,
    holeList:[],
    show:false,
    tiptxt:'加载中😲',
    stateList:[
      '../../images/cool.png',
      '../../images/flushed.png',
      '../../images/sad.png',
      '../../images/angry.png'
    ],
    isClear:false,
    tabs: [
      {
        title: '日记'
      },
      {
        title: '树洞'
      }
    ],
    activeTab: 0,
    userId:'',
    nickName:'',
    avatar:'',
    bgImgUrl:'',
  },
  onLoad(query) {
    if(query && query.activeTab){
      this.setData({
        activeTab:query.activeTab
      })
    }
    // this.getNotice()
    
    // 页面加载
    my.getStorage({
      key: 'userInfo',
      success:(res) => {
        if(res.data){
          this.setData({
            userId:res.data.userId,
            nickName:res.data.nickName,
            avatar:res.data.avatar
          })
          
          this.getDiary(res.data.userId)
          this.getHole(res.data.userId)
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
                  this.linkLogin(datas)
                }
              });
            },
          });
        }
      }
    })
    
  },
  onPullDownRefresh() {
    // 页面被下拉
    if(this.data.activeTab == 0){
      this.getDiary(this.data.userId)
    }else{
      this.getHole(this.data.userId)
    }
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '叮咚心情日记',
      desc: '一款记录你心情和写日记的唯美小程序',
      path: 'pages/index/index',
      bgImgUrl:this.data.bgImgUrl
    };
    
  },
  down(){
    this.data.ctx.toTempFilePath({
      success(res1){
        my.saveImage({
          url: res1.apFilePath,
          showActionSheet: true,
          success: () => {
            my.alert({
              title: '保存成功',
            });
          },
        });
      }
    })
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
    ajax('saveOpenID',datas,(res) => {
      if(res){
        if(res.sta == 1){
          let data2 = {
            ...datas,
            ...res.data
          }
          my.setStorage({
            key: 'userInfo',
            data: data2,
            success: () => {
              
            }
          });
          this.setData({
            userId:res.data.userId
          })
          this.getDiary(res.data.userId)
          this.getHole(res.data.userId)
        }
      }
    })
  },

  getDiary(userid){
    ajax('getDiary',{userId:userid},(res) => {
      my.stopPullDownRefresh()
      this.setData({
        tiptxt:'没有更多啦'
      })
      if(res.sta == 1){
        this.setData({
          diaryArr:res.data.diary.reverse(),
          memoArr:res.data.memo.reverse(),
          timeArr:res.data.time.reverse(),
          show:res.show
        })
      }
    })
  },
  getNotice(){
    ajax('notice',{},(res) => {
      this.setData({
        "versionInfo":res.data
      })
      if(res && res.sta){
        my.getStorage({
          key:'version',
          success:(v) => {
            if(v.data){              
              if(v.data.key != res.data.key){
                this.setData({
                  "showNotice":true
                })
              }
            }else{
              this.setData({
                "showNotice":true
              })
            }
          }
        })
      }
      
    })
  },
  closeNotice (){
    my.setStorage({
      key: 'version',
      data: this.data.versionInfo,
      success: (res) => {
        this.setData({
          "showNotice":false
        })
      }
    });
  },
  newDiary:function(){
      let i ;
      if(this.data.activeTab == 0){
        i = 0
      }else{
        i = 4
      }
      my.navigateTo({
          url: '../diary/diary?idx='+ i
      })
    },
    deletes:function(e){
      let t = e.currentTarget.dataset.item
      t.userId = this.data.userId
      t.types = this.data.activeTab
      if(this.data.activeTab == 0){
        t.types = 'diary'
      }
      this.setData({
        isDelete:true,
        deleteItem: t,
      })
    },
    onModalClick(){
      if(this.data.showLoading){
        return
      }
      this.data.timeArr.forEach(val => {
        if(val._id == this.data.deleteItem._id){
          val.isClear = true
        }
      })
      
      this.setData({
        showLoading:true,
        isDelete:false,
        timeArr:this.data.timeArr
      })
      ajax('deleteDiary',this.data.deleteItem,(res) => {
        this.setData({
          isDelete:false,
          showLoading:false
        })
        if(res.sta == 1){
            my.showToast({
              type: 'success',
              content: '删除成功',
              duration: 2000
            });
          }else{
            my.showToast({
              type: 'error',
              content: '删除失败',
              duration: 2000
            });
          }
          getCurrentPages()[getCurrentPages().length - 1].onLoad()
      })
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
          url: '../diary/diary?idx=0'+'&data=' + JSON.stringify(e.currentTarget.dataset.item)
      })
    },
    showTail(e){
      this.setData({
        diaryItem:e.currentTarget.dataset.item,
        isShowTail:true,
      })
    },
    getHole(userId){
      ajax('getHole',{userId:userId},(res) => {
        my.stopPullDownRefresh()
        if(res.sta == 1){
          res.data.forEach((val) => {
            val.time = util.fromDate(val.timer)
          })
          this.setData({
            holeList:res.data
          })
        }
      })
    },
    onModalHoleClick(){
      if(this.data.showLoading){
        return
      }
      
      this.setData({
        ["tmpData.txt"]:this.data.info.txt
      })
      if(!this.data.info.txt){
        my.showToast({
          content: '评论不可为空',
          duration: 2000
        });
        return 
      }
      this.setData({
        showLoading:true,
      })
      ajax('publish/comment',this.data.tmpData,(res) => {
        if(res.sta == 1){
          this.setData({
            showLoading:false,
            showComment:false,
            ["info.txt"]:''
          })
          this.getHole(this.data.userId)
        }
      })
    },
    onModalHoleClose(){
        this.setData({
            showComment:false
        }) 
    },
    onInputTitle(e){
      this.setData({
        ["info.txt"]:e.detail.value
      })
    },
    star(item){
      let data = item.target.dataset.item

      ajax('star',{
        userId:this.data.userId,
        pid:data.pid
      },(res) => {
        if(res.sta == 1){
          this.getHole(this.data.userId)
        }else{
          my.showToast({
            type: 'error',
            content: res.msg,
            duration: 2000
          });
        }
      })
    },
    onClear(){
      this.setData({
        ['info.txt']:''
      })
    },
    newHole(){
      my.navigateTo({
          url: '../diary/diary?idx=4'
      })
    },
    showCommentBox(item){
        let data = item.target.dataset.item
        let tmp = {
            userId:this.data.userId,
            nickName:this.data.nickName,
            avatar:this.data.avatar,
            pid:data.pid,
            txt:this.data.info.txt
        }
        
        this.setData({
            showComment:true,
            tmpData:tmp
        })  
    },
    deleteHoleClick(){
      if(this.data.showLoading){
        return
      }
      if(!this.data.info.txt){
        my.showToast({
          content: '输入口令',
          duration: 2000
        });
        return
      }
      let obj = {
        _id:this.data.deleteItem._id,
        pid:this.data.deleteItem.pid,
        key:this.data.info.txt,
        userId:this.data.userId,
        nickName:this.data.nickName
      }
      this.setData({
        showLoading:true
      })
      if(this.data.holeDType == 1){
        ajax('deleteHole',obj,(res) => {
          if(res.sta == 1){
            this.setData({
              deleteHole:false,
              ["info.txt"]:'',
              showLoading:false
            })
            my.showToast({
              type: 'success',
              content: '删除成功',
              duration: 2000
            });
          }else{
            this.setData({
              deleteHole:false,
              ["info.txt"]:'',
              showLoading:false
            })
            my.showToast({
              type: 'error',
              content: res.msg,
              duration: 2000
            });
          }
          getCurrentPages()[getCurrentPages().length - 1].onLoad()
        })
      }else{
        ajax('deleteComment',obj,(res) => {
          if(res.sta == 1){
            this.setData({
              deleteHole:false,
              ["info.txt"]:'',
              showLoading:false
            })
            my.showToast({
              type: 'success',
              content: '删除成功',
              duration: 2000
            });
          }else{
            this.setData({
              deleteHole:false,
              ["info.txt"]:'',
              showLoading:false
            })
            my.showToast({
              type: 'error',
              content: res.msg,
              duration: 2000
            });
          }
          getCurrentPages()[getCurrentPages().length - 1].onLoad()
        })
      }
    },
    deleteHoleClose(){
      this.setData({
        deleteHole:false,
        deleteItem: {},
      })
    },
    deleteH(e){
      let t = e.currentTarget.dataset.item
      t.userId = this.data.userId
      t.types = this.data.activeTab
      if(e.currentTarget.dataset.pid){
        t.pid = e.currentTarget.dataset.pid
      }
      this.setData({
        deleteHole:true,
        holeDType:e.currentTarget.dataset.type,
        deleteItem: t,
      })
    },
    onModalClick23(){

    },
    onModalClose23(){

    }
});
