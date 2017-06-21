// var mesh = require("./meshLight");

// console.log(new mesh.Light('asdfa',21));
// lights = 0;
// var light = new Light("12344",23);
// // console.log(light);
// /* 方案一：使用方法，函数式编程，并将成员方法放在内部 */
// function light(uuid,deviceId){
// 	lights++;
// 	var obj = {
// 		'uuid':uuid,
// 		'deviceId':deviceId,
// 		'name':"light"+lights,
// 		'getName':function(dd){
// 			console.log(this.dd);
// 		}
// 	}
// 	return obj;
// }


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

//            document.getElementById("groupControl").style.display = ''
	if(groupButton.children.length <1){
//                console.time("dom create")
		var groups = window.mesh1.groups;
		alert(groups);
		alert(window.mesh1);
		for(var i =0 ;i<groups.length;i++){

			(function(i){
				var newChild = document.createElement("tr")
				var aaa = "group"+groups[i].deviceId;
				newChild.innerHTML = "<td style='width: 50%;height:50px;border-bottom: dashed;;border-bottom-color: bisque'>"+groups[i].name+"</td>"+"<td id="+aaa+" style='width: 50%;'>"+groups[i].deviceId+"</td>"
				newChild.setAttribute("value",groups[i].deviceId);
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

				/* 本题闭包处理方案 若干*/
				/*(function(){
				 return function(aa){alert(aa.value)}
				 })(newChild)*/
				/*(function(){
				 return function(aa){alert(aa.target.value)}
				 })(groups[i].deviceId)*/
				/*function(){
				 alert(this.value);
				 }*/
				groupButton.appendChild(newChild)
				console.log(aaa)
				$("#"+aaa).colorpicker({
					color: groups[i].color,
					colorSpace: 'hsl',
					displayColor:'hex',
					labels:true
				});
				$("#"+aaa).on('newcolor',function(ev,color){
					console.log(ev)
					console.log("the deviceId is "+groups[i].deviceId)
					console.log(color.toString('hsla'))
				})
			})(i);
		}
//                console.timeEnd("dom create")
	}else{
		groupButton.innerHTML='';
	}
//            document.getElementById("sigleControl").style.display = 'none'
	document.getElementById("sigleControl").innerHTML='';
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
					newChild.setAttribute("value",lights[i].deviceId);
					newChild.setAttribute("style","width:100%;")
					newChild.onclick=(function(){
						return function(aa){console.log(aa.target.parentNode.getAttribute('value'))
							if(aa&&aa.stopPropagation){//非IE浏览器
								aa.stopPropagation();
							}
							else{//IE浏览器
								window.event.cancelBubble=true;
							}
						}
					})()
					console.log(aaa)
					groupButton.appendChild(newChild)
					$("#"+aaa).colorpicker({
						color:  lights[i].color,
						colorSpace: 'hsl',
						displayColor:'hex',
						labels:true
					});

					$("#"+aaa).on('newcolor',function(ev,color){
						console.log(ev)
						console.log(color.toString('hsla'))
						// 将颜色存起来
						console.log(lights[i].deviceId)
					})
				})(i);
			}
		}else{
			groupButton.innerHTML='';
		}
//            document.getElementById("groupControl").style.display = 'none'
		document.getElementById("groupControl").innerHTML='';
	}


//date:2017年3月23日  ---  增加本地存储与初始化的操作
function initMesh(){
	alert("initMesh")
	try {
		//window.mesh1 = "cl"
		//csrmesh.storeMesh();
		//csrmesh.initMesh();//可能存在浅引用
		alert(window.mesh1);
	}catch(e){
		alert(e);
	}
	alert(window.localStorage.getItem("mesh"));

}
//date:2017年3月23日 --- 将 save() 放入每次操作里面( 新增、删除、更改灯泡、更改分组等等)
function save(/*mmesh*/){
	csrmesh.storeMesh();
}

function seeLight(){
	var lightDom = document.getElementById("light")
	console.log(mesh1.lights)
	for(var light in mesh1.lights){
		var lightShow = document.createElement("p");
		lightShow.innerHTML = "灯："+mesh1.lights[light].name+"--deviceId:"+mesh1.lights[light].deviceId+"--组--"+mesh1.lights[light].groups;
		lightDom.appendChild(lightShow);
	}
	for(var light in mesh1.groups){
		var lightShow = document.createElement("li");
		lightShow.innerHTML = "组："+mesh1.groups[light].name+"--groupId:"+mesh1.groups[light].deviceId+"--灯--"+mesh1.groups[light].lights;
		lightDom.appendChild(lightShow);
	}
	console.log(mesh1.groups)
}


