
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
    $.ajax({
        url:"http://47.93.228.84:3315/remoteLoad",
        type:"GET",
        success:function(data){
            console.log("success in get data ");
            $("body").innerHTML = data;
        },
        error:function(e){
            console.log("error",e);
        }
    })
}