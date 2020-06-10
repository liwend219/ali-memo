import ajax from '../../lib/fetch'
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
    my.getStorage({
      key: 'userInfo', // 缓存数据的key
      success: (res) => {
        this.setData({
          imgUrl:res.data.avatar,
          nickName:res.data.nickName,
          userId:res.data.userId,
        })
        this.getSet(res.data.userId)
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
    let data = {
        userId:this.data.userId,
        remindLen:len,
        remind:val
    }
    ajax('setSet',data,(res) => {
      if(res.sta == 1){
          // self.setData({
          //     ["setInfo.remindLen"]: res.data[0].remindLen,
          //     ["setInfo.remind"]: res.data[0].remind
          // })
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
    this.setData({
      showLoading:true
    })
    let data = {
      userId:this.data.userId,
      nickName:this.data.nickName,
      opinion:this.data.opinion
    }
    ajax('opinion',data,(res) => {
      this.setData({
        showLoading:false
      })
      my.showToast({
        content: res.msg,
        duration: 2000
      });
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
    ajax('getSet',{userId:this.data.userId},(res) => {
      if(res.sta == 1){
        let t = 0;
        if(res.data.remindLen == 1){
          t=0
        }else if(res.data.remindLen == 3){
          t=1
        }else if(res.data.remindLen == 5){
          t=2
        }else if(res.data.remindLen == 7){
          t=3
        }else{
          t=0
        }
        this.setData({
          selectVal:t,
          remind:res.data.remind
        })
      }
    })
  }
});
