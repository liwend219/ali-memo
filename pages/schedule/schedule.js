import ajax from '../../lib/fetch'
Page({
  data: {
    tiptxt:'加载中😲',
    userid:'',
    activeTab:0,
    memoArr:[],
    timeArr:[],
    isDelete:false,
    deleteItem:{},
    showLoading:false,
    tabs:[
      {
        title: '备忘录'
      },
      {
        title: '纪念日',
      }
    ]
  },
  onLoad(e) {
    if(e && e.activeTab){
      this.setData({
        activeTab:e.activeTab
      })
    }
    my.getStorage({
      key: 'userInfo', // 缓存数据的key
      success: (res) => {
        if(res.data){
          this.setData({
            userId:res.data.userId
          })
          this.getDiary(res.data.userId)
        }
      },
    });
  },
  onPullDownRefresh() {
    // 页面被下拉
    this.getDiary(this.data.userId)
  },
  handleTabClick (){

  },
  handleTabChange (){


  },
  handlePlusClick (){

  },
  modify(e){
    let idx = this.data.activeTab
    my.navigateTo({
        url: '../diary/diary?idx=1'+'&data=' + JSON.stringify(e.currentTarget.dataset.item)
    })
  },
  getDiary(userid){
    ajax('getDiary',{userId:userid},(res) => {
      my.stopPullDownRefresh()
      this.setData({
        tiptxt:'没有更多啦'
      })
      this.setData({
        // diaryArr:res.data.diary.reverse(),
        memoArr:res.data.memo.reverse(),
        timeArr:res.data.time.reverse(),
      })
      if(res.data.memoCount != 0){
        this.setData({
          ["tabs[0].badgeType"]:'text',
          ["tabs[0].badgeText"]:res.data.memoCount
        })
      }else{
        this.setData({
          ['tabs[0].badgeType']:'',
          ["tabs[0].badgeText"]:''
        })
      }
      if(res.data.timeCount != 0){
        this.setData({
          ['tabs[1].badgeType']:'dot'
        })
      }else{
        this.setData({
          ['tabs[1].badgeType']:''
        })
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
  deletes:function(e){
    let t = e.currentTarget.dataset.item
    t.userId = this.data.userId
    // t.types = this.data.activeTab
    if(this.data.activeTab == 0){
      t.types = 'memo'
    }else{
      t.types = 'time'
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
          type: 'success',
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
  stateChange(e){
    let t = e.target.dataset.item
    t.state = e.detail.value
    t.userId = this.data.userId
    ajax('changeState',t,(res => {
      if(res.sta == 1){
        ajax('getDiary',{userId:this.data.userId},(res) => {
          if(res.sta == 1){
            this.setData({
              diaryArr:res.data.diary.reverse(),
              memoArr:res.data.memo.reverse(),
              timeArr:res.data.time.reverse(),
              memoCount: res.data.memoCount,
              timeCount: res.data.memoCount,
              show:res.show
            })

            if(res.data.memoCount != 0){
              this.setData({
                ["tabs[0].badgeType"]:'text',
                ["tabs[0].badgeText"]:res.data.memoCount
              })
            }else{
              this.setData({
                ['tabs[0].badgeType']:'',
                ["tabs[0].badgeText"]:''
              })
            }
            if(res.data.timeCount != 0){
              this.setData({
                ['tabs[1].badgeType']:'dot'
              })
            }else{
              this.setData({
                ['tabs[1].badgeType']:''
              })
            }
          }
        })
      }
    }))
  },
  newDiary:function(){
    let i ;
    if(this.data.activeTab == 0){
      i = 1
    }else{
      i = 2
    }
    my.navigateTo({
        url: '../diary/diary?idx='+ i
    })
  },
});
