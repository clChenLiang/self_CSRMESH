var cordova = require("cordova");
var exec = require('cordova/exec');

/*var csrmesh = function(){}

//findMesh(success,failure);
	 启动csrmeshActivity，完成寻找网络和灯泡桥接
	 * success(brigdeDeviceAddress);
	 * failure(resonOfFail)
	 * 
	 第一版
	 * 在程序里面直接绑定到指定的桥接设备，完成全部连接
	 * 包括parseKey();
	 
csrmesh.prototype.findMesh = function(success,error){
	exec(success,error,"csrmeshPlugin","findMesh",[]);
}

//setPower(deviceId,state,success,failure);
	 打开/关闭灯泡 
	 * state = true || false;控制灯泡的颜色
	 * 
	 
csrmesh.prototype.setPower = function(deviceId,state,success,error){
	exec(success,error,"csrmeshPlugin","setPower",[deviceId,state]);
}

csrmesh.prototype.startScan = function(success,error){
	exec(success,error,"csrmeshPlugin","startScan",[]);
}
csrmesh.prototype.stopScan = function(success,error){
	exec(success,error,"csrmeshPlugin","stopScan",[]);
}
//setKey(key,success,failure);
	设置网络秘钥
	 * 
	 FirstEdition
	 * 初版不实现，留待成功后再实现
	 * 
	 * 

//setRgb(deviceId,Color,success,failure);
	 设置灯泡颜色
	 * 
	 
//module.exports = csrmesh;
*/
/*var mesh = {
		lights:[],//[{},{light}]
		lightIndex:0,
		nextDeviceId:32769,//暂时不考虑实现，留下接口以备后用  32769
		nextDeviceName:0,
		addLight:function(uuidHash,deviceId){//准备设计成多函数的方法
			var that = this;
			for(var lightTemp in that.lights){
				console.log(that.lights[lightTemp].uuidHash)
				if(that.lights[lightTemp].uuidHash == uuidHash){
					console.log("该灯泡 uuid 已经 存在");
					return ;
					//如果该 uuidHash 已经在灯泡数组里的话，返回，不再添加
				}
			}
			var light = {};
			light.name = "light"+this.nextDeviceName(this.lights.length+1)// light.name = name ||"light"+(mesh.lights.length+1)
			light.uuidHash = uuidHash;
			light.deviceId = deviceId;
			light.color = "#ffffff";
			light.power = 0;
			light.brightness = 0;
			light.maxGroups = 4;//暂时默认为最大值4
			light.groups = [];  // 存放 group 的 groupId
			this.nextDeviceName++;
			light.setGroups = function(arr){
				// 参数 arr : 为 groupsId 的集合
				arr = arr.sort();
				var newArr = [];
				arr.forEach(function(aa){
					newArr.push(aa);
				})
				console.log("************")
				console.log(newArr)
				var that_light = this;
				// 需要添加完整的方案：设置的同时，需要将原来的groups全部取出，做对比
				if(arr.length > this.maxGroups){return "setGroups error with much groups!"}
				for(var i in arr){
					for(var j in that_light.groups){
						if(that_light.groups[j] == arr[i]){
							arr.splice(i,1);
							that_light.groups.splice(j,1);
							break;
						}
					}
				}
				console.log(that_light.groups);
				for(var i in that_light.groups){
					try{
						if(that_light.groups[i]){
							that.getGroup(that_light.groups[i]).lights.splice(that.getGroup(this.groups[i]).lights.indexOf(that_light.deviceId),1);
							console.log("remove : "+this.deviceId);
						}
						
					}catch(e){
						console.log("error when 原先的组，去掉该灯泡"+e);
					}
				}
				for(var i =0;i<that_light.maxGroups;i++){
					console.log(" i = "+i);
					if(i<arr.length?i<that_light.maxGroups-1?true:false:false){
						that.getGroup(arr[i]).lights.push(this.deviceId);
					}else{
						this.groups.push(0);
					}
				}
				that_light.groups = [];
				newArr.forEach(function(a){
					that_light.groups.push(a);
				})
				console.log(that_light.groups);
				console.log("*************************")
				console.log(newArr);
				console.log(that_light.maxGroups-newArr.length)
				for(var i=0;i< (that_light.maxGroups - newArr.length);i++){
					that_light.groups.push(0);
					// console.log("106 : "+(that_light.maxGroups-newArr.length))
				}
				console.log(that_light.groups)
			};
			that.lights.push(light);
			return light;
		},
		getLight:function(uuidHashOruuid){
			var result =false;
			if(typeof(uuidHashOruuid) === typeof(3)){
				//为deviceId寻找方法
				for(var light in this.lights){
					if(this.lights[light].deviceId == uuidHashOruuid ){
						result = light;
					}
				}
			}else{
				for(var light in this.lights){
					if(this.lights[light].uuidHash == uuidHashOruuid ){
						result = light;
					}
				}
			}
			if(result === false){
				return "the light "+uuidHashOruuid + " is not found!";
			}else{
				return this.lights[result];
			}		
		},
//		2017年4月20日
		deleteLight:function(deviceId){
			// 删除 Light
			console.log("deleteLight "+deviceId);
			//查找该 light 的所属组，每个组里删除掉该 ID 
			//向 mesh 网发送  reset 信息   --- 放在 exports 里去实现 
			try{
				this.getLight(deviceId).setGroups([0]);
				
				// 从  lights 中找到 index,并删除
				for(var light in this.lights){
					if(this.lights[light].deviceId == deviceId ){
						this.lights.shift(light);
					}
				}
				console.log("success in deleteLight in mesh :170");
			}catch(e){
				console.log("deleteLight error in mesh :168");
			}
			
		},

		groups:[1,2,3,4],//[{},{group}],一开始就需要先默认4个;不需要,强制页
							 //面读取目前存在的组后，再允许分组
		nextGroupId:1,//暂时不考虑实现，留下接口以备后用
		addGroup:function(groupId,name,lights){
			var group = {};
			var that = this;
			group.name = name || "group"+(this.groups.length+1);
			group.deviceId = groupId || this.nextGroupId;//统一为deviceId;防BUG,应该设为nextGroupId
			group.lights = [];   // 存放light还是 light_DeviceID ? 2017年3月8日: 先存放 deviceID
			group.color = 0;     // 考虑也可以放弃;因为控制单个灯泡的时候又会恢复原样
			group.power = 0;     // 导致切换到该页面上的时候，又会失去统一性
			group.brightness = 0;// 可以在切换页面的时候先行统一一种颜色;可以使用这里的值;最好有个默认的参数
			this.nextGroupId++;
			group.getGroup=function(){},//获取组；作用不大，先缓着实现 
			// 给组设置灯泡
			group.setLights = function(lights){
				// lights : 数组[deviceId1,devcieId2,...]
				// 对比 lights 与 this.lights 相同的，去掉
				// 再分别对不同的 this.lights 去除该组； lights 增加该组
				var that_group = this;
				lights.sort();
				var newLights = [];
				//封装，避免引用赋值
				lights.forEach(function(a){
					newLights.push(a);
				})
				console.log(lights)
				console.log(this.lights);
				// that : group
				// this : setLights
				lights.forEach(function(lightId){
					if(that_group.lights.length){
						that_group.lights.forEach(function(oldlight){
							if(oldlight == lightId){
								lights.splice(lights.indexOf(lightId),1);
								that_group.lights.splice(that_group.lights.indexOf(lightId),1);
							}
						})
					}
				});
				// 留下的灯，增加该组
				if(lights.length){
					lights.forEach(function(light){
					// 直接将 0 替换为 groupId 
					that.getLight(light).groups.splice(0,1,that_group.deviceId);
					// that.getLight(light).groups.sort();
					})
				}
				
				// 需要删除的灯，去掉该组
				if(that_group.lights.length){
					that_group.lights.forEach(function(light){
						that.getLight(light).groups.splice(that.getLight(light).groups.indexOf(light),1);
					})
				}
				that_group.lights=[];
				newLights.forEach(function(a){
					that_group.lights.push(a);
				}) ;//好害怕还是引用赋值
			}
			that.groups.push(group);
			return group;
		},
//		setDeviceId:function(){
//			// Native 端补写
//			
//		},
		isGroupExit:function(){},//判断是否存在该group
		deleteGroup:function(deviceId){
			// 清除所有 lights 对应的 groups 中该组的;硬件不需要做处理;或者放在 addGroup 里面实现
			console.log("deleteGroup in csrmesh:244");
			try{
				this.getGroup(deviceId).setLights([]);
				for(var group in this.groups){
					if(this.groups[group].deviceId == deviceId){
						this.groups.shift(group);
					}
				}
				console.log("success in deleteGroup in mesh :253");
			}catch(e){
				console.log("deleteGroup error in mesh :255");
			}
			
		},

		getGroup:function(nameOrGroupId){
			// 返回值: 返回组;错误找不到则返回 string
			var result = false;
			if(typeof(nameOrGroupId) === typeof(9)){
				for(var group in this.groups){
					if(this.groups[group].deviceId == nameOrGroupId){
						result = group;
					}
				}
			}else if(typeof(nameOrGroupId) === typeof("clbest")){//可加强判断
				for(var group in this.groups){
					if(this.groups[group].name == nameOrGroupId){
						result = group;
					}
				}
			}

			if(result === false){
				return "can't find the group :"+nameOrGroupId;
			}else{
				return this.groups[result];
			}
			// return this.groups;//用于获取所有的，存在的组
		}
	}
*/

