
var app = {
    // Application Constructor
    initialize: function() {
        //this.bindEvents();
        lightState = false;
        //csrmesh.storeMesh();
        //csrmesh.initMesh();
    },
    onDeviceReady: function() {
        try{
            //csrmesh.initMesh();
            console.log("csrmesh init success");
            mesh = window.mesh1;
            console.log(mesh)
            console.log("init mesh after deviceReady success on app");
            // 加载远程页面
            loadRomoteWeb();
        }catch(e){
            console.log("csrmesh init error"+e);
        }
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};
app.initialize();
//var newGroupIndex = 5;

document.addEventListener("deviceready",function(){
    try{
        csrmesh.initMesh();
        console.log("csrmesh init success");
        mesh = window.mesh1;
        console.log(mesh)
        console.log("init mesh after deviceReady success on document");
        loadRomoteWeb();
    }catch(e){
        console.log("csrmesh init error"+e);
    }
},false);

function loadRomoteWeb(){
    try{
        //var data1 = '<div data-role="page" id="scanPage" data-position="fixed" data-tap-toggle="false" style="text-transform: none; "><div data-role="header" data-position="fixed" data-tap-toggle="false"><h1>扫描设置</h1></div><!-- /header --><div role="main" class="ui-content"><div data-role="controlgroup" data-type="horizontal"><a data-role="button" id="startScan" data-inline="true" class="ui-btn-inline">开始扫描</a><a data-role="button" id="stopScan" data-inline="true" class="ui-btn-inline">停止扫描</a><a data-role="button" id="findAssociat" data-inline="true" class="ui-btn-inline">绑定扫描</a></div><p>   </p><div><ul data-role="listview" id="deviceList"><!--<li class="devicePrepar ui-li-has-alt "><a href="#" class="ui-btn"><h3>CSRMESHlight</h3><td>00:23:32:67:89</td></a><a href="#controlPage" name="kkk" class="connect ui-btn ui-btn-icon-notext ui-icon-action" ></a></li>--></ul></div></div><!-- /content --><div data-role="footer" data-position="fixed" data-tap-toggle="false"><div data-role="navbar"><ul><li><a href="#">扫描</a></li><li><a href="#controlPage"class="controlPageButton">控制</a></li><li><a href="#settingPage" class="settingBottom">设置</a></li></ul></div></div><!-- /footer --></div>';
        // 上面的为不支持的字符串
        var data1 = '<div data-role="header" data-position="fixed" data-tap-toggle="false"><h1>扫描设置</h1></div><!-- /header --><div role="main" class="ui-content"><div data-role="controlgroup" data-type="horizontal"><a data-role="button" id="startScan" data-inline="true" class="ui-btn-inline">开始扫描</a><a data-role="button" id="stopScan" data-inline="true" class="ui-btn-inline">停止扫描</a><a data-role="button" id="findAssociat" data-inline="true" class="ui-btn-inline">绑定扫描</a></div><p>   </p><div><ul data-role="listview" id="deviceList"><!--<li class="devicePrepar ui-li-has-alt "><a href="#" class="ui-btn"><h3>CSRMESHlight</h3><td>00:23:32:67:89</td></a><a href="#controlPage" name="kkk" class="connect ui-btn ui-btn-icon-notext ui-icon-action" ></a></li>--></ul></div></div><!-- /content --><div data-role="footer" data-position="fixed" data-tap-toggle="false"><div data-role="navbar"><ul><li><a href="#">扫描</a></li><li><a href="#controlPage"class="controlPageButton">控制</a></li><li><a href="#settingPage" class="settingBottom">设置</a></li></ul></div></div>';
        var data2 = '<div><h1>扫描设置</h1></div><!-- /header --><div ><div><a class="ui-btn-inline">开始扫描</a><a class="ui-btn-inline">停止扫描</a><a class="ui-btn-inline">绑定扫描</a></div><p>   </p><div><ul><!--<li class="devicePrepar ui-li-has-alt "><a href="#" class="ui-btn"><h3>CSRMESHlight</h3><td>00:23:32:67:89</td></a><a href="#controlPage" name="kkk" class="connect ui-btn ui-btn-icon-notext ui-icon-action" ></a></li>--></ul></div></div><!-- /content --><div ><div ><ul><li><a href="#">扫描</a></li><li><a href="#controlPage"class="controlPageButton">控制</a></li><li><a href="#settingPage" class="settingBottom">设置</a></li></ul></div></div>';

        //var data = "<div style='background:red'>abcdsadfa</div>";// 可生成
        //$("body").innerHTML = data;
        //document.getElementsByTagName("body")[0].innerHTML = data;// 可生成
        //var data = '<div class="chenliang">陈亮</div>';//可以
        //var data = '<div class="chenliang">陈亮</div>';//可以,加样式测试 --- 成功
        //document.body.innerHTML = data1; // 成功，准备测试，是否没有将jqm 的css样式加载进来
        //document.body.innerHTML = data2;// 测试有无加载上 JQM 的样式;略微有所不同，猜测可能是class也删除的原因；
        //document.body.innerHTML = data1;
        //$('body').listview('refresh');
        //$("body").innerHTML = data;// 好像可用性不好，不能使用
        //var myDiv = document.createElement('div');
        //myDiv.innerHTML = data1;
        //document.body.appendChild(myDiv);
        console.log("加载页面动作启动");

        // 使用普通H5编写页面
        var data = '<div style="width: 100%;height: 100%;"><label id="show" style="width:80%;height: 30%;">显示内容</label><button id="scan">扫描</button><button id="conn">连接</button><button id="asso">绑定</button> </div>';
        document.body.innerHTML = data;
        // JS 代码也靠解析出来
        var script = document.createElement("script");
        script.type = "text/javascript";
        //script.src = "47.93.228.84:3315/js/onclick.js";
        script.appendChild(document.createTextNode('$(document).on("click","#scan",function(){ $("#show").val("点击"); try{ csrmesh.startScan(function(){console.log("成功点击")}, function () { console.log("error 点击");  }); }catch(e){ console.log(e);}})'));
        document.body.appendChild(script);
    }catch(e){
        console.log("加载页面出错 ："+e);
    }

    /*$.ajax({
        url:"http://47.93.228.84:3315/remoteLoad",
        type:"GET",
        success:function(data){
            console.log("success in get data ");
            $("body").innerHTML = data;
        },
        error:function(e){
            console.log("error",e);
        }
    })*/

}