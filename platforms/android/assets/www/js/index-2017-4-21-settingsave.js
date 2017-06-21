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
        csrmesh.initMesh();
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');
        //console.log('Received Event: ' + id);
    }
};

var newGroupIndex = 5;

var mesh = {
    "meshName":"cl",
    "lights":[
        {"name":"light_Lab","uuidHash":"ssssssss","deviceId":37265,"color":"#74aab5","power":0,"brightness":0,"maxGroups":4,"groups":[3,2,0]},
        {"name":"light1","uuidHash":"bbbbbbbb","deviceId":37267,"color":"#07ec94","power":0,"brightness":0,"maxGroups":4,"groups":[1,2,3,0]}],
    "groups":[
        {"name":"group_A","deviceId":0,"lights":[37265,37267],"color":"#aee6a2","power":0,"brightness":0},
        {"name":"group_B","deviceId":1,"lights":[37267],"color":"#f9bd8c","power":0,"brightness":0},
        {"name":"group3","deviceId":2,"lights":[37265,37267],"color":"#2abd8c","power":0,"brightness":0},
        {"name":"group4","deviceId":3,"lights":[37265],"color":"#23b38c","power":0,"brightness":0}]
}//2017��4��19�� ����ʱʹ�õ� mesh ,�ջᱻ��Ϊ window.mesh ���� csrmesh.getGroups()

try{
    csrmesh.initMesh();
    console.log("csrmesh init success");
    mesh = window.mesh1;
    console.log(mesh)
}catch(e){
    console.log("csrmesh init error"+e);
}

// test
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

// ���� Group �ĸ���
$(document).on("click","#saveChangeG",function(event,data){
    console.log("saveChange clicked");
    // �ֱ��ȡ deviceId ,��ȡ���֣��¶��ĵ���
    var newLights = [];
    $(event.target.parentNode).find("input:checked").each(function(){
        console.log("has chose this "+$(this).context.name);//
        newLights.push( parseInt($(this).context.name) );
    });
    //console.log($(this).attr("name"));// deviceId
    //console.log($(event.target.parentNode).find("input:text").val());// ��ȡ�õ��µ�����
    // csrmesh.getGroup(); ��øĳ������ʽ
    window.mesh1.getGroup(parseInt($(this).attr("name"))).name = $(event.target.parentNode).find("input:text").val();
    window.mesh1.getGroup( parseInt(  $(this).attr("name") )).setLights(newLights);
    csrmesh.storeMesh();
    //�ر� popup
    $("#groupSet").popup("close");
    //alert("ȷ��Ҫ");
    //���� alert ����
})// ���� �� light �Ĳ���

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
$(document).on("click",".addGroup",function(event,data){
//    ��ý� Group �� Light �ϲ����˴�
    // �ж� group ���� light ����ȡĬ����
    // ���� popup
    if(event.target.name == "group"){
        console.log(event.target.name);
        $("#AddGroup").removeAttr("hidden");
        //��ȡĬ���� -- 2017��4��19��
        //�� csrmesh �л�ȡ�����ڳɹ����� csrmesh ����
        $("#AddGroup #newGroupName").val("group"+(newGroupIndex++));

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
        $(document).on("click","#AddGroup #Add",function(e,d){
            //ȡ�ñ�ѡ�ĵ�
            $("#AddGroup input:checked").each(function(){
                //var get = $(this).val("name");
                var get = $(this).context.value;
                console.log(get);


            });
            $("#AddGroup").popup("close");
        });
    }
})



// Add ������
$(document).on("click","#Add",function(e,d){

})

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
app.initialize();