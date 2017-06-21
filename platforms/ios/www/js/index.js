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
/*�޸���־
* 2017��4��1�� ---
*
* */
//����һ������JSON���У�
//2017��4��6�� --- ��֤������ ��window.mesh1
//2017��4��6�� --- ����Ⱦҳ��Ǩ�ƽ�������ȥ������
var app = {
    // Application Constructor
    initialize: function() {
        //this.bindEvents();
        lightState = false;
        //csrmesh.storeMesh();
        //csrmesh.initMesh();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        try{
            //csrmesh.initMesh();
            console.log("csrmesh init success");
            mesh = window.mesh1;
            console.log(mesh)
            console.log("init mesh after deviceReady success")
        }catch(e){
            console.log("csrmesh init error"+e);
        }

        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');
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
        console.log("init mesh after deviceReady success")
    }catch(e){
        console.log("csrmesh init error"+e);
    }

},false)

//var mesh = {
//    "meshName":"cl",
//    "lights":[
//        {"name":"light_Lab","uuidHash":"ssssssss","deviceId":37265,"color":"#74aab5","power":0,"brightness":0,"maxGroups":4,"groups":[3,2,0]},
//        {"name":"light1","uuidHash":"bbbbbbbb","deviceId":37267,"color":"#07ec94","power":0,"brightness":0,"maxGroups":4,"groups":[1,2,3,0]}],
//    "groups":[
//        {"name":"group_A","deviceId":0,"lights":[37265,37267],"color":"#aee6a2","power":0,"brightness":0},
//        {"name":"group_B","deviceId":1,"lights":[37267],"color":"#f9bd8c","power":0,"brightness":0},
//        {"name":"group3","deviceId":2,"lights":[37265,37267],"color":"#2abd8c","power":0,"brightness":0},
//        {"name":"group4","deviceId":3,"lights":[37265],"color":"#23b38c","power":0,"brightness":0}]
//}//2017��4��19�� ����ʱʹ�õ� mesh ,�ջᱻ��Ϊ window.mesh ���� csrmesh.getGroups()

//try{
//    //csrmesh.initMesh();
//    console.log("csrmesh init success");
//    mesh = window.mesh1;
//    console.log(mesh)
//}catch(e){
//    console.log("csrmesh init error"+e);
//}

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
    var a = Number(parseInt(h*255)).toString(16);
    var b = Number(parseInt(s*255)).toString(16);
    var c = Number(parseInt(l*255)).toString(16);

    return "#"+ (a.length>1?a:("0"+a))+ (b.length>1?b:("0"+b))+ (c.length>1?c:("0"+c));
}
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

$(document).on("deviceready","document",function(e,d){
    console.log("deviceready form document");
})

