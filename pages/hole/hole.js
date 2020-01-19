var http = require('../../lib/http.js')
var util = require('../../lib/time.js')
Page({
  data: {
      info:{
          txt:''
      },
      userId:'',
      avatar:'',
      nickName:'',
      list:[],
      tmpData:{},
      showComment:false,
      showLoading:false,
      isShowTail:false,
      diaryItem:'',
      stateList:[
        '../../images/cool.png',
        '../../images/flushed.png',
        '../../images/sad.png',
        '../../images/angry.png'
      ],
  },
    onLoad() {
        var self = this;
        my.getStorage({
          key: 'userInfo',
          success: function(res) {
            if(res.data){
              self.setData({
                userId:res.data.userId,
                nickName:res.data.nickName,
                avatar:res.data.avatar
              })
              self.getHole(self)
            }else{

            }
          },
          fail: function(res){

          }
        })
        
    },
    showTail(e){
      console.log(e.currentTarget.dataset.item)
      this.setData({
        diaryItem:e.currentTarget.dataset.item,
        isShowTail:true,
      })
    },
    onInputTitle(e){
      this.setData({
        ["info.txt"]:e.detail.value
      })
    },
    getHole(self){
      my.request({
        url: http.roots + "getHole",
        method: 'POST',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          userId:self.data.userId
        },
        dataType: 'json',
        success: function(res) {
          let list = []
          res.data.data.forEach((val) => {
            // list.push(val)
            val.time = util.fromDate(val.timer)
          })
          if(res.data.sta == 1){
            self.setData({
              list:res.data.data
            })
          }
        }
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
    onModalClick(){
        this.setData({
          showLoading:true
        })
        var self = this;
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
        my.request({
          url: http.roots + "publish/comment",
          method: 'POST',
          header: {
              "Content-Type": "application/x-www-form-urlencoded"
          },
          data: self.data.tmpData,
          dataType: 'json',
          success: function(res) {
              if(res.data.sta == 1){
                self.setData({
                  showLoading:false,
                  showComment:false
                })
                self.getHole(self)
              }
          }
        })
    },
    onModalClose(){
        this.setData({
            showComment:false
        }) 
    },
    onDetailClose(){
      this.setData({
        isShowTail:false
      })
    },
    star(item){
      var self = this;
      let data = item.target.dataset.item
      my.request({
        url: http.roots + "star",
        method: 'POST',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          userId:data.userId,
          pid:data.pid
        },
        dataType: 'json',
        success: function(res) {
            if(res.data.sta == 1){
                self.getHole(self)
            }else{
                my.showToast({
                  type: 'error',
                  content: res.data.msg,
                  duration: 2000
                });
            }
        },
        fail:function(err){
          console.log(err)
        }
      })
    },
    newHole(){
      my.navigateTo({
          url: '../diary/diary?idx=4'
      })
    }
});
