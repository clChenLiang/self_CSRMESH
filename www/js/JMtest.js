/**
 * Created by dell on 2017-04-18.
 */

//$(document).on("pagecreate","#settingPage",function(){
//    alert("on create settingPage");
//})

//window.onload = function(){initHeightSetting("scanPage");
//    alert("onload")
//}
//
//function setHeight(nextPage) {
//    var screen = $.mobile.getScreenHeight();
//    var header = nextPage.children(".ui-header").hasClass("ui-header-fixed") ? nextPage.children(".ui-header").outerHeight() - 1 : nextPage.children(".ui-header").outerHeight();
//    var footer = nextPage.children(".ui-footer").hasClass("ui-footer-fixed") ? nextPage.children(".ui-footer").outerHeight() - 1 : nextPage.children(".ui-footer").outerHeight()
//    var contentCurrent = nextPage.children(".ui-content").outerHeight() - nextPage.children(".ui-content").height();
//    var content = screen - header - footer - contentCurrent;
//    nextPage.children(".ui-content").height(content);
//}
//
///// ��ʼ���߶����ú���.
//function initHeightSetting(yourFirstPageId) {
//    // ��δ����ڳ�ʼ����ʱ��ִ��.���õ�һ��ҳ��ĸ߶�
//    setHeight($(yourFirstPageId));
//
//    // ��ҳ����ʾǰ��ִ���������.���ø߶�
//    $( "body" ).on( "pagecontainershow", function( event, ui ) {
//        var nextPage = $(ui.toPage[0]);
//        setHeight(nextPage);
//    });
//}

//�� index.js �а��¼�,���� index.html �����ö�Ӧ�� id

////setting
//$("#groupset_1").onclick = function(){
//    $("#groupSet").popup("open");
//}

//2017��4��18��
//<!-- ��̬ȥд -->
//<label>������</label><input type="text" value="sss">
//    <label>���ݣ�</label>
//<select name="selM" id="ss" data-native-menu="false" multiple="true">
//    <option>ѡ�������ĵ���</option>
//        <!-- �����ȡ����ĵ������������ȫ�����ݣ����Ѿ������������� ѡ�� -->
//    <option value="1" selected="true">1s</option>
//<option value="2">2s</option>
//<option value="3">s3</option>
//    <option value="4">s4</option>
//    <option value="5">5s</option>
//<option value="6">6</option>
//    <option value="7">7</option>
//    <option value="8">8</option>
//    <option value="9">9</option>
//    <option value="10">10</option>
//    <option value="11">11</option>
//    <option value="12">12</option>
//    </select>

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

$(document).on("click","#saveChange",function(event,data){
    console.log("saveChange clicked")
    //�����ĺ�����ݴ洢����
    // window.mesh1.getLight().setGroup()
    // window.mesh1.getGroup().setLights()
    // �������� mesh �������� mesh �������޸�ֵ��ʹ֮�ָ�ԭ�ȵ����������̫������

    //alert("ȷ��Ҫ");
    //���� alert ����
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
        li.innerHTML = "<a href='#' class='ui-btn'><h3>"+group.name+"</h3>"+lightsInnerHtml+"<p class='ui-li-aside'>"+group.deviceId+"</p></a>"+
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
        li.innerHTML = "<a href='#' class='ui-btn'><h3>"+light.name+"</h3>"+lightsInnerHtml+"<p class='ui-li-aside'>"+light.uuidHash+"</p></a>"+
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

//lightEdit
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