// 弹出编辑灯泡和组的设置
//     只是渲染页面而已
$(document).on("click",".edit",function(event,data){
    //console.log(event.target.name ,event.target);
    //groupSet
    //console.log(event.target.parentNode.parentNode.id)
    // �ж���Դ
    if(event.target.parentNode.parentNode.id == "groupList"){
        console.log("open groupSet")
        $("#groupSet").removeAttr("hidden");
        //console.log(event.target.parentNode.childIndex[0].childIndex[0])
        //$("#groupSet input")[0].val("bbbb");
        console.log(($(event.target.parentNode)));//�������
        // event.target.parentNode
        //console.log($(event.target.parentNode).children("h3"))
        //console.log($(event.target.parentNode).find("h3").context.outerHTML)
        console.log( $(event.target.parentNode).find("h3").context.outerText)//�ַ���
        var string = ($(event.target.parentNode).find("h3").context.outerText).trim().split(/\s+/);
        console.log(string);
        var lights = string.splice(1,string.length-2);
        console.log(lights)

        //$("#groupSet input:first").attr("value",$(event.target).context.name)
        $("#groupSet input:first").attr("value",string[0]);
        //$("#groupSet input:first").attr("value",string[0]);
        //console.log($(event.target.parentNode).find("h3").attr("name"))
        $("#saveChangeG").attr("name",$(event.target.parentNode).find("h3").attr("name"));
        //$("#groupSet input:first").attr("name",);//�洢��� deviceId
        $("#groupSet fieldset label").remove();
        for(var light in mesh.lights){
            //<label>
            //    <input type="checkbox" name="cb0" value="37888">light1
            //        </label>
            var label = document.createElement("label");
            //$(label).innerHTML="alsdkfj"
            label.innerHTML = "<input type='checkbox' name='"+mesh.lights[light].deviceId+"' value='"+mesh.lights[light].deviceId+"'"+((lights.indexOf(""+mesh.lights[light].deviceId)>-1)?" checked>":">")+mesh.lights[light].name
            //lights.indexOf(""+mesh.lights[light].deviceId)>-1?" checked ":""+
            //console.log(lights.indexOf(""+mesh.lights[light].deviceId))
            //console.log((lights.indexOf(""+mesh.lights[light].deviceId)>-1)?" checked>":">") //
            $("#groupSet fieldset").append(label)
        }

        $("#groupSet").popup();
        console.log($("#groupSet"));

        $("#groupSet").popup("open");
    }
    else if(event.target.parentNode.parentNode.id == "lightList"){
        console.log("open lightList");
        $("#lightSet").removeAttr("hidden");
        var string = ($(event.target.parentNode).find("h3").context.outerText).trim().split(/\s+/);
        console.log(string);
        var groups =  string.splice(1,string.length-2);
        //    uuidHash = string[string.length-1]
        //    name = string[0]
        //    groups = string.splice(1,string.length-2);
        $("#lightSet input:first").attr("value",string[0]);
        $("#saveChangeL").attr("name",$(event.target.parentNode).find("h3").attr("name"));
        $("#lightSet fieldset label").remove();
        for(var group in mesh.groups){
            var label = document.createElement("label");
            label.innerHTML = "<input type='checkbox' name='"+mesh.groups[group].deviceId+((groups.indexOf(""+mesh.groups[group].deviceId)>-1)?"' checked>":"'>")+mesh.groups[group].name;
            $("#lightSet fieldset").append(label);
        }
        $("#lightSet").popup();
        $("#lightSet").popup("open");

    }

})



// 删除设备，由 csrmesh 根据设备号来决定删除什么
$(document).on("click",".deleteDevice",function(e,d){
    //���ֻ�ȡ deviceID �ķ�ʽ
    //console.log($(e.target.parentNode).find("#saveChangeG").attr("name"))
    //console.log($(e.target.parentNode).find(">a").attr("name"))
    try{
        csrmesh.deleteDevice(parseInt( $(e.target.parentNode).find(">a").attr("name") ) );
        console.log("deleteDevice : " + parseInt( $(e.target.parentNode).find(">a").attr("name")) );
    }catch(e1){
        console.log("deleteDevice error in line:158"+e1+"\n"+parseInt( $(e.target.parentNode).find(">a").attr("name") ))
    }
    // ���򿪵ĶԻ���ر�
    try{
        $("#groupSet").popup("close");
    }catch(e){
        $("#lightSet").popup("close");
    }
})

// 组设置 的 保存按钮
$(document).on("click","#saveChangeG",function(event,data){
    console.log("saveChange clicked");
    // �ֱ��ȡ deviceId ,��ȡ���֣��¶��ĵ���
    var newLights = [];
    $(event.target.parentNode).find("input:checked").each(function(){
        //console.log("has chose this "+$(this).context.name);//
        newLights.push( parseInt($(this).context.name) );
    });
    //console.log($(this).attr("name"));// deviceId
    //console.log($(event.target.parentNode).find("input:text").val());// ��ȡ�õ��µ�����
    // csrmesh.getGroup(); ��øĳ������ʽ
    try{
        console.log( "组："+parseInt(  $(this).attr("name") ) + " 重置："+ newLights.toString() )
        window.mesh1.getGroup(parseInt($(this).attr("name"))).name = $(event.target.parentNode).find("input:text").val();
        //window.mesh1.getGroup( parseInt(  $(this).attr("name") )).setLights(newLights);
        csrmesh.setLights(parseInt(  $(this).attr("name") ),newLights,function(e){console.log("组设置lights success:"+e)},function(e){console.log("组设置lights error:"+e)});
        csrmesh.storeMesh();
    }catch(e){
        console.log("save Group change error"+e)
    }
    //�ر� popup
    $("#groupSet").popup("close");
    //alert("ȷ��Ҫ");
    //���� alert ����
})// ���� �� light �Ĳ���

