Page({
data: { 
 fostered_catlist: [
{ name:"杰希"},
{ name:"土谦"},
],
 unknown_catlist: [
],
 dead_catlist: [
],

dshCats:[],

tczCats:[],
ychCats:[],
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0,
    navbar: ['本部及东校区', '独墅湖校区', '阳澄湖校区'],
    currentTab: 0,
  },
   navbarTap: function (e) {
     this.setData({
       currentTab: e.currentTarget.dataset.idx
     })
   },

   iconType: [
     'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
   ],

  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  },

  //转发跳转页面设置
  onLoad: function (options) {
    
    getAllCatsInfo()
    if (options.pageId) {
      wx.navigateTo({
        url: '/pages/cats/' + options.pageId + '/' + options.pageId,
      })
    }

  },

  //转发此页面的设置
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      path: 'pages/index/index',  // 路径，传递参数到指定页面。
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  // 转发到朋友圈
  onShareTimeline: function (res) {
    if (ops.from === 'button') {
        // 来自页面内转发按钮
        console.log(ops.target)
      }
      return {
        path: 'pages/index/index',  // 路径，传递参数到指定页面。
        success: function (res) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
  },

  // 搜索栏输入名字后页面跳转
  bindconfirmT: function (e) {
    console.log("e.detail.value");
    if(e.detail.value) {
    wx.navigateTo({
      url: '/pages/cats/' + e.detail.value + '/' + e.detail.value,
    })
  }
   },
   copyTBL: function (e) {
     var self = this;
     wx.setClipboardData({
       data: '北大猫协',//需要复制的内容
       success: function (res) {
         // self.setData({copyTip:true}),

       }
     })
   },

})


// //TODO  初始化
// var dshCats= [];//存放独墅湖校区文件夹下所有猫信息
// var tczCats=[];//存放天赐庄校区文件夹下所有猫信息
// var ychCats=[];//存放阳澄湖校区文件夹下所有猫信息

//获取所有的文件夹信息
//定义cat信息
//name cat name
//images 猫所有的照片全路径
//contents 记录猫的描述相关内容，以行为子元素的数组
function Cat(name,images,contents ){
  this.name=name;
  this.images=images;
  this.contents=contents
}
var topDirs = ["/pages/cats/dsh","/pages/cats/tcz","/pages/cats/ych"]
function getAllCatsInfo(){
    //独墅湖校区
    var dshDir = "/pages/cats/dsh"
    for(var t=0;t<topDirs.length;t++){
      wx.getFileSystemManager().readdir({
        dirPath:dshDir,
        success(res){
          //获取二级目录的文件夹
          var dirs =res.dirs
         for(var i=0;i<dirs.length;i++){
          
           dp=dirs[i].dirPath//文件夹路径
           fn=dirs[i].name//文件夹名称
           wx.getFileSystemManager().readdir({
             dirPath:dp,
             success(res){
               //获取三级目录的文件
               files=res.files
               var cat = new Cat();
               cat.name=fn
               var images = new Array()
               var contents =  new Array
               for(var i=0;i<files.length;i++){
                 var fname =""
                 var fpath =""
                 fname=files[i].name
                 fpath=files[i].path
                 log.console(fname,fpath)
                  if(fname.indexOf("jpg")){
                    images.push(fpath)
                  }
                  if(fname.indexOf("txt")){
                    //按行读取文本内容
                    wx.getFileSystemManager().readFile({  //读取文件
                      filePath: fd+ '/'+fname,
                      encoding: 'utf-8',
                      success: res => {
                        var data =""
                        data=res.data
                        console.log(res.data)
                        lines=data.split(/\r\n/g)
                        contents=lines
                      },
                      fail: console.error
                    })
                
                  }
               }
               cat.images=images
               cat.contents=contents
               if(t=0){
                dshCats.push(cat)
               }else if(t=1){
                tczCats.push(cat)
               }else{
                ychCats.push(cat)
               }
             }
           })
         }
        }
      })
      
    }
}

