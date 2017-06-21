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
//2017年4月6日 --- 验证生成了 ，window.mesh1
//2017年4月6日 --- 将渲染页面迁移进来，并去掉背景
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        lightState = false;
        csrmesh.storeMesh();
        csrmesh.initMesh();
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

        //document.getElementById("leftshow_b").onclick = leftshow;
        document.getElementById("showGroups_b").onclick = showGroups;
        document.getElementById("showLights_b").onclick = showLights;
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
        alert(JSON.stringify(window.mesh1))
        //document.getElementById("deviceList").value += "ssss"
        //alert(window.mesh1);
        //window.mesh = csrmesh.initMesh();
    }catch(e){
        alert(e);
    }
}

var fmeshL = function(){
    alert(window.localStorage.getItem('mesh'));
}
var fmeshW = function(){
    alert(JSON.stringify(window.mesh1));
    //已经生效 --- 2017年4月6日
}



var startScan = function(){
    var success = function(ble){
        var list = document.getElementById("deviceList");

        if(listShow == "associate"){
            list.innerHTML = "";
            listShow = "scan";
        }else{
            //var bleDevice = ble.slice(7,8);
            //ble.replaceAll
            console.log(ble);//"{'isNew':false,'name':'CSRmesh','address':'00:02:5B:00:15:84','rssi':-67}"
            //var bleDevice = JSON.parse(ble); // ble 应该是一个非字符串的值，跟JAVA传过来未做转换有关！！！
            // 转换过来会被全部大写？？

            //if(bleDevice == "t"){
            //    list.innerHTML += "new "+(ble);
            //}else{
            //    list.innerHTML += "old "+(ble);
            //}
            //if(bleDevice == "t"){
            //if(bleDevice.isNew || bleDevice.ISNEW){
            if(ble.isNew || ble.ISNEW){
                //list.innerHTML +=(ble);
                var deviceFind = document.createElement("tr");

                deviceFind.innerHTML = "<td id="+ble.address+">"+"address :  "+ble.address+"\n设备："+ble.name+"</td>";

                deviceFind.onclick=(function(){
                    return function(aa){
                        //csrmesh.associateNew(array.uuidHash,function(device){console.log(device.name);alert("success in associateNew"+this.uuidHash||array.uuidHash)},function(){alert("error in associateNew"+this.uuidHash||array.uuidHash)});
                        csrmesh.findMesh(ble.address,function(){console.log("连接成功！")},function(){console.log("连接失败！")});
                        if(aa&&aa.stopPropagation){//非IE浏览器
                            aa.stopPropagation();
                        }else{//IE浏览器
                            window.event.cancelBubble=true;
                        }
                    }
                })();
                list.appendChild(deviceFind);
                //list.innerHTML +="name--"+ble.name+"address--"+ble.address+"rssi--"+ble.rssi;
            }else{
                //list.innerHTML += typeof ble+"  "+typeof ble.toString();

            }
        }


    };
    var error = function(error){
        alert("error in ");
    };
    csrmesh.startScan(success,error);
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
        csrmesh.findMesh("00:02:5B:00:15:85");
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
    // i = (i+1)%groupId.length
}



var uuidHash ;
var listShow = "associate";
var getAssociableDevice = function(){
    var success = function(array){
        //alert("共"+array.size()+"个，第一个device :"+array(0));
        //uuidHash = array.split(",");
        // 2017年4月1日 应该上面改为数组

        //for(var i=0 in uuidHash){
        //    alert("callback success of associate :"+array+" JS uuidHash is : "+uuidHash[i]);
        //}

        alert("获得"+array.name+array.uuidHash);
        //在页面上显示出来，
        //deviceList 中显示出来
        {
            var list = document.getElementById("deviceList");
            //将新发现的设备显示到页面上
            if(listShow == "associate"){
                var deviceFind = document.createElement("tr");
                deviceFind.innerHTML = "<td id="+array.uuidHash+">"+"灯："+array.name+"uuid:"+array.uuidHash+"</td>";
                deviceFind.onclick=(function(){
                    return function(aa){
                            csrmesh.associateNew(array.uuidHash,function(device){console.log(device.name);alert("success in associateNew"+this.uuidHash||array.uuidHash)},function(){alert("error in associateNew"+this.uuidHash||array.uuidHash)});
                        if(aa&&aa.stopPropagation){//非IE浏览器
                            aa.stopPropagation();
                        }else{//IE浏览器
                            window.event.cancelBubble=true;
                        }
                    }
                })();
                list.appendChild(deviceFind);
            }else{
                list.innerHTML = "" ;
                listShow = "associate";
            }
        }

        //uuidHash = array(0);//插件功能未完善。
        //document.getElementById("deviceList").innerText = "uuidHash is ："+uuidHash;
        };
    var error = function(){
        alert("error in getAssociableDevice callback");
    };
    try{//不需要 deviceID -- 2017年2月24日
        csrmesh.getAssociableDevice(/*deviceId,[2,3],*/success, error);//绑定到2，3组上
    }catch(e){
        alert("error in csrmesh.getAssociableDevice : "+e);
    }

    //2017年4月1日
//    return uuidHash
}