listShow = "associate"
/*
$(document).on("click","#saveChangeG",function(event,data){
    console.log("saveChange clicked");
    // �ֱ��ȡ deviceId ,��ȡ���֣��¶��ĵ���
    $(event.target.parentNode).find("input:checked").each(function(){
        console.log("has chose this "+$(this).context.name);//
    })
    //console.log($($(event.target.parentNode)).find("input:first").context.value)
    console.log($($($(event.target.parentNode)).find("input:first")));
    //console.log($(event.target.parentNode).childNodes.eq(1));
    console.log( $(event.target.parentNode));
    console.log($(this).attr("name"));// deviceId

    //�����ĺ�����ݴ洢����
    // window.mesh1.getLight().setGroup()
    // window.mesh1.getGroup().setLights()
    // �������� mesh �������� mesh �������޸�ֵ��ʹ֮�ָ�ԭ�ȵ����������̫������

    //�ر� popup
    $("#groupSet").popup("close");
    //alert("ȷ��Ҫ");
    //���� alert ����
})
*/

// 开始扫描
$(document).on("click","#startScan",function(e,d){
    var list = document.getElementById("deviceList");
    if(listShow == "associate"){
        list.innerHTML = "";
        listShow = "scan";
    }
        var success = function(ble){
            //var list = document.getElementById("deviceList");
            console.log(ble);//"{'isNew':false,'name':'CSRmesh','address':'00:02:5B:00:15:84','rssi':-67}"
            if(listShow == "associate"){
                return ;
            }
            if(ble.isNew || ble.ISNEW){
                //list.innerHTML +=(ble);
                var li = document.createElement("li");
                li.setAttribute("class","devicePrepar ui-li-has-alt ui-last-child");
                li.innerHTML = ' <a href="#" class="ui-btn"><h3>'+ble.name+'</h3><td>'+ble.address+'</td></a><a href="#controlPage" name="' + ble.address + '" class="connect ui-btn ui-btn-icon-notext ui-icon-action" ></a>'
                //li.innerHTML = ' <a href="#" class="ui-btn"><h3>'+"ble.name"+'</h3><td>'+"td address"+'</td></a><a href="#controlPage" name="' + "name address" + '" class="connect ui-btn ui-btn-icon-notext ui-icon-action" ></a>'
                $("#deviceList").append(li)
            }
        };
        var error = function(error){
            alert("error in ");
        };
        csrmesh.startScan(success,error);
});

// 选择 扫描到的设备 连接到 mesh 网上
$(document).on("click",".connect",function(e,d){
    //console.log( $(e.target.parentNode).find("td") )
    console.log("选择的设备 : "+$(this).attr("name"));
    //console.log(    $(e.target.parentNode).find("td").context.value );
    csrmesh.findMesh($(this).attr("name"),function(a){alert("findMesh "+a)},function(){});
    csrmesh.stopScan();
});

//扫描 associate 设备,连接对应的功能为新增 灯泡的对话框

