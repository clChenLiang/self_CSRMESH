/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/*修改日志
* 2017年4月1日 ---
*
* */
//建立一个灯泡JSON队列；

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        lightState = false;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById("blueClick").onclick = blueClick;
        document.getElementById("startScan").onclick = startScan;
        document.getElementById("stopScan").onclick = stopScan;
        document.getElementById("findMesh").onclick = findMesh;
        document.getElementById("setPower").onclick = setPower;
        document.getElementById("setColor").onclick = setColor;
        // document.getElementById("setBrightness").onclick = setBrightness;
        document.getElementById("getAssociableDevice").onclick = getAssociableDevice;
        document.getElementById("associateDevice").onclick = associatDevice;
        document.getElementById("setGroup").onclick = setGroup;
        document.getElementById("getDevcieId").onclick = getDeviceID;
        document.getElementById("store").onclick = store;
        document.getElementById("read").onclick = read;
        document.getElementById("color").onclick = reloadColorPage;
        document.getElementById("meshL").onclick = fmeshL;
        document.getElementById("meshW").onclick = fmeshW;
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }
};

var reloadColorPage = function(){
    window.location.replace("./multi.html");
}

var lightState = false;
var groupBelong = true;
var mDeviceID = 0;
/*2017年3月14日*/
var store = function(){
    csrmesh.storeMesh();
}
var read = function(){
    try{
        csrmesh.storeMesh();
        alert(csrmesh.initMesh())
        //document.getElementById("deviceList").value += "ssss"
        //alert(window.mesh1);
    }catch(e){
        alert(e);
    }
}

var fmeshL = function(){
    alert(window.localStorage.getItem('mesh'));
}
var fmeshW = function(){
    alert(JSON.stringify(window.mesh1));
}



var startScan = function(){
    csrmesh.startScan();
}

var blueClick = function(){
    if(groupBelong){
        csrmesh.setGroups()
    }
}

var stopScan = function(){
    csrmesh.stopScan();
}

var findMesh = function(){
    try{
        csrmesh.findMesh("00:02:5B:00:15:84");
    }catch(e){
        alert("error in csrmesh.findMesh :"+e);
    }
}

var setPower = function(){
    // alert("setPower in wex5");

    try{
        csrmesh.setPower(mDeviceID,lightState?"on":"off");
    }catch(e){
        alert("error in csrmesh.setPower :"+e);
    }
    lightState = !lightState;
}
var groupId = [0,1,2,3,4];
var i =0 ;
var setColor= function(){

    try{
        var deviceId = groupId[i];
        alert("groupID send to control color :"+deviceId);
        // csrmesh.setColor(0,-16777216);/*255 0  8388607 16700000 65280 */
        var color = [255, 0 , 8388607, 16700000, 65280][Math.floor(Math.random()*5)]
        csrmesh.setColor(deviceId,color);
        // csrmesh.setColor(0,-16777216);
    }catch(e){
    }
    if(i<groupId.length){
        i = i+1;
    }else{
        i=0;
    }

}



var uuidHash ;
var getAssociableDevice = function(){
    var success = function(array){
        //alert("共"+array.size()+"个，第一个device :"+array(0));
        uuidHash = array.split(",")[0];
        // 2017年4月1日 应该上面改为数组
        alert("callback success of associate :"+array+" JS uuidHash is : "+uuidHash);

        //uuidHash = array(0);//插件功能未完善。
        //document.getElementById("deviceList").innerText = "uuidHash is ："+uuidHash;
    }
    var error = function(){
        alert("error in getAssociableDevice callback");
    }
    try{//不需要 deviceID -- 2017年2月24日
        csrmesh.getAssociableDevice(/*deviceId,[2,3],*/success, error);//绑定到2，3组上
    }catch(e){
        alert("error in csrmesh.getAssociableDevice : "+e);
    }

    //2017年4月1日
//    return uuidHash
}

var associatDevice = function(){
    var success = function(){
        alert("associatDevice from cordova success");
        //2017年4月1日 应该回调函数再慢一些，返回绑定成功后的设备uuidHash,以及deviceId
    }
    var error = function(){
        alert("error in associatDevice");
    }
    csrmesh.associateNew(parseInt(uuidHash)/*||1445519578*/,success,error);//2017年2月25日,测试绑定功能
    //2017年2月27日 ，增加回调函数，返回绑定的deviceId

}

var setDeviceToGroups = function(deviceId,groups){
    csrmesh.setGroups(deviceId,groups);

}

var getDeviceID = function(){
    var success = function(deviceID){
        alert("getDevicID is :"+deviceID);
        mDeviceID = deviceID;
        groupId.push(deviceID);
        csrmesh.storeMesh();//2017年4月1日
    }
    var error = function(){
        alert("error in getDeviceID ");
    }
    csrmesh.getDeviceId(parseInt(uuidHash),success,error);
}

var setGroup = function(){
    alert("send to "+mDeviceID +" with "+groupBelong);
    if(groupBelong){
        setDeviceToGroups(mDeviceID,[1,3]);
    }else{
        setDeviceToGroups(mDeviceID,[2,4]);
    }
    groupBelong = !groupBelong;
}
app.initialize();