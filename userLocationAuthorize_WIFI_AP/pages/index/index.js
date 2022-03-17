var crc8 = require('../../pages/utils/crc8.js')

var authorize = false
var arraybuffer = new ArrayBuffer(1000);



Page({
  data: {
    wifi_ssid: '',
    wifi_psw: '',
    isDialogShow: false,
    wifiList: [],



    
    configButtonisDisabled: true,
    connectAPisLoading: false
  },

  onLoad: function (options) {
    userLocationAuthorize();
    wx.startWifi({
      success: (res) => {
        console.log(res)
        wx.getWifiList({
          success: (res) => {
            wx.onGetWifiList((result) => {
              console.log(result)
              let temp = []
              for (let i in result.wifiList) {
                temp.push(result.wifiList[i].SSID)
              }
              this.setData({
                wifiList: temp
              })
            })
          },
        })
      },
    })
    wx.getConnectedWifi({
      success: (result) => {
        console.log(result)
        var BSSIDstringArray = result.wifi.BSSID.split(':')
        console.log(BSSIDstringArray)
        var BSSIDnumberArray = []
        for (let i in BSSIDstringArray) {
          BSSIDnumberArray.push(parseInt(BSSIDstringArray[i], 16))
        }
        console.log(BSSIDnumberArray)
        var BSSIDUint8Array = new Uint8Array(BSSIDnumberArray)
        console.log(BSSIDUint8Array)
        var BSSID_crc8 = crc8.crc8(BSSIDUint8Array)
        console.log(BSSID_crc8.toString(16))

        var arr = [];
        var str = '360wifi'
        for (var i = 0, j = str.length; i < j; i++) {
          arr.push(str.charCodeAt(i));
        }
        console.log(arr)
        var tmpUint8Array = new Uint8Array(arr);
        var SSID_crc8 = crc8.crc8(tmpUint8Array)
        console.log(SSID_crc8.toString(16))

        if (result.wifi.SSID == 'AWTRIX') {
          this.setData({
            configButtonisDisabled: true
          })
        }
      },
    })





  },

  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},

  userLocationAuthorize: function () {
    userLocationAuthorize();
  },
  showDialog: function () {
    this.setData({
      isDialogShow: true
    })
  },
  bindChangePicker: function (e) {
    this.setData({
      wifi_ssid: e.detail.value
    })
  },
  connectAP: function () {
    console.log('开始连接AP')
    this.setData({
      connectAPisLoading: true
    })
    wx.connectWifi({
      SSID: 'awtrix',
      password: '12345678',
      success: res => {
        console.log(res)
        this.setData({
          connectAPisLoading: false,
          configButtonisDisabled: false
        })
      },
      complete: res => {
        this.setData({
          connectAPisLoading: false,
        })
      }
    })
    var ping = wx.createUDPSocket()
    const dIp ="localhost"
    const dPort = ping.bind()
    ping.onMessage(res=>{
      console.log(res.remoteInfo)
    })
    ping.send({
      address: dIp,
      port: dPort,
      message:"ping"
    })
  }
})

var userLocationAuthorize = function () {
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