var mesh = {
		lights:[],//[{},{light}]
		lightIndex:0,
		nextDeviceId:32769,//暂时不考虑实现，留下接口以备后用  32769
		nextDeviceName:0,
		addLight:function(uuidHash,deviceId){//准备设计成多函数的方法
			var that = this;
			for(var lightTemp in that.lights){
				console.log(that.lights[lightTemp].uuidHash)
				if(that.lights[lightTemp].uuidHash == uuidHash){
					console.log("该灯泡 uuid 已经 存在");
					return ;
					//如果该 uuidHash 已经在灯泡数组里的话，返回，不再添加
				}
			}
			var light = {};
			light.name = "light"+this.nextDeviceName/*(this.lights.length+1)*/// light.name = name ||"light"+(mesh.lights.length+1)
			light.uuidHash = uuidHash;
			light.deviceId = deviceId;
			light.color = "#ffffff";
			light.power = 0;
			light.brightness = 0;
			light.maxGroups = 4;//暂时默认为最大值4
			light.groups = [];  // 存放 group 的 groupId
			this.nextDeviceName++;
			light.setGroups = function(arr){
				// 参数 arr : 为 groupsId 的集合
				arr = arr.sort(function(a,b){return a>b?true:false});
				var newArr = [];
				arr.forEach(function(aa){
					newArr.push(aa);
				})
				console.log("************")
				console.log(newArr)
				var that_light = this;
				// 需要添加完整的方案：设置的同时，需要将原来的groups全部取出，做对比
				if(arr.length > this.maxGroups){return "setGroups error with much groups!"}
				for(var i in arr){
					for(var j in that_light.groups){
						if(that_light.groups[j] == arr[i]){
							arr.splice(i,1,"#");
							that_light.groups.splice(j,1,"#");
							break;
						}
					}
				}
				arr = arr.filter(function(a){return a=="#"?false:true;});
				that_light.groups = that_light.groups.filter(function(a){return a=="#"?false:true;});
				
				console.log(that_light.groups);
				for(var i in that_light.groups){
					try{
						if(that_light.groups[i]){
							that.getGroup(that_light.groups[i]).lights.splice(that.getGroup(this.groups[i]).lights.indexOf(that_light.deviceId),1);
							console.log("remove : "+this.deviceId);
						}
						
					}catch(e){
						console.log("error when 原先的组，去掉该灯泡"+e);
					}
				}
				for(var i =0;i<that_light.maxGroups;i++){
					console.log(" i = "+i);
					if(i<arr.length?i<that_light.maxGroups-1?true:false:false){
						that.getGroup(arr[i]).lights.push(this.deviceId);
					}/*else{
						this.groups.push(0);
					}*/
				}
				that_light.groups = [];
				newArr.forEach(function(a){
					that_light.groups.push(a);
				})
				console.log(that_light.groups);
				console.log("*************************")
				console.log(newArr);
				console.log(that_light.maxGroups-newArr.length)
				// 可以保留添 0 的做法
				for(var i=0;i< (that_light.maxGroups - newArr.length);i++){
					that_light.groups.push(0);
					// console.log("106 : "+(that_light.maxGroups-newArr.length))
				}
				that_light.groups.sort(function(a,b){return a>b?true:false})
				console.log(that_light.groups)
			};
			that.lights.push(light);
			return light;
		},
		getLight:function(uuidHashOruuid){
			var result =false;
			if(typeof(uuidHashOruuid) === typeof(3)){
				//为deviceId寻找方法
				for(var light in this.lights){
					console.log(this.lights[light].deviceId,this.lights[light].deviceId == uuidHashOruuid );
					if(this.lights[light].deviceId == uuidHashOruuid ){
						result = light;
						console.log(result);
					}
				}
			}else{
				for(var light in this.lights){
					console.log(this.lights[light].uuidHash);
					if(this.lights[light].uuidHash == uuidHashOruuid ){
						result = light;
						console.log(result)
					}
				}
			}
			if(result === false){
				return "the light "+uuidHashOruuid + " is not found!";
			}else{
				return this.lights[result];
			}		
		},
//		2017年4月20日
		deleteLight:function(deviceId){
			// 删除 Light
			console.log("deleteLight "+deviceId);
			//查找该 light 的所属组，每个组里删除掉该 ID 
			//向 mesh 网发送  reset 信息   --- 放在 exports 里去实现 
			try{
				this.getLight(deviceId).setGroups([]);
				
				// 从  lights 中找到 index,并删除
				for(var light in this.lights){
					if(this.lights[light].deviceId == deviceId ){
						//2017年4月26日 确实是删除了，写法没错。但是回到 mesh 中，又变回去了;后来又恢复了

						this.lights.splice(light,1);

					}
				}
				console.log("success in deleteLight in mesh :170");
			}catch(e){
				console.log("deleteLight error in mesh :168"+e);
			}
			
		},

		groups:[/*1,2,3,4*/],//[{},{group}],一开始就需要先默认4个;不需要,强制页
							 //面读取目前存在的组后，再允许分组
		nextGroupId:1,//暂时不考虑实现，留下接口以备后用
		addGroup:function(name,lights,groupId){
			var group = {};
			var that = this;
			group.name = name || ("group"+(this.groups.length+1));

//			group.deviceId = (groupId==0)?0: || this.nextGroupId;//统一为deviceId;防BUG,应该设为nextGroupId
			group.deviceId = ( groupId == undefined ? this.nextGroupId:groupId);// 为0时，
			group.lights = lights || [];   // 存放light还是 light_DeviceID ? 2017年3月8日: 先存放 deviceID
			group.color = "#ffffff";     // 考虑也可以放弃;因为控制单个灯泡的时候又会恢复原样
			group.power = 0;     // 导致切换到该页面上的时候，又会失去统一性
			group.brightness = 0;// 可以在切换页面的时候先行统一一种颜色;可以使用这里的值;最好有个默认的参数
			this.nextGroupId++;
			group.getGroup=function(){},//获取组；作用不大，先缓着实现 
			// 给组设置灯泡
			group.setLights = function(lights){
				// lights : 数组[deviceId1,devcieId2,...]
				// 对比 lights 与 this.lights 相同的，去掉
				// 再分别对不同的 this.lights 去除该组； lights 增加该组
				var that_group = this;
				lights.sort(function(a,b){return a>b?true:false});
				var newLights = [];
				//封装，避免引用赋值
				lights.forEach(function(a){
					newLights.push(a);
				})
				console.log(lights)
				console.log(this.lights);
				// that : group
				// this : setLights
				lights.forEach(function(lightId){
					if(that_group.lights.length){
						that_group.lights.forEach(function(oldlight){
							// 可能在删除过程中，发生了错位；
							// 解决方案
							if(oldlight == lightId){
								lights.splice(lights.indexOf(lightId),1,"#");
								// 
								that_group.lights.splice(that_group.lights.indexOf(lightId),1,"#");
							}
						})
					}
				});
				lights =lights.filter(function(a){return a=="#"?false:true;})
				that_group.lights=that_group.lights.filter(function(a){return a=="#"?false:true;})
				// 留下的灯，增加该组
				if(lights.length){
					lights.forEach(function(light){
						// 直接将 0 替换为 groupId 
						if(!that.getLight(light).groups[0]){
							// 要么为 0 ，要么 undefined
							that.getLight(light).groups.splice(0,1,that_group.deviceId);
							// 可以考虑，让其再重置一次
							// that.getLight(light).setGroups(that.getLight(light).groups)
							
						}else if(that.getLight(light).groups.length < that.getLight(light).maxGroups){
							that.getLight(light).groups.push(that_group.deviceId);
						}else{
							console.log("灯泡 "+that.getLight(light).deviceId+"已经分配过多组！");
						}
						that.getLight(light).groups.sort(function(a,b){return a>b?true:false});
						
						
					})
				}
				
				// 需要删除的灯，去掉该组
				if(that_group.lights.length){
					that_group.lights.forEach(function(light){
						// 除组的灯泡，将该组置为0
						that.getLight(light).groups.splice(that.getLight(light).groups.indexOf(light),1,0);
						that.getLight(light).groups.sort(function(a,b){return a>b?true:false});
					})
				}
				//清空 group.lights
				that_group.lights=[];
				newLights.forEach(function(a){
					that_group.lights.push(a);
				}) ;//好害怕还是引用赋值
			}
			that.groups.push(group);
			return group;
			
		},
//		setDeviceId:function(){
//			// Native 端补写
//			
//		},
		isGroupExit:function(){},//判断是否存在该group
		deleteGroup:function(deviceId){
			// 清除所有 lights 对应的 groups 中该组的;硬件不需要做处理;或者放在 addGroup 里面实现
			console.log("deleteGroup in csrmesh:244"+deviceId);
			try{
				this.getGroup(deviceId).setLights([]);
				console.log("deleteGroup :"+this.groups);
				for(var group in this.groups){
					if(this.groups[group].deviceId == deviceId){
						console.log("deleteGroup :"+this.groups);
						this.groups.splice(group,1);
					}
				}
				console.log("success in deleteGroup in mesh :253");
			}catch(e){
				console.log("deleteGroup error in mesh :255 "+e);
			}
			
		},

		getGroup:function(nameOrGroupId){
			// 返回值: 返回组;错误找不到则返回 string
			var result = false;
			if(typeof(nameOrGroupId) === typeof(9)){
				for(var group in this.groups){
					if(this.groups[group].deviceId == nameOrGroupId){
						result = group;
					}
				}
			}else if(typeof(nameOrGroupId) === typeof("clbest")){//可加强判断
				for(var group in this.groups){
					if(this.groups[group].name == nameOrGroupId){
						result = group;
					}
				}
			}

			if(result === false){
				return "can't find the group :"+nameOrGroupId;
			}else{
				return this.groups[result];
			}
			// return this.groups;//用于获取所有的，存在的组
		}
}