//生成全部可控的灯泡组 和 灯泡  ---  用于控制灯光
// 1.点击  控制  按钮后触发
// 2.连接设备后, 触发
$(document).on("click",".controlPageButton",function(e,d){
    console.log( "groupControl has "+$("#groupControl").children().length );
    if(  $("#groupControl").children().length >0 ){
        //清空原先内容；
        //$("#groupControl").innerHTML='';
        $("#groupControl").empty();

    }
    if(  $("#lightControl").children().length >0 ){
        //$("#lightControl").innerHTML='';
        $("#groupControl").empty();
    }

    try{
        //var groups = window.mesh1.groups;
        var groups =mesh.groups;


        for(var i =0 ;i<groups.length;i++){
            (function(i){
                var newChild = document.createElement("tr")
                var aaa = "group"+groups[i].deviceId;
                //newChild.innerHTML = "<td style='width: 50%;height:50px;border-bottom: dashed;border-bottom-color: bisque'>"+groups[i].name+"</td>"+"<td id="+aaa+" style='width: 50%;'>"+groups[i].deviceId+"</td>"
                newChild.innerHTML = "<td style='width: 70%;height:50px;border-top:  solid;border-color: bisque;text-align-all:center'>"+groups[i].name+"</td ><td style='border-top:  solid;border-color: bisque;'></td><td style='border-top:  solid;border-color: bisque;'><a id="+aaa+" class=' ui-icon-right'>"+groups[i].deviceId+"</a>"+"</td>"
                newChild.setAttribute("value",groups[i].deviceId);
                newChild.setAttribute("style","width:100%;border-bottom: dashed;border-color:red")
                newChild.onclick=(function(){
                    return function(aa){
                        console.log(aa.target.parentNode.getAttribute('value'))
                        if(aa&&aa.stopPropagation){//非IE浏览器
                            aa.stopPropagation();
                        }
                        else{//IE浏览器
                            window.event.cancelBubble=true;
                        }
                    }
                })()

                $("#groupControl").append(newChild)
                console.log(groups[i].color)
                $("#"+aaa).colorpicker({
                    color: ( parseInt(groups[i].color) >= 0 )?intToHex(parseInt(groups[i].color)):(groups[i].color),
                    colorSpace: 'hsl',
                    displayColor:'hex',
                    labels:true
                });
                $("#"+aaa).on('newcolor',function(ev,color){
                    //console.log(ev)
                    console.log("the control deviceId is "+groups[i].deviceId);
                    //csrmesh.setColor();
                    csrmesh.setColor(parseInt(groups[i].deviceId),parseInt( color.toString('rgb').slice(1),16),function(a){console.log("setColor success in page")});
                    csrmesh.setBrightness(parseInt(groups[i].deviceId),parseFloat(color.toCssString("hsl").split('%')[1].split(',')[1]));
                    csrmesh.storeMesh()
                    $("#colorOfCurrent").css("background-color",color.toString("rgb"));
                    console.log(color.toString('hsla'))
                })
            })(i);
        }
        //var lights = window.mesh1.lights;
        var lights = mesh.lights;
        for(var i =0 ;i<lights.length;i++){
            (function(i){
                var newChild = document.createElement("tr")
                var aaa = "light"+lights[i].deviceId;
                newChild.innerHTML = "<td style='width: 70%;height:50px;border-top:  solid;border-color: rosybrown;text-align-all:center'>"+lights[i].name+"</td ><td style='border-top:  solid;border-color:rosybrown;'></td><td style='border-top:  solid;border-color: rosybrown;text-align: left' ><a id="+aaa+" class=' ui-icon-right'>"+lights[i].deviceId+"</a>"+"</td>"
                newChild.setAttribute("value",lights[i].deviceId);
                newChild.setAttribute("style","width:100%;")
                newChild.onclick=(function(){
                    return function(aa){
                        console.log(aa.target.parentNode.getAttribute('value'))
                        if(aa&&aa.stopPropagation){//非IE浏览器
                            aa.stopPropagation();
                        }
                        else{//IE浏览器
                            window.event.cancelBubble=true;
                        }
                    }
                })()
                $("#groupControl").append(newChild)
                console.log(aaa)
                $("#"+aaa).colorpicker({
                    color: ( parseInt(lights[i].color)>=0 )?intToHex(parseInt(lights[i].color)):(lights[i].color),
                    colorSpace: 'hsl',
                    displayColor:'hex',
                    labels:true
                });
                $("#"+aaa).on('newcolor',function(ev,color){
                    //console.log(ev)
                    console.log("the control deviceId is "+lights[i].deviceId)
                    console.log(color.toString('hsla'))
                    csrmesh.setColor(parseInt(lights[i].deviceId),parseInt( color.toString('rgb').slice(1),16),function(a){console.log("setColor success in page")});
                    csrmesh.setBrightness(parseInt(lights[i].deviceId),parseFloat(color.toCssString("hsl").split('%')[1].split(',')[1]));
                    csrmesh.storeMesh()
                    $("#colorOfCurrent").css("background-color",color.toString("rgb"));
                })
            })(i);
        }
    }catch(e){
        console.log("生成可控制设备时失败： error @line:365"+e)
    }


})

// 停止扫描 --- 用于连接设备、绑定设备后即行停止
$(document).on("click","#stopScan",function(e,d){
   csrmesh.stopScan();
});

