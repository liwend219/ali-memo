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
    showSetEmail:false,
    info:{
      email:'',
      email2:''
    },
    objectArray: [
      {
        id: 6,
        name: '6小时',
      },
      {
        id: 12,
        name: '12小时',
      },
      {
        id: 24,
        name: '1天',
      },
      {
        id: 72,
        name: '3天',
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
        my.getStorage({
          key: 'userEmail',
          success:(res2) => {
            if(res2.data){
              this.setData({
                ["info.email2"]:res2.data
              })
            }else{
              this.getEmail()
            }
          }
        })
        
        this.getSet()
      },
    });
  },
  dayChange(e){
    let len;
    if(e.detail && e.detail.value != null){
      this.setData({
        selectVal:e.detail.value
      })
      len = this.data.objectArray[e.detail.value].id
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
      showOpinion:false,
      opinion:''
    })
  },
  onModalClick(){
    this.setData({
      showLoading:true
    })
    let data = {
      userId:this.data.userId,
      email:this.data.info.email2,
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
      showOpinion:false,
      opinion:''
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
    let len = this.data.objectArray[this.data.selectVal].id
    this.setRemind(len,e.detail.value)
  },
  getEmail(){
    ajax('user/email',{userId:this.data.userId},(res) => {
      console.log(res)
      if(res.sta == 1){
        my.setStorage({
          key: 'userEmail', // 缓存数据的key
          data: res.data, // 要缓存的数据
        });
        this.setData({
          ["info.email2"]:res.data
        })
      }
      
    })
  },
  getSet(){
    ajax('getSet',{userId:this.data.userId},(res) => {
      if(res.sta == 1){
        console.log(res)
        let t = 0;
        if(res.data.remindLen == 6){
          t=0
        }else if(res.data.remindLen == 12){
          t=1
        }else if(res.data.remindLen == 24){
          t=2
        }else if(res.data.remindLen == 72){
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
  },
  onClear(){
    this.setData({
      ['info.email']:''
    })
  },
  onInputTitle(e){
    this.setData({
      ["info.email"]:e.detail.value
    })
  },
  onModalEmailClick(){
    if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.data.info.email))){ 
      my.showToast({
        content: '邮箱格式有误，请重新输入',
        duration: 2000
      });
      this.onClear()
      return
    }
    this.setData({
      ["info.email2"]:this.data.info.email
    })
    my.setStorage({
      key: 'userEmail', // 缓存数据的key
      data: this.data.info.email2, // 要缓存的数据
    });
    ajax('setEmail',{
      userId:this.data.userId,
      email:this.data.info.email2
    },(res) => {
      this.onModalEmailClose()
    })
  },
  onModalEmailClose(){
    this.setData({
      "showSetEmail":false,
      ["info.email"]:''
    })
  },
  showEmailBox(){
    this.setData({
      "showSetEmail":true
    })
  }
});