//2017年4月8日  --- 待删除 
//对颜色进行重置
//传入Native 去执行的颜色是 整型
function colorToInt(color){
//	对  color 分类
	if(typeof color == typeof 3){
		return color
	}else if(typeof color == typeof "23"){
		if(color[0] == "#")
			return parseInt(color.slice(1),16);
		else
			return parseInt(color);
	}
}
//将整型颜色值转换成  "#f1f2f3" RGB形式
function intToColor(color){
	if(color[0] == "#"){return color}
    var result = "#";
    var hex = Number(color).toString(16);
    for(var i=0;i<6-hex.length;i++){
        result+="0";
    }
    return result+hex;
}

//2017年4月27日  --- hsl 转化成
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



module.exports = {
		findMesh : function(address,success,error){
//			alert("findMesh");
			var successWraper = function(aa){
				console.log("findMesh in csrmesh @line 627: "+aa);
				exec(function(e){console.log("nextdeviceId "+e)},function(e){console.log("nextdeviceId "+e)},
						"csrmesh","setNextDeviceId",[window.mesh1.nextDeviceId]);// mesh.nextDeviceId
				success(aa);
				
			};
			exec(successWraper,error,"csrmesh","findMesh",[address]);
			
		},
		setColor : function(deviceId,color,success,error){
/* @params color:			
			color = {
					type:"hsl",
					color:"#ffaabbcc",
					rgbColor: ,
					hexColor: 
			}
*/			
//			var colorToNative = (color.type == "hsl")?color.rgb:(color.color);
//			var colorToNative = color.rgb;

			console.log("setColor in plugin " + color + typeof color);
			// 2017年3月31日 
			//应该将 success 包装起来，将  对mesh 的操作封装 --- 待后续实现
			var successWraper = function(a){
				try{
					if(deviceId>32600){//32766 --- 应该是这个值 
						window.mesh1.getLight(deviceId).color = color;//属性直接使用，不甚合理
					}else{
						window.mesh1.getGroup(deviceId).color = color;//属性直接使用，不甚合理
					}	
					console.log(window.mesh1.getLight(deviceId).color )
				}catch(e){
					console.log("setColor error : "+e);
				}
				success(a);
			}
			
			exec(successWraper,error,"csrmesh","setColor",[deviceId,color]);
		},
		setBrightness:function(deviceId,bright,success,error){
			//@params : bright  [0-100)
			//			success()
			console.log("setBrightness");
			exec(success,error,"csrmesh","setBrightness",[deviceId,bright]);
			// 2017年3月31日 
			//应该将 success 包装起来，将  对mesh 的操作封装 --- 待后续实现
			try{
				if(deviceId>300){
					window.mesh1.getLight(deviceId).brightness = bright;//属性直接使用，不甚合理
				}else{
					window.mesh1.getGroup(deviceId).brightness = bright;//属性直接使用，不甚合理
				}
				
			}catch(e){
				console.log(e);
			}
		},
		setPower : function(deviceId,state,success,error){
			console.log("setPower");
			exec(success,error,"csrmesh","setPower",[deviceId,state]);
			// 2017年3月31日 
			//应该将 success 包装起来，将  对mesh 的操作封装 --- 待后续实现
			try{
				if(deviceId>300){
					window.mesh1.getLight(deviceId).color = color;//属性直接使用，不甚合理
				}else{
					window.mesh1.getGroup(deviceId).color = color;//属性直接使用，不甚合理
				}
				
			}catch(e){
				console.log(e);
			}
		},
		startScan :function(success,error){
			console.log("startScan");
			exec(success,error,"csrmesh","startScan",[]);
			
		},
		stopScan:function(success,error){
			console.log("stopScan");
			exec(success,error,"csrmesh","stopScan",[]);
		},
		getState:function(){
			console.log("getState");
			// 2017年3月31日 
			//应该将 success 包装起来，将  对mesh 的操作封装 --- 待后续实现
			var state = {};
			try{
				if(deviceId>300){
					return window.mesh1.getLight(deviceId).color ;
				}else{
					return window.mesh1.getGroup(deviceId).color ;
				}
				
			}catch(e){
				console.log(e);
			}
			//暂未实现
		},
		setParseWord:function(){
			
		},
		associate:function(uuidHash,success,error){
//			2017-5-18：改uuidHash 为uuid字符串
//			@params: uuidHash 为uuid字符串形式
			console.log("associateNew");
			
			var successWraper = function(newDevice){
				/*newDevice={
				 * 		uuidHash:int,
				 * 		deviceId:int
				 * }	//Android的返回参数
				 * */
				var newDeviceWraper;
				console.log("success in associateNew : "+newDevice);
				if(typeof newDevcie == typeof "cl"){//IOS传过来的参数为字符串型 deviceID
					newDeviceWraper = {
							"uuidHash":123456789,
							"deviceId":parseInt(newDevice),
							"name":"light"+window.mesh1.nextDeviceName
					};
				}else{
					newDeviceWraper = {
							"uuidHash":newDevice.uuidHash,
							"deviceId":newDevice.deviceId,
							"name":"light"+window.mesh1.nextDeviceName
					};
				}
//				2017-5-19：需要增加IOS的匹配
				
//				window.mesh1.nextDeviceName = window.mesh1.nextDeviceName+1;
				window.mesh1.nextDeviceId = newDevice.deviceId + 1;
				try{
					window.mesh1.addLight(newDevice.uuidHash,newDevice.deviceId);
					console.log("绑定成功！")
					//2017年4月17日 貌似没有执行成功，并没有添加进去
				}catch(e){
					console.log("mesh1 执行"+e);
				}
//				console.log(window.mesh1);
				
//				window.mesh1.nextDeviceId++;
				success(newDeviceWraper);
				//返回的过程添加 name 属性
				window.mesh1.nextDeviceId = newDevice.deviceId;
				// next 为当前最大的 deviceId;
				console.log("nextDeviceID after associate : "+window.mesh1.nextDeviceId +" "+newDevice.deviceId);
			}
			
			exec(successWraper,error,"csrmesh","associate",[uuidHash]);
			//封装 success 中 增加处理：新增灯泡并默认赋名：light+n
			
			
		},
		setNextDeviceId:function(nextDeviceId){
			exec(function(e){console.log("nextdeviceId "+e)},function(e){console.log("nextdeviceId "+e)},
					"csrmesh","setNextDeviceId",[nextDeviceId]);
		},
		getNextDeviceId:function(){
			
		},
		setGroups:function(deviceId,groupIds,success,error){
			// groupIds 在 Native 端用 0 补充；
			console.log("setGroups");
			exec(success,error,"csrmesh","setGroups",[deviceId,groupIds.toString()]);
			// 2017年3月31日 
			//应该将 success 包装起来，将  对mesh 的操作封装 --- 待后续实现
			try{
				window.mesh1.getLight(deviceId).setGroups(groupIds);				
			}catch(e){
				console.log(e);
			}
			
		},

		setLights:function(groupId,newLights,success,error){
			try{
				//得到所有跟 这次变动有关系的灯泡；有重复
				var changeLights = mesh.getGroup(groupId).lights.concat(newLights);
				//mesh层结构中更改 // 可以考虑在 setLights 中返回修改分组信息的灯泡数组
				mesh.getGroup(groupId).setLights(newLights);
				for(var light in changeLights)
				{
					//将每个需要改变的灯泡都执行一次
					var ngroupIds = mesh.getLight(changeLights[light]).groups;
					exec(success,error,"csrmesh","setGroups",[changeLights[light],ngroupIds.toString()]);
					console.log("csrmesh setLights in loop:"+ngroupIds+"  "+changeLights[light]);
				}
			}catch(e){
				console.log("setLights error:"+e);
			}
			
		},
		getAssociableDevice:function(success,error){
			//@success 接受到的是一个  uuidHash 字符串 “891748927,3980471928”
			//  {	name:  		,安卓端返回默认值 || light ，后续版本应该增强 --- 暂时与IOS端合并，取默认值；
//					uuid:  		,改从 DISCOVERE 中返回数据信息，故有 uuid ；
//				 	uuidHash:   ,最终使用到的参数
//				}
//2017-5-18 ：与IOS系统兼容
			var successWraper = function(message){
				var device = {};
				if(typeof message === "string"){//IOS传过来的参数
					device.name = "light";
					device.uuid = message;
					device.uuidHash = message;//IOS中 uuidHash 为字符串形式的UUID
				}else{//JSON对象为Android传过来的参数
					device = message;
				}
				success(device);
			}
			
			exec(successWraper, error,"csrmesh","getAssociableDevice",[]);	
			
		},
		resetDevice:function(deviceId,success,error){
			
		},
		deleteDevice:function(deviceId,success,error){
			//判断  deviceId 来分别进行删除组的操作和删除灯的操作
			if(parseInt(deviceId)>32768){
				// device为灯泡
				var successWraper = function(a){
					mesh.deleteLight(deviceId);
					success(a);
//					mesh.deleteLight(deviceId);
					console.log("csrmesh:450 --- deleteDevice success ");
				};
				exec(successWraper,error,"csrmesh","resetDevice",[parseInt(deviceId)]);
				
			}else{
				// device为组
				mesh.deleteGroup(deviceId);
			}
		},
		getDeviceId:function(uuidHash,success,error){
			console.log("getDeviceID with uuidHash"+uuidHash);
			/*var success = function(deviceID){
				alert("and the deviceID : ");
				alert("and the deviceID : "+devcieID);//2017年2月27日  此处deviceID的类型
			}
			var error = function(){
				alert("error in the getDeviceId");
			}*/
			// 2017年4月1日 
			 var successWraper = function(peripheral){
			 	success(peripheral);
			 	window.mesh1.addLight(uuidHash,peripheral);//应该升级成加名字的方法
			 }
			exec(success,error,"csrmesh","getDeviceId",[uuidHash]);
			
		},
		/*2017年3月31日---合并*/
		initMesh:function(){
			console.log("initMesh3");
//			var mesh1 = mesh;// 准备改成返回值
			var meshNet = window.localStorage.getItem("mesh");
			console.log(meshNet)
			var has0Group = false;
			if(meshNet){
				meshNet = JSON.parse(meshNet);
				for(var lmesh in meshNet.meshs){
					var savedmesh = meshNet.meshs[lmesh];
					console.log("00000000000**********")
					for(var light in savedmesh.lights){
						var mlight = savedmesh.lights[light]
						var newlight = mesh.addLight(mlight.uuidHash,mlight.deviceId);
						newlight.name = mlight.name;
						newlight.color = mlight.color;
						newlight.power = mlight.power;
						newlight.brightness = mlight.brightness;
						newlight.maxGroups = mlight.maxGroups;
						newlight.groups = mlight.groups;
						//mesh1.lights.push(mlight);
					}
					for(var light in savedmesh.groups){
						var mlight = savedmesh.groups[light]
						if(mlight.deviceId == 0){
							has0Group = true;
						}
						console.log(mlight.lights);
						var newlight =  mesh.addGroup(mlight.name,mlight.lights,mlight.deviceId);// lights 缺少实现
						newlight.color = mlight.color;
						newlight.power = mlight.power;
						newlight.lights = mlight.lights;
						newlight.brightness = mlight.brightness;
						//mesh1.groups.push(newlight);
					}
					//初始化 nextDeviceID
//					mesh.nextDeviceId = savedmesh.nextDeviceId;
					console.log("BLE-init","initmesh nextId: "+savedmesh.nextDeviceId);
//					try{
//						exec(function(e){console.log("nextdeviceId "+e)},function(e){console.log("nextdeviceId "+e)},
//								"csrmesh","setNextDeviceId",[savedmesh.nextDeviceId]);
//					}catch(e){
//						console.log("initMesh in setnextDeviceId error "+e);
//					}
					
				}
				window.mesh1 = mesh;
				window.mesh1.nextDeviceId = savedmesh.nextDeviceId ||window.mesh1.nextDeviceId;
				window.mesh1.nextDeviceName = savedmesh.nextDeviceName ||window.mesh1.nextDeviceId;
				
				//associated 后需要更改，监测是否更改成功
			}else{
				window.mesh1 = mesh;
				// window.mesh1 的名字需要改的 --- 2017年3月24日
			}
//			alert("csrmesh 中");
//			alert(window.mesh1);
//			window.mesh1 = mesh;
//			return window.mesh1;
			if( !has0Group ){
				mesh.groups.push({
					name:"All_Lights",
					deviceId:0,
					color:"#ffffff",
					power:0,
					brightness:0,
					Lights:[]
				})
			}
			
			return mesh;
		},
		storeMesh:function(/*mmesh*/){
			var lights = []
			var groups = []
			var mmesh = window.mesh1;
			console.log("mmesh beginto store : "+JSON.stringify(mmesh));
			if(mmesh){
				for(var light in mmesh.lights){
					var light = mmesh.lights[light]
//					console.log(light)
					lights.push({
						"name":light.name,
						"uuidHash":light.uuidHash,
						"deviceId":light.deviceId,
						"color":light.color,
						"power":light.power,
						"brightness":light.brightness,
						"maxGroups":light.maxGroups,
						"groups":light.groups
					})
				}
				for(var group in mmesh.groups){
					var group = mesh.groups[group]
//					console.log(group.lights)
					groups.push({
						"name":group.name,
						"deviceId":group.deviceId,
						"lights":group.lights,
						"color":group.color,
						"power":group.power,
						"brightness":group.brightness
					})
				}
				var meshNet = {"meshs":[
					{
						"meshName":"cl",
						"lights":lights,
						"groups":groups,
						"nextDeviceId":window.mesh1.nextDeviceId,
						"nextDeviceName":window.mesh1.nextDeviceName
					}
				]};
				
				window.localStorage.setItem("mesh",JSON.stringify(meshNet))
			}
			//正式插件中不需要这个功能 ；
			else if(!window.localStorage.getItem("mesh")){
				
				var meshNet = {"meshs":[{"meshName":"cl","lights":[{"name":"light_Lab","uuidHash":"ssssssss","deviceId":37265,"color":"#74aab5","power":0,"brightness":0,"maxGroups":4,"groups":[3,2,0]},{"name":"light1","uuidHash":"bbbbbbbb","deviceId":37267,"color":"#07ec94","power":0,"brightness":0,"maxGroups":4,"groups":[1,2,3,0]}],"groups":[{"name":"group_A","deviceId":1,"lights":[37267],"color":"#aee6a2","power":0,"brightness":0},{"name":"group_B","deviceId":2,"lights":[37265,37267,37267],"color":"#f9bd8c","power":0,"brightness":0},{"name":"group3","deviceId":3,"lights":[37265,37267],"color":"#2abd8c","power":0,"brightness":0},{"name":"group4","deviceId":0,"lights":[37265,37267],"color":"#23b38c","power":0,"brightness":0}]}]}
				window.localStorage.setItem("mesh",JSON.stringify(meshNet));
			}
			console.log("saved mesh :"+window.localStorage.getItem("mesh"));
			
		}
		
		
		
}