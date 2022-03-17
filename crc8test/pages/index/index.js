const crc8 = require('../../utils/crc8.js')
Page({
  data: {},
  onLoad: function () {
    var ssidstr = '360wifi'
    var bssidstr = '04:8b:42:25:03:35'
    var passwordstr = '12345678'
    var ipaddressstr = '192.168.33.254'

    var ssidCharCodeArr = []
    for (let i = 0; i < ssidstr.length; i++) {
      ssidCharCodeArr.push(ssidstr.charCodeAt(i))
    }

    var bssid_strArr = bssidstr.split(':')
    var bssid_numArr = []
    for(let i in bssid_strArr){
      bssid_numArr.push(parseInt(bssid_strArr[i],16))
    }

    var ipaddress_strArr = ipaddressstr.split('.')
    var ipaddress_numArr = []
    for(let i in ipaddress_strArr){
      ipaddress_numArr.push(parseInt(ipaddress_strArr[i],10))
    }

    var passwordCharCodeArr = []
    for (let i = 0; i < ssidstr.length; i++) {
      passwordCharCodeArr.push(passwordstr.charCodeAt(i))
    }

    var ssid = new Uint8Array(ssidCharCodeArr)
    var ssid_len = new Uint8Array([ssid.length]) 
    var ssid_crc8 = new Uint8Array([crc8.crc8(ssid)])
    var bssid = new Uint8Array(bssid_numArr)
    var bssid_crc8 = new Uint8Array([crc8.crc8(bssid)])
    var ipaddress = new Uint8Array(ipaddress_numArr)
    var ipaddress_len = new Uint8Array([ipaddress.length])
    var password = new Uint8Array(passwordCharCodeArr)
    var password_len = new Uint8Array([password.length]) 
    var totaldata_len = new Uint8Array([5 + ipaddress_len[0] + password_len[0]])
    var totaldata_xor = 0x00;

    totaldata_xor ^= totaldata_len
    totaldata_xor ^= password_len
    totaldata_xor ^= ssid_crc8
    totaldata_xor ^= bssid_crc8

    


    console.log(ssid)
    console.log(ssid_len)
    console.log(ssid_crc8)
    console.log(ssid_crc8[0].toString(16))
    console.log(bssid)
    console.log(bssid_crc8[0].toString(16))
    console.log(ipaddress)
    console.log(password)
    console.log(password_len)
    console.log();

    var DatumData = new Uint8Array(5)
    DatumData[0] = totaldata_len[0]
    DatumData[1] = password_len[0]
    DatumData[2] = ssid_crc8[0]
    DatumData[3] = bssid_crc8[0]
    DatumData[4] = totaldata_xor[0]



  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})