// 生成 待绑定设备 的页面
//     name 属性为 uuidHash 供后续绑定使用
$(document).on("click","#findAssociat",function(e,d){
    console.log("findAssociat action begin ");

    var list = document.getElementById("deviceList");
    if(listShow == "scan"){
        list.innerHTML = "";
        listShow = "associate";
    }
    var success = function(ble){
        if(listShow == "scan"){
            return;
        }
        //var list = document.getElementById("deviceList");
        console.log(ble);//"{name:   , uuidHash:   }"
        var li = document.createElement("li");
        li.setAttribute("class","devicePrepar ui-li-has-alt ui-last-child");
        li.innerHTML = ' <a href="#" class="ui-btn"><h3>'+ble.name+'</h3><td>'+ble.uuidHash+'</td></a><a href="#" name="' + ble.uuidHash + '" class="associate ui-btn ui-btn-icon-notext ui-icon-action" ></a>'
        //li.innerHTML = ' <a href="#" class="ui-btn"><h3>'+"ble.name"+'</h3><td>'+"td address"+'</td></a><a href="#controlPage" name="' + "name address" + '" class="connect ui-btn ui-btn-icon-notext ui-icon-action" ></a>'
        $("#deviceList").append(li)
    };
    var error = function(error){
        alert("error in findAssociate:305");
    };
    csrmesh.getAssociableDevice(success,error);
})

//2017年4月22日  弹出灯泡设置(新增)对话框  popup
$(document).on("click",".associate",function(e,d){
    var success = function(deviceID){
        console.log("associate success with :"+deviceID.uuidHash);
        // 弹出灯泡设置 popup  ---  将其封装成一个单独的函数,传入参数 为 deviceID
        // deviceID
        $("#lightSet").removeAttr("hidden");
        $("#lightSet input:first").attr("value",window.mesh1.getLight(deviceID.deviceId).name);
        $("#saveChangeL").attr("name",""+window.mesh1.getLight(deviceID.deviceId) );//此处出的问题，将 deviceId 转化成了字符串
        //$("#saveChangeL").attr("name",window.mesh1.getLight(deviceID.deviceId) );
        $("#lightSet fieldset label").remove();
        for(var group in mesh.groups){
            var label = document.createElement("label");
            label.innerHTML = "<input type='checkbox' name='"+mesh.groups[group].deviceId+"'>"+mesh.groups[group].name;
            $("#lightSet fieldset").append(label);
        }
        $("#lightSet").popup();
        $("#lightSet").popup("open");
    }
    function error(e){
        console.log("error in associate -- line:319");
    }
    csrmesh.associateNew($(this).attr("name"),success,error);
    csrmesh.stopScan();
    csrmesh.storeMesh();
});

//2017年4月22日  保存灯泡设置
$(document).on("click","#saveChangeL",function(event,d){
    var newGroups = [];
    $(event.target.parentNode).find("input:checked").each(function(){
        //console.log("has chose this "+$(this).context.name);//
        newGroups.push( parseInt($(this).context.name) );

    });
    //console.log(newGroups)
    if(newGroups.length>4){
        $("#lightSet").popup("close");
        console.log("灯泡分的组超出范围！！！")
        return ;
    }
    try{
        window.mesh1.getLight(parseInt($(this).attr("name"))).name = $(event.target.parentNode).find("input:text").val();

        window.mesh1.getLight( parseInt(  $(this).attr("name") )).setGroups(newGroups);
        csrmesh.setGroups(parseInt(  $(this).attr("name") ),newGroups,function(a){console.log("配置分组：success")},function(a){console.log("配置分组：error"+a)});
        console.log("原 "+parseInt($(this).attr("name"))+" 保存灯泡设置: "+newGroups +" 名： "+$(event.target.parentNode).find("input:text").val());
        csrmesh.storeMesh();
    }catch(e){
        console.log("save Light change error"+e)
    }
    //�ر� popup
    $("#lightSet").popup("close");
})

