var timeindex
var authorize = false
Page({
  data: {
    h12:false,
    timing_on: false,
    open_time: '00:00',
    close_time: '00:00',
    popupshow: false,
    ssid: '',
    pswd: '',
    isAPconnected: true,
    wifilistshow: false,
    wifilist: [],
  },
 
  onLoad() {
    userLocationAuthorize()
    wx.startWifi({
      success: (res) => {
        wx.getWifiList({
          success: (res) => {
            wx.onGetWifiList((result) => {
              console.log(result)
              let temp = []
              for (let i in result.wifiList) {
                temp.push(result.wifiList[i].SSID)
              }
              this.setData({
                wifilist: temp
              })
            })
          },
        })
      },
    })
    
  },
  radio_change(e){
    console.log(this.data.ssid)
    console.log(this.data.pswd)
    this.setData({
      h12: e.detail
    })
  },
  show_popup(e){
    timeindex = e.currentTarget.dataset.name;
    this.setData({popupshow: true})
  },
  close_popup(){
    this.setData({popupshow: false})
  },
  time_input(e){
    if (timeindex == "open") {
      this.setData({
        open_time: e.detail
      })
    }else if(timeindex == "close"){
      this.setData({
        close_time: e.detail
      })
    }
  }, 
  show_wifilist(){
    this.setData({
      wifilistshow: true
    })
  },
  close_popupwifilist(){
    this.setData({
      wifilistshow: false
    })
  },
  wifilist_input(e){
    console.log(e);
    this.setData({
      ssid: e.detail.value
    })
  },
  click_saveRestart(){
    wx.request({
      url: 'http://192.168.4.1:80',
      method: 'POST',
      data: {
        ssid:'',
        pswd:'',
        h12: ''
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
    })
  }
})

var userLocationAuthorize = function(){
  wx.authorize({
    scope: 'scope.userLocation',
    success: res => {
      authorize = true
    },
    fail: res => {
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            wx.showModal({
              title: '提示',
              content: '小程序未获得地理位置信息授权，点确定授权',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: data => {
                      if (data.authSetting["scope.userLocation"] == true) {
                        authorize = true
                      } else if (data.authSetting["scope.userLocation"] == false) {
                        userLocationAuthorize();
                      }
                    }
                  })
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                  userLocationAuthorize();
                }
              }
            })
          }
        }
      })
    }
  })
}