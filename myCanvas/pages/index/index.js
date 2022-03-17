//index.js
//获取应用实例
const app = getApp()
var ctx, ctx1, ctx2
var canvas, canvas1, canvas2
var tempGradient
var msg
const udp = wx.createUDPSocket()
udp.bind(8888)
Page({
  data: {
    color: 'white',
    wHeight: 0,
    x_mv: 10,
    hue: 0,
    lightness: 50,
    colorArray: [{
        h: 0,
        s: 100,
        l: 50
      },
      {
        h: 60,
        s: 100,
        l: 50
      },
      {
        h: 120,
        s: 100,
        l: 50
      },
      {
        h: 180,
        s: 100,
        l: 50
      },
      {
        h: 240,
        s: 100,
        l: 50
      },
      {
        h: 300,
        s: 100,
        l: 50
      }
    ],
    currentItem: -1
  },
  onLoad: function () {

  },
  onReady: function () {
    msg = wx.getSystemInfoSync()
    console.log(msg)
    const query = wx.createSelectorQuery()
    query.select('#canvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        canvas = res[0].node
        canvas.width = 1000
        canvas.height = 100
        ctx = canvas.getContext('2d')
        let gradient = ctx.createLinearGradient(0, 0, 1000, 0)
        gradient.addColorStop(0, 'red')
        gradient.addColorStop(1 / 7, 'orange')
        gradient.addColorStop(2 / 7, 'yellow')
        gradient.addColorStop(3 / 7, 'green')
        gradient.addColorStop(4 / 7, 'cyan')
        gradient.addColorStop(5 / 7, 'blue')
        gradient.addColorStop(6 / 7, 'purple')
        gradient.addColorStop(1, 'red')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 1000, 100)
      })

    const query1 = wx.createSelectorQuery()
    query1.select('#canvas1')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        canvas1 = res[0].node
        canvas1.width = 1000
        canvas1.height = 100
        ctx1 = canvas1.getContext('2d')
        let gradient = ctx1.createLinearGradient(0, 0, 1000, 0)
        gradient.addColorStop(0, 'black')
        gradient.addColorStop(1, 'white')
        ctx1.fillStyle = gradient
        ctx1.fillRect(0, 0, 1000, 100)
      })
  },
  bgc_change: function (e) {
    let x, y
    if (e.type == 'tap') {
      x = e.detail.x - e.target.offsetLeft
      y = e.detail.y - e.target.offsetTop
    } else if (e.type == 'touchmove') {
      x = e.touches[0].x
      y = e.touches[0].y
    }
    let imageData
    if (e.target.id == 'canvas') {
      imageData = ctx.getImageData(Math.floor(x) * 1000 / 370, Math.floor(y) * 1000 / 370, 1, 1)
    } else if (e.target.id == 'canvas1') {
      imageData = ctx1.getImageData(Math.floor(x) * 1000 / 370, Math.floor(y) * 1000 / 370, 1, 1)
    }
    let color = `rgba(` + imageData.data[0] + `,` + imageData.data[1] + `,` + imageData.data[2] + `,` + imageData.data[3] + `)`
    this.setData({
      color: color
    })

    if (e.target.id == 'canvas') {
      let gradient = ctx1.createLinearGradient(0, 0, 1000, 0)
      gradient.addColorStop(0, 'black')
      gradient.addColorStop(0.5, color)
      gradient.addColorStop(1, 'white')
      ctx1.fillStyle = gradient
      ctx1.fillRect(0, 0, 1000, 100)
    }
  },
  sliderEvent_h: function (e) {
    console.log(this.data.colorArray)
    if (this.data.currentItem == -1) return
    this.data.colorArray[this.data.currentItem].h = e.detail.value
    this.setData({
      colorArray: this.data.colorArray,
      hue: e.detail.value
    })
  },
  sliderEvent_s: function (e) {
    console.log(this.data.colorArray)
    if (this.data.currentItem == -1) return
    this.data.colorArray[this.data.currentItem].l = e.detail.value
    this.setData({
      colorArray: this.data.colorArray,
      lightness: e.detail.value
    })
  },
  btnadd: function () {
    if (this.data.currentItem == -1) {
      this.data.colorArray.push({
        h: 0,
        s: 100,
        l: 100
      })
    } else {
      this.data.colorArray.push({
        h: this.data.colorArray[this.data.currentItem].h,
        s: this.data.colorArray[this.data.currentItem].s,
        l: this.data.colorArray[this.data.currentItem].l
      })
    }
    this.setData({
      colorArray: this.data.colorArray
    })
  },
  btnsub: function () {
    this.data.colorArray.splice(this.data.colorArray.length - 1, 1)
    this.setData({
      colorArray: this.data.colorArray,
      currentItem: -1
    })
  },
  select: function (e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      currentItem: id
    })
  },
  btngra: function () {
    const query1 = wx.createSelectorQuery()
    query1.select('#canvas2')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        canvas2 = res[0].node
        canvas2.width = 800
        canvas2.height = 200
        ctx2 = canvas2.getContext('2d')
        var gradient6 = ctx2.createLinearGradient(0, 0, 800, 0)
        let colorArray = this.data.colorArray
        for (var i in colorArray) {
          let rgb = []
          rgb = this.hsltorgb(colorArray[i].h, colorArray[i].s, colorArray[i].l)
          gradient6.addColorStop(i / (colorArray.length - 1), 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')')
        }
        ctx2.fillStyle = gradient6
        ctx2.fillRect(0, 0, 800, 200)
        this.send2esp()
      })
  },
  //输入的h范围为[0,360],s,l为百分比形式的数值,范围是[0,100] 
  //输出r,g,b范围为[0,255],可根据需求做相应调整
  hsltorgb: function (h, s, l) {
    var h = h / 360;
    var s = s / 100;
    var l = l / 100;
    var rgb = [];

    if (s == 0) {
      rgb = [Math.round(l * 255), Math.round(l * 255), Math.round(l * 255)];
    } else {
      var q = l >= 0.5 ? (l + s - l * s) : (l * (1 + s));
      var p = 2 * l - q;
      var tr = rgb[0] = h + 1 / 3;
      var tg = rgb[1] = h;
      var tb = rgb[2] = h - 1 / 3;
      for (var i = 0; i < rgb.length; i++) {
        var tc = rgb[i];
        if (tc < 0) {
          tc = tc + 1;
        } else if (tc > 1) {
          tc = tc - 1;
        }
        switch (true) {
          case (tc < (1 / 6)):
            tc = p + (q - p) * 6 * tc;
            break;
          case ((1 / 6) <= tc && tc < 0.5):
            tc = q;
            break;
          case (0.5 <= tc && tc < (2 / 3)):
            tc = p + (q - p) * (4 - 6 * tc);
            break;
          default:
            tc = p;
            break;
        }
        rgb[i] = Math.round(tc * 255);
      }
    }
    return rgb;
  },
  send2esp:function(){
    let imageobj = ctx2.getImageData(0,0,32,115)
    let info = [0,imageobj.width,imageobj.height]
    // let fullarray = Array.from(imageobj.data)
    let fullarray = Array.from(imageobj.data)
    fullarray = info.concat(fullarray)
    let uint8Arr = new Uint8ClampedArray(fullarray)
    let u16 =  new Uint16Array([1152,4545,15262,4845])
    let buf = u16.buffer
    console.log(buf)
    udp.send({
      address:'192.168.43.227',
      port:8266,
      message: u16
    })
  }
})