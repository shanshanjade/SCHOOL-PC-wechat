// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {

  },

  onLoad() {

  },



  submit:e=>{
    var that = this;
    var formData = e.detail.value;
    console.log(formData)
    wx.request({
      url: '192.168.43.227:80',
      method: 'GET',
      header: {// 设置请求的 header
        'content-type': 'application/x-www-form-urlencoded;'
      },
      data:{
        'wifi_ssid':formData.wifi_ssid,
        'wifi_psw':formData.wifi_psw
      },
      // data: '\r\n--XXX' +
      // '\r\nContent-Disposition: form-data; name="wifi_ssid"' +
      // '\r\n' + 
      // '\r\n' + 'HUAWEIMATE30' + 
      // '\r\n--XXX' +
      // '\r\nContent-Disposition: form-data; name="wifi_psw"' +
      // '\r\n' + 
      // '\r\n' + '12345678' + 
      // '\r\n--XXX--',
      success: res=>{
        console.log(res)
      }
    })

  //   wx.uploadFile({
  //     url: '192.168.4.1:80',
  //     filePath: '',
  //     name: 'file',
  //     header: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //     formData: {
  //       'ssid': 'HUAWEIMETE30',
  //       'password': '12345678',
  //     },
  //     success (res){
  //       console.log('success')
  //     }
  //   })
  }

})
