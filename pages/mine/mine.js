var http = require('../../lib/http.js')
Page({
  data: {
    userId:'',
    imgUrl:'',
    nickName:'',
    selectVal:0,
    remind:true,
    remindLen:3,
    opinion:'',
    showOpinion:false,
    showLoading:false,
    objectArray: [
      {
        id: 1,
        name: '1天',
      },
      {
        id: 3,
        name: '3天',
      },
      {
        id: 5,
        name: '5天',
      },
      {
        id: 7,
        name: '7天',
      },
    ],
  },
  onLoad() {
    var self = this
    my.getStorage({
      key: 'userInfo', // 缓存数据的key
      success: (res) => {
        self.setData({
          imgUrl:res.data.avatar,
          nickName:res.data.nickName,
          userId:res.data.userId,
        })
        self.getSet(res.data.userId)
      },
    });
  },
  dayChange(e){
    let len;
    if(e.detail && e.detail.value != null){
      this.setData({
        selectVal:e.detail.value
      })
      if(e.detail.value == 0){
        len = 1
      }else if(e.detail.value == 1){
        len = 3
      }else if(e.detail.value == 2){
        len = 5
      }else if(e.detail.value == 3){
        len = 7
      }else{
        len = 3
      }
      this.setRemind(len,this.data.remind)
    }
    
  },
  setRemind(len,val){
    my.request({
        url: http.roots + 'setSet',
        method: 'POST',
        data: {
            userId:this.data.userId,
            remindLen:len,
            remind:val
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
            if(res.data.sta == 1){
                // self.setData({
                //     ["setInfo.remindLen"]: res.data.data[0].remindLen,
                //     ["setInfo.remind"]: res.data.data[0].remind
                // })
            }
        }
    })
  },
  onInputContent(e){
    this.setData({
      opinion:e.detail.value
    })
  },
  onModalClose(){
    this.setData({
      showOpinion:false
    })
  },
  onModalClick(){
    var self = this
    this.setData({
      showLoading:true
    })
    my.request({
        url: http.roots + "opinion",
        method: 'POST',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          userId:self.data.userId,
          nickName:self.data.nickName,
          opinion:self.data.opinion
        },
        dataType: 'json',
        success: function(res) {
          self.setData({
              showLoading:false
          })
          my.showToast({
            content: res.data.msg,
            duration: 2000
          });
        }
      })
    this.setData({
      showOpinion:false
    })
  },
  showOpinionBox(){
    this.setData({
      showOpinion:true
    })
  },
  switchChange(e){
    this.setData({
      remind:e.detail.value
    })
    let len;
    if(this.data.selectVal == 0){
      len = 1
    }else if(this.data.selectVal == 1){
      len = 3
    }else if(this.data.selectVal == 2){
      len = 5
    }else if(this.data.selectVal == 3){
      len = 7
    }else{
      len = 3
    }
    this.setRemind(len,e.detail.value)
  },
  getSet(){
    var self = this
    my.request({
        url: http.roots + 'getSet',
        method: 'POST',
        data: {
            userId:this.data.userId
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if(res.data.sta == 1){
            let t = 0;
            if(res.data.data.remindLen == 1){
              t=0
            }else if(res.data.data.remindLen == 3){
              t=1
            }else if(res.data.data.remindLen == 5){
              t=2
            }else if(res.data.data.remindLen == 7){
              t=3
            }else{
              t=0
            }

            self.setData({
              selectVal:t,
              remind:res.data.data.remind
            })
          }
        }
    })
  }
});
