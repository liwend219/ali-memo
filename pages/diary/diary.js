var http = require('../../lib/http.js')
Page({
  data: {
    title:'',
    
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
        isOpen:false
    },
  },
  onLoad(e) {
    if(e.idx){
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
    var self = this
    my.getStorage({
      key: 'userInfo',
      success: function(res) {
        self.setData({
          ["info.userId"]:res.data.userId,
          ["info.nickName"]:res.data.nickName,
          ["info.avatar"]:res.data.avatar
        })
      }
    })
    
  },
  onClear(){

  },
  selectMood(){

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
    var self = this
    if(this.data.info.types == 0 && !this.data.info.title){
      my.showToast({
        content: '标题不可为空',
        duration: 2000
      });
      return 
    }else if(this.data.info.types == 0 && !this.data.info.content){
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
    my.request({
      url: http.roots + "saveDiary",
      method: 'POST',
      header: {
          "Content-Type": "application/x-www-form-urlencoded"
      },
      data: this.data.info,
      dataType: 'json',
      success: function(res) {
        
        if(res.data.sta == 1){
          if(self.data.info.tmpPic.length != 0){
            for(let i = 0; i < self.data.info.tmpPic.length; i++){
              my.uploadFile({
                url: http.roots + "upload",
                filePath: self.data.info.tmpPic[i],
                fileType:'image',
                fileName: 'img',
                formData:{
                  pid:self.data.info.tmpPic2[i]
                },
                header: {  
                  "Content-Type": "multipart/form-data",
                  'accept': 'application/json'
                },
                success: function(res){
                  var data=JSON.parse(res.data);
                  if(data.sta == 1){
                    my.reLaunch({
                        url: '../index/index'
                    })
                    
                  }else{
                    my.showToast({
                      type: 'fail',
                      content: '图片上传失败',
                      duration: 2000
                    });
                  }
                },
                fail: function(err){
                },
              })
            }
          }else{
            my.reLaunch({
                url: '../index/index'
            })
          }
          
        }else{
          my.showToast({
            type: 'fail',
            content: '保存失败',
            duration: 2000
          });
        }
      },
      fail: function(res) {
        my.showToast({
          type: 'fail',
          content: '系统错误',
          duration: 2000
        });
      },
      complete: function(res) {
        
      }
    });
  },
  saveHole(){
    // /saveHole
    var self = this
    if(!this.data.info.content){
      my.showToast({
        content: '内容不可为空',
        duration: 2000
      });
      return
    }
    my.request({
      url: http.roots + "saveHole",
      method: 'POST',
      header: {
          "Content-Type": "application/x-www-form-urlencoded"
      },
      data: this.data.info,
      dataType: 'json',
      success: function(res) {
        if(res.data.sta == 1){
          if(self.data.info.tmpPic.length != 0){
              for(let i = 0; i < self.data.info.tmpPic.length; i++){
                my.uploadFile({
                  url: http.roots + "upload",
                  filePath: self.data.info.tmpPic[i],
                  fileType:'image',
                  fileName: 'img',
                  formData:{
                    pid:self.data.info.tmpPic2[i]
                  },
                  header: {  
                    "Content-Type": "multipart/form-data",
                    'accept': 'application/json'
                  },
                  success: function(res){
                    var data=JSON.parse(res.data);
                    if(data.sta == 1){
                      my.reLaunch({
                          url: '../hole/hole'
                      })
                      
                    }else{
                      my.showToast({
                        type: 'fail',
                        content: '图片上传失败',
                        duration: 2000
                      });
                    }
                  },
                  fail: function(err){

                  },
                })
              }
          }else{
            my.reLaunch({
                url: '../hole/hole'
            })
          }
        }
      },
      complete: function(res) {
        
      }
    })
  },
  onInputTitle(e){
    this.setData({
      ["info.title"]:e.detail.value
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
          // new Date().getTime()+this.data.info.userId.slice(-4)
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
});
