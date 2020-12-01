Page({
  data: {
    ctx:'',
  },
  onReady() {
    // this.point = {
    //   x: Math.random() * 590,
    //   y: Math.random() * 590,
    //   dx: Math.random() * 10,
    //   dy: Math.random() * 10,
    //   r: Math.round(Math.random() * 255 | 0),
    //   g: Math.round(Math.random() * 255 | 0),
    //   b: Math.round(Math.random() * 255 | 0),
    // };

    // this.interval = setInterval(this.draw.bind(this), 17);
    // this.ctx = my.createCanvasContext('canvas');
    this.data.ctx = my.createCanvasContext('canvas')
     this.data.ctx.setFillStyle('#fff')//文字颜色：默认黑色
      
      this.data.ctx.drawImage('../../images/bg.jpg', 2, 2, 280, 500)
    // ctx.setFontSize(18)//设置字体大小，默认10
    // ctx.font = "28"
    // ctx.font ="CSS font DOMString"
      this.data.ctx.font = 'italic bold 12px 宋体'
      var str = '不过是大梦初醒一场空，不过是你好啊，我去,真特么刺激 哈哈哈哈\n醒来就这，嗯';
      var str2 = str.split(/[,， \n]/);
      console.log(str2)
      this.data.ctx.fillText("不过是大梦初醒一场空", 50, 50)//绘制文本
      this.data.ctx.fillText("不过是孤影照晴空", 50, 70)
      this.data.ctx.fillText("--LWD", 180, 280)
      this.data.ctx.draw()
    // my.getImageInfo({
    //   src: 'https://s2.ax1x.com/2019/09/17/n5OuOx.jpg',
    //   success(res){
    //     this.ctx.drawImage(res.path,0,0,100,100)
    //     this.ctx.draw()
    //   }
    // })
    //调用draw()开始绘制
    // this.ctx.draw()
    // https://s2.ax1x.com/2019/09/17/n5OuOx.jpg
  },
  saveImg() {
    this.data.ctx.toTempFilePath({
      success(res1){
        console.log(res1)
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
});