var associatDevice = function(uuid){
    var success = function(newDevice){
        //@param newDevcie{
        //      uuidHash:  ,
        //      deviceId:  ,
        //      name:  ,
        // }
        //
        alert(""+newDevice.name+" with "+newDevice.uuidHash+" id　："+newDevice.deviceId);
        //2017年4月1日 应该回调函数再慢一些，返回绑定成功后的设备uuidHash,以及deviceId
    }
    var error = function(){
        alert("error in associatDevice");
    }
    csrmesh.associateNew(parseInt(uuid)/*||1445519578*/,success,error);//2017年2月25日,测试绑定功能
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

var leftshow = function(){
    document.getElementById('settingSlider').style.display='none'
    document.getElementById('body').onclick = function(e){
        if(e.clientX > document.getElementById('leftSlider').offsetWidth){
//                    document.getElementById('settingSlider').style.display='none'
            document.getElementById('leftSlider').style.display='none'
            document.getElementById("body").onclick = null;
        }
    }
    document.getElementById('leftSlider').style.display === ''?document.getElementById('leftSlider').style.display='none':document.getElementById('leftSlider').style.display='';
}
var rightshow = function(){
    document.getElementById('leftSlider').style.display='none'
    document.getElementById('body').onclick = function(e){
//                console.log(e.clientX+" "+document.getElementById('settingSlider').offsetLeft+" "+document.getElementById('settingSlider').offsetWidth+" "+document.getElementById('settingSlider').clientLeft)

        if(e.clientX < document.getElementById('settingSlider').offsetLeft){
            document.getElementById('settingSlider').style.display='none'
//                    document.getElementById('leftSlider').style.display='none'
            document.getElementById("body").onclick = null;
        }

    }
    document.getElementById('settingSlider').style.display === ''?document.getElementById('settingSlider').style.display='none':document.getElementById('settingSlider').style.display='';
}

var showGroups = function(){
    var groupButton = document.getElementById("groupControl");
    //alert("showgroups"+JSON.stringify(window.mesh1))
//            document.getElementById("groupControl").style.display = ''
    if(groupButton.children.length <1){
//                console.time("dom create")
        var groups = window.mesh1.groups;
        //alert(groups);
        //alert(window.mesh1);
        //alert(groups.length);
        for(var i =0 ;i<groups.length;i++){

            (function(i){
                var newChild = document.createElement("tr")
                var aaa = "group"+groups[i].deviceId;
                newChild.innerHTML = "<td style='width: 50%;height:50px;border-bottom-color: bisque'>"+groups[i].name+"</td>"+"<td id="+aaa+" style='width: 50%;'>"+groups[i].deviceId+"</td>"
                //newChild.innerHTML = "<td style='width: 50%;height:50px;border-bottom: dashed;;border-bottom-color: bisque'>"+groups[i].name+"</td>"+"<td id="+aaa+" style='width: 50%;'>"+groups[i].deviceId+"</td>"
                newChild.setAttribute("value",groups[i].deviceId);
                newChild.setAttribute("style","width:100%;")
                //2017年4月8日 原本准备用来获取 deviceId的，现在应该不用了
                newChild.onclick=(function(){
                    return function(aa){
                        console.log(aa.target.parentNode.getAttribute('value'))
                        //alert("onclick")
                        if(aa&&aa.stopPropagation){//非IE浏览器
                            aa.stopPropagation();
                        }
                        else{//IE浏览器
                            window.event.cancelBubble=true;
                        }
                    }
                })()

                groupButton.appendChild(newChild)
                console.log(aaa)
                //alert(intToHex(parseInt(groups[i].color)))
                try{
                    $("#"+aaa).colorpicker({
                        //color: groups[i].color,//此处的color与 colorSpace 保持一致
                        color: (parseInt(groups[i].color))?intToHex(parseInt(groups[i].color)):(groups[i].color),
                        colorSpace: 'hsl',
                        displayColor:'hex',
                        labels:true
                    });
                    $("#"+aaa).on('newcolor',function(ev,color){
                        //console.log(ev)
                        console.log("the deviceId is "+groups[i].deviceId)
                        console.log(color.toString('hsl'))

                    //   2017年4月6日
                    //    加上更改颜色、发送颜色更改的指令
                        try{
                            //csrmesh.setColor(groups[i].deviceId,color.toString('rgb'));//真正需要变化的应该是这里
                            //2017年4月8日 rgbToColor(color.toString('rgb'))
                            csrmesh.setColor(groups[i].deviceId,parseInt( color.toString('rgb').slice(1),16));//真正需要变化的应该是这里
                            //document.getElementsByTagName("body").backgroundcolor = color.toString('rgb');
                            csrmesh.setBrightness(parseInt(groups[i].deviceId),parseFloat(color.toCssString("hsl").split('%')[1].split(',')[1]));
                            $("body").css("background-color",color.toString("rgb"));
                            //只能使用 body 了，其它方法都不对

                            //var rgb_r = parseInt(color.toCssString("rgb").split('(')[1].split(')')[0].split(",")[0]);
                            //var rgb_g = parseInt(color.toCssString("rgb").split('(')[1].split(')')[0].split(",")[1]);
                            //var rgb_b = parseInt(color.toCssString("rgb").split('(')[1].split(')')[0].split(",")[2]);
                            //var hsl_y = parseFloat(color.toCssString("hsl").split('%')[1].split(',')[1])*2.55;

                            //var b = ((rgb_b - hsl_y)/1.772/0.564)+hsl_y;
                            //var r = (rgb_r - hsl_y)/1.402/0.713 + hsl_y;
                            //var g = (hsl_y - 0.299*r - 0.114*b)/0.587;
                            //csrmesh.setColor(groups[i].deviceId,parseInt(rgb_r)<<16+ parseInt(rgb_g)<<8+ parseInt(rgb_b));//真正需要变化的应该是这里

                            //csrmesh.setBrightness(groups[i].deviceId,parseFloat(color.toCssString("hsl").split('%')[1].split(',')[1]));
                        }catch(e){
                            alert(e);
                        }
                    })
                }catch(e){
                    alert(e)
                }

            })(i);
        }
//                console.timeEnd("dom create")
    }else{
        //alert("showGroups not success")
        groupButton.innerHTML='';
    }
//            document.getElementById("sigleControl").style.display = 'none'
    document.getElementById("sigleControl").innerHTML='';
}

//2017年4月8日
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return "#"+Number(parseInt(h*255)).toString(16)+Number(parseInt(s*255)).toString(16)+Number(parseInt(l*255)).toString(16);
}

