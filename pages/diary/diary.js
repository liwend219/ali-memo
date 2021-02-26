var http = require('../../lib/http.js')
import ajax from '../../lib/fetch'
Page({
  data: {
    title:'',
    maxFont:200,
    objectArray: [
      {
        id: 0,
        name: '非常好',
      },
      {
        id: 1,
        name: '一般般',
      },
      {
        id: 2,
        name: '不开心',
      },
      {
        id: 3,
        name: '很愤怒',
      },
    ],
    memoList:[
        {
            type:0,
            name:'未完成'
        },
        {
            type: 1,
            name: '已完成'
        }
    ],
    index: 0,
    info:{
        pid:'',
        title: '',
        content: '',
        date: '',
        time:'',
        userId: '',
        _id:'',
        types:0,
        moodStatus: 0,
        state:0,
        timer:0,
        tmpPic:[],
        tmpPic2:[],
        nickName:'',
        avatar:'',
        email:'',
        isOpen:false,
        isEmailTip:false,
    },
    showLoading:false,
    showSetEmail:false,
  },
  onLoad(e) {
    if(e && e.idx){
      this.setData({
        ["info.types"]:e.idx
      })
    }
    if(e.data){
      let tdata = JSON.parse(e.data)
      let s ;
      if(tdata.state){
        s = 1
      }else{
        s = 0
      }
      this.setData({
        info:tdata,
        ["info.types"]:e.idx,
        ["info.state"]:s
      })
    }else{
      var date = new Date()
      let y = date.getFullYear()
      let m = (date.getMonth()+1) < 10?'0'+(date.getMonth()+1):date.getMonth()+1
      let d = date.getDate() < 10?'0'+date.getDate():date.getDate()
      let h = date.getHours() < 10?'0'+date.getHours():date.getHours()
      let min = date.getMinutes() < 10?'0'+date.getMinutes():date.getMinutes()
      this.setData({
        ["info.date"]:y+'-'+m+'-'+d,
        ["info.time"]:h+':'+min
      })
    }
    my.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({
          ["info.userId"]:res.data.userId,
          ["info.nickName"]:res.data.nickName,
          ["info.avatar"]:res.data.avatar
        })

        
      }
    })

    my.getStorage({
      key: 'userEmail',
      success: (res) => {
        if(res.data){
          this.setData({
            ["info.email"]:res.data,
            ["info.isEmailTip"]:true,
          })
        }else{
          this.getEmail()
        }
      }
    })
    
  },
  onClear(){
    this.setData({
      ['info.email']:''
    })
  },
  selectMood(){

  },
  getEmail(){
    ajax('user/email',{userId:this.data.info.userId},(res) => {
      if(res.sta == 1){
        my.setStorage({
          key: 'userEmail', // 缓存数据的key
          data: res.data, // 要缓存的数据
        });
        this.setData({
          ["info.email"]:res.data,
          ["info.isEmailTip"]:true,
        })
      }
      
    })
  },
  moodChange(e) {
    if(e.detail && e.detail.value != null){
      this.setData({
        ["info.moodStatus"]:e.detail.value
      });
    }
    
  },
  stateChange(e){
    if(e.detail && e.detail.value != null){
      this.setData({
        ["info.state"]:e.detail.value
      });
    }
  },
  selectDate(){
    my.datePicker({
      format: 'yyyy-MM-dd',
      startDate:'2012-01-01',
      endDate:'2099-12-31',
      success: (res) => {
        this.setData({
          ["info.date"]:res.date
        })
      },
    });
  },
  selectTime(){
    my.datePicker({
      format: 'HH:mm',
      success: (res) => {
        this.setData({
          ["info.time"]:res.date
        })
      },
    });
  },
  saveDiary(){
    if(this.data.showLoading){
      return
    }
    if(this.data.info.types == 0 && !this.data.info.content){
      my.showToast({
        content: '内容不可为空',
        duration: 2000
      });
      return
    }
    if(this.data.info.types == 1 && !this.data.info.content){
      my.showToast({
        content: '内容不可为空',
        duration: 2000
      });
      return
    }
    if(this.data.info.types == 2 && !this.data.info.title){
      my.showToast({
        content: '标题不可为空',
        duration: 2000
      });
      return 
    }
    this.setData({
      ["info.pid"]:new Date().getTime()+'_dingdong_'+this.data.info.userId
    })
    this.setData({
      showLoading:true
    })
    ajax('saveDiary',this.data.info,(res) => {
      this.setData({
        showLoading:false
      })
      if(res.sta == 1){
        if(this.data.info.tmpPic.length != 0){
          for(let i = 0; i < this.data.info.tmpPic.length; i++){
            
            my.uploadFile({
              url: http.roots + "upload",
              filePath: this.data.info.tmpPic[i],
              fileType:'image',
              fileName: 'img',
              formData:{
                pid:this.data.info.tmpPic2[i]
              },
              header: {  
                "Content-Type": "multipart/form-data",
                'accept': 'application/json'
              },
              success: (res) => {
                var data=JSON.parse(res.data);
                if(data.sta == 1){
                  if(this.data.info.types == 0){
                    my.reLaunch({
                        url: '../index/index'
                    })
                  }else if(this.data.info.types == 1){
                    // my.navigateTo({
                    //     url: '../schedule/schedule'
                    // })
                  }else{
                    my.navigateTo({
                        url: '../schedule/schedule?activeTab=1'
                    })
                  }                  
                }else{
                  my.showToast({
                    type: 'fail',
                    content: '图片上传失败',
                    duration: 2000
                  });
                }
              }
            })
          }
        }else{
          if(this.data.info.types == 0){
            my.reLaunch({
                url: '../index/index'
            })
          }else{
            my.reLaunch({
                url: '../schedule/schedule'
            })
          }
        }
        
      }else{
        my.showToast({
          type: 'fail',
          content: '保存失败',
          duration: 2000
        });
      }
    })
  },
  saveHole(){
    // /saveHole
    if(this.data.showLoading){
      return
    }
    if(!this.data.info.content){
      my.showToast({
        content: '内容不可为空',
        duration: 2000
      });
      return
    }
    this.setData({
      showLoading:true
    })
    ajax('saveHole',this.data.info,(res) => {
      this.setData({
        showLoading:false
      })
      if(res.sta == 1){
        if(this.data.info.tmpPic.length != 0){
            for(let i = 0; i < this.data.info.tmpPic.length; i++){
              my.uploadFile({
                url: http.roots + "upload",
                filePath: this.data.info.tmpPic[i],
                fileType:'image',
                fileName: 'img',
                formData:{
                  pid:this.data.info.tmpPic2[i]
                },
                header: {  
                  "Content-Type": "multipart/form-data",
                  'accept': 'application/json'
                },
                success: (res) => {
                  var data=JSON.parse(res.data);
                  if(data.sta == 1){
                    my.navigateTo({
                        url: '../index/index?activeTab=1'
                    })
                  }else{
                    my.showToast({
                      type: 'fail',
                      content: '图片上传失败',
                      duration: 2000
                    });
                  }
                },
                fail: (err) => {

                },
              })
            }
        }else{
          // my.reLaunch({
          //     url: '../index/index?activeTab=1'
          // })
          my.navigateTo({
              url: '../index/index?activeTab=1'
          })
        }
      }
    })
  },
  onInputTitle(e){
    this.setData({
      ["info.title"]:e.detail.value
    })
  },
  onInputTitle2(e){
    this.setData({
      ["info.email"]:e.detail.value
    })
  },
  onInputContent(e){
    this.setData({
      ["info.content"]:e.detail.value
    })
  },
  onClear(e){
    this.setData({
      ["info.title"]:''
    })
  },
  uploadPic(e){
    my.chooseImage({
      count:3,
      sizeType:['compressed'],
      success: (res) => {
        let t = []
        res.apFilePaths.forEach(val => {
          let s = Math.floor(Math.random()*(9999-1000)) + 1000
          t.push(http.roots+'tmp/'+new Date().getTime()+'_'+s+'.jpg')
        })
        this.setData({
          ["info.tmpPic"]:res.apFilePaths,
          ["info.tmpPic2"]:t
        })
      },
    })
  },
  checkOpen(){
    this.setData({
      ["info.isOpen"]:!this.data.info.isOpen
    })
  },
  emailTip (e) {
    if(!this.data.info.email){
      this.setData({
        showSetEmail:true
      })
      return
    }
    this.setData({
      ["info.isEmailTip"]:e.detail.value
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
    ajax('setEmail',{
      userId:this.data.info.userId,
      email:this.data.info.email
    },(res) => {
      this.setData({
        ["info.isEmailTip"]:true
      })
      this.onModalEmailClose()
    })
  },
  onClear(){
    this.setData({
      ['info.email']:''
    })
  },
  onModalEmailClose(){
    this.setData({
      "showSetEmail":false,
      ["info.email"]:''
    })
  },
});
