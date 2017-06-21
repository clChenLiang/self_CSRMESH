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

/*方案二：mesh类下分light与group*/


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


