import ajax from '../../lib/fetch'
Page({
  data: {
    toView: 'red',
    scrollTop: 100,
    monthList: [],
    nowMonth:0,
    selectMonth:0,
    nowDate:0,
    _year:0,
    _Mon:0,
    _Mon2:0,
    _Day:0,
    days:30,
    startDay:1,
    diaryArr:[],
    memoArr:[],
    timeArr:[],
    dataObj:{},
    nowMonthData:{},
    userId:'',
    style:[
      'background:#95e5ff;color:#fff',
      'background:#feeb9c;color:#fff',
      'background:#d9e0ea;color:#fff',
      'background:#ff9cbd;color:#fff'
    ],
    showBox:false,
    detailList:[],
    sta:[]
  },
  onLoad() {
    this.initData2()
    my.getStorage({
      key: 'userInfo', // 缓存数据的key
      success: (res) => {
        if(res.data){
          this.setData({
            userId:res.data.userId
          })
          this.getData(res.data.userId)
        }
      },
    });
    
  },
  onPullDownRefresh() {
    // 页面被下拉
    this.initData2(this.data.selectMonth)
  },
  monthChange(e){
    if(e.detail && e.detail.value != null){
      this.setData({
        selectMonth:e.detail.value+1
      })
      this.initData2(e.detail.value+1)
    }
  },
  showDetail(e){
    if(e.target.dataset.item){
      this.setData({
        detailList:e.target.dataset.item.arr,
        showBox:true
      })
    }
    
  },
  onModalClose(){
    this.setData({
      showBox:false
    })
  },
  getData(id,mth){
    let Mth ;
    if(!mth){
      var date = new Date()
      Mth = date.getMonth()+1
    }else{
      Mth = mth
    }
    let data = {
      userId:id,
      startDate:this.data._year + '-' + Mth + '-01',
      endDate:this.data._year + '-' + Mth + '-30',
    }
    ajax('getMonData',data,(res) => {
      my.stopPullDownRefresh()
      if(res.sta == 1){
        this.setData({
          diaryArr:res.data.diary,
          memoArr:res.data.memo,
          timeArr:res.data.time
        })
        this.initData(mth)
      }
    })
  },
  initData(mth){
    let obj = {},sta=[0,0,0,0]
    // sta = {cool:0,usual:0,unhappy:0,anger:0}
    this.data.diaryArr.forEach(val => {
      if(val.moodStatus == 0){
        sta[0] += 1
      }else if(val.moodStatus == 1){
        sta[1] += 1
      }else if(val.moodStatus == 2){
        sta[2] += 1
      }else{
        sta[3] += 1
      }
      let key = parseInt(val.date.slice(-2))
      val.name = 'diary'
      if(obj[key] && obj[key].arr){
        obj[key].arr.push(val)
      }else{
        obj[key] = {}
        obj[key].arr = []
        obj[key].arr.push(val)
      }
      obj[key].style = this.data.style[val.moodStatus]
    })
    let max = 0,idx=0;
    sta.forEach((val,key) => {
      if(val > max){
        max = val,
        idx = key
      }
    })
    this.data.memoArr.forEach(val => {
      let key = parseInt(val.date.slice(-2))
      val.name = 'memo'
      if(obj[key] && obj[key].arr){
        obj[key].arr.push(val)
      }else{
        obj[key] = {}
        obj[key].arr = []
        obj[key].arr.push(val)
      }
      obj[key].dop = true
    })
    this.data.timeArr.forEach(val => {
      let key = parseInt(val.date.slice(-2))
      val.name = 'time'
      if(obj[key] && obj[key].arr){
        obj[key].arr.push(val)
      }else{
        obj[key] = {}
        obj[key].arr = []
        obj[key].arr.push(val)
      }
      obj[key].dop = true
    })
    this.setData({
      dataObj:obj,
      sta:idx
    })
    if(!mth){
      this.setData({
        nowMonthData:obj,
        sta:idx
      })
    }
  },
  initData2(mth){
    let date = new Date()
    let m = mth || date.getMonth() + 1;
    let m2 = date.getMonth() + 1
    let days = 0
    let d = date.getDate()
    let y = date.getFullYear()

    let date2 = new Date(date.getFullYear() + '-' + m + '-01')
    if(m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12){
      days = 31
    }else if(m == 2 ){
      if (y % 4 == 0) {
          days = 29
      } else {
          days = 28
      }
    }else{
      days = 30
    }
    
    let arr = []
    for(let i = 1; i <= m2; i++){
      arr.push({
        id:i,
        name:i+'月'
      })
    }
    this.setData({
      monthList:arr,
      nowMonth:m,
      nowDate:d,
      _year:y,
      _Mon:m,
      _Mon2:m2,
      _Day:d,
      days:days,
      startDay:date2.getDay()
    })
    if(mth){
      this.getData(this.data.userId,mth)
    }
  },


  upper(e) {
    
  },
  lower(e) {
    
  },
  scroll(e) {
    
  },
  scrollToTop(e) {
    this.setData({
      scrollTop: 0,
    });
  },
});