var showLights = function(){
    var groupButton = document.getElementById("sigleControl");

//            document.getElementById("sigleControl").style.display = ''
    if(groupButton.children.length <1){
        var lights = window.mesh1.lights;
        for(var i =0 ;i<lights.length;i++){
            (function(i){
                var newChild = document.createElement("tr")
                var aaa = "light"+lights[i].deviceId
                newChild.innerHTML = "<td  style='width: 50%;'>"+lights[i].name+"</td>"+"<td id="+aaa+" style='width: 50%;'>"+lights[i].deviceId+"</td>"
                //newChild.setAttribute("value",lights[i].deviceId);//使用失败
                newChild.setAttribute("style","width:100%;")
                newChild.onclick=(function(){
                    return function(aa){
                        //console.log(aa.target.parentNode.getAttribute('value'))
                        if(aa&&aa.stopPropagation){//非IE浏览器
                            aa.stopPropagation();
                        }
                        else{//IE浏览器
                            window.event.cancelBubble=true;
                        }
                    }
                })()
                console.log(aaa)
                //alert(intToHex(parseInt(lights[i].color)));
                groupButton.appendChild(newChild)
                $("#"+aaa).colorpicker({
                    color:(parseInt(lights[i].color))?intToHex(parseInt(lights[i].color)):(lights[i].color),
                    colorSpace: 'hsl',
                    displayColor:'hex',
                    labels:true
                });

                $("#"+aaa).on('newcolor',function(ev,color){
                    console.log(ev)
                    console.log(color.toString('hsla'))
                    // 将颜色存起来
                    console.log(lights[i].deviceId);
                    try{
                        //csrmesh.setColor(parseInt(lights[i].deviceId),color.toString('rgb'));
                        csrmesh.setColor(parseInt(lights[i].deviceId),parseInt( color.toString('rgb').slice(1),16));
                        //parseInt( color.toString('rgb').slice(1),16)
                        console.log("getDevcieId is : "+lights[i].deviceId + " type : "+typeof lights[i].deviceId);
                        csrmesh.setBrightness(parseInt(lights[i].deviceId),parseFloat(color.toCssString("hsl").split('%')[1].split(',')[1]));
                        $("body").css("background-color",color.toString("rgb"));
                    }catch(e){
                        alert(e);
                    }
                })
            })(i);
        }
    }else{
        groupButton.innerHTML='';
    }
//            document.getElementById("groupControl").style.display = 'none'
    document.getElementById("groupControl").innerHTML='';
}
//2017年4月7日 --- int 转成 #
var intToHex = function(color){
    //if(color[0] == "#"){return color}
    //var result = "#";
    var result = "";
    var hex = Number(color).toString(16);
    console.log(hex)
    for(var i=0;i<6-hex.length;i++){
        result+="0";
    }
    hex = result+hex;
    console.log(hex)
    //return result+hex;
    //return rgbToHsl(color >>16 && 0xFF, color >>8 && 0xFF ,color && 0xFF)
    return rgbToHsl(parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16));
};
app.initialize();