//�л�ҳ�棬���� setting ҳ��������� -- ����鲿��
$(document).on("click",".settingBottom",function(){
    //console.log("alkdjf")
    //������� ˢ��
    $("#groupList li").remove();
    for(var gIndex in mesh.groups){
        var group = mesh.groups[gIndex];
        var li = document.createElement("li");
        var lightsInnerHtml = "";
        for(var light in group.lights){
            lightsInnerHtml +="<td>"+group.lights[light]+" </td>";
        }
        li.innerHTML = "<a href='#' class='ui-btn' ><h3 name='"+group.deviceId+"'>"+group.name+"</h3>"+lightsInnerHtml+"<p class='ui-li-aside'>"+group.deviceId+"</p></a>"+
            "<a href='#' name='"+group.deviceId+"' class='edit ui-btn ui-btn-icon-notext ui-icon-edit'></a>";
        li.setAttribute("class","ui-li-has-alt ui-last-child");

        $("#groupList").append(li);
    }

    //���ݹ��� ˢ��
    // ���� mesh ȥ��ȡ����
    $("#lightList li").remove();
    for(var lIndex in mesh.lights){
        var light = mesh.lights[lIndex];
        var li = document.createElement("li");
        var lightsInnerHtml = "";
        for(var group in light.groups){
            if(light.groups[group]){
                lightsInnerHtml +="<td>"+light.groups[group]+" </td>";
            }
        }
        li.innerHTML = "<a href='#' class='ui-btn'><h3 name='"+light.deviceId+"'>"+light.name+"</h3>"+lightsInnerHtml+"<p class='ui-li-aside'>"+light.uuidHash+"</p></a>"+
            "<a href='#' name="+light.deviceId+" class='edit ui-btn ui-btn-icon-notext ui-icon-edit'></a>";
        li.setAttribute("class","ui-li-has-alt ui-last-child");
        $("#lightList").append(li);
    }

})



// �������������� -- ��Ҫ���� $("#AddGroup") ��Ĭ�ϵ�����
// ����
//弹出新增组的对话框
$(document).on("click",".addGroup",function(event,data){
//    ��ý� Group �� Light �ϲ����˴�
    // �ж� group ���� light ����ȡĬ����
    // ���� popup
    if(event.target.name == "group"){
        console.log(event.target.name);
        $("#AddGroup").removeAttr("hidden");
        //��ȡĬ���� -- 2017��4��19��
        //�� csrmesh �л�ȡ�����ڳɹ����� csrmesh ����
        var newName = "group"+(window.mesh1.groups.length+1);
        $("#AddGroup #newGroupName").attr("name",newName);
        $("#AddGroup #newGroupName").attr("value",newName);

        //���
        $("#AddGroup fieldset label").remove();
        //���ɿ�ѡ����
        for(var lightIndex in mesh.lights){
            var label = document.createElement("label");
            label.innerHTML = "<input type='checkbox'"+"name='"+mesh.lights[lightIndex].deviceId+"'value='"+mesh.lights[lightIndex].deviceId+"'>"+mesh.lights[lightIndex].name;
            $("#AddGroup fieldset").append(label);
        }
        $("#AddGroup").popup();
        $("#AddGroup").popup("open");
        //���水ť�����䱣��

    }
})
// 新增组 保存 按钮
$(document).on("click","#AddGroup #Add",function(e,d){
    //ȡ�ñ�ѡ�ĵ�
    var Slights = [];
    $("#AddGroup input:checked").each(function(){
        //var get = $(this).val("name");
        var get = $(this).context.value;
        Slights.push(get);
    });
    try{
        window.mesh1.addGroup( $("#AddGroup #newGroupName").attr("name" ),Slights );
        console.log("新增组： "+ $("#AddGroup #newGroupName").attr("name")+" 并增加灯："+Slights);
        csrmesh.storeMesh();
    }catch(e1){
        console.log("addGroup error with :"+ e1);
    }
    $("#AddGroup").popup("close");
});



// Add ������
//$(document).on("click","#Add",function(e,d){
//
//})

//lightEdit -- �Ѿ��� group �ϲ���
$(document).on("click",".lightEdit",function(){
    //<ul data-role="listview" id="lightList">
    //    <a name="light" class="addLight ui-btn ui-btn-icon-right ui-icon-plus">���ݹ���</a>
    //
    //    <li class="ui-li-has-alt  ">
    //    <a href="#" class="ui-btn">
    //    <h3>light</h3>
    //    <td>group_A</td>
    //    <td>group_B</td>
    //    <p class="ui-li-aside">uuidHash</p>
    //    </a>
    //    <a href="#lightSet" class="lightEdit ui-btn-icon-right ui-btn ui-icon-edit"></a>
    //    </li>
    //    </ul>

})
