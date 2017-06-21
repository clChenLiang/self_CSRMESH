//插件调用
package com.cl.cordova.csrmesh;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.LOG;
import org.apache.cordova.PluginResult;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONException;
import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.ref.WeakReference;
import java.io.Console;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;;
//import CsrmeshMainActivity.MeshHandler;
//import CsrmeshMainActivity.blueScaninfo;
import android.widget.Toast;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothSocket;
import android.bluetooth.BluetoothAdapter.LeScanCallback;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.IntentFilter;
import android.os.Handler;
import android.os.Bundle;
import android.os.IBinder;
import android.os.Message;
import android.os.ParcelUuid;
import android.provider.Settings;
import android.util.Log;
import android.view.View;

import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.graphics.Color;

import com.csr.mesh.MeshService;
import com.csr.mesh.PowerModelApi;
import com.csr.mesh.PowerModelApi.PowerState;
import com.csr.mesh.ConfigModelApi;
import com.csr.mesh.LightModelApi;
import com.csr.mesh.AttentionModelApi;
import com.csr.mesh.GroupModelApi;

//修改版本历史记录
//2017年2月23日  --- 完善、并实现全部功能？

public class csrmeshPlugin extends CordovaPlugin{
	
	private static final int SCANTIMESECOND = 15;
	
	private BluetoothAdapter mBtAdapter = null;
	private  MeshService mService = null;
	private final  Handler mMeshHandler = new MeshHandler(this);
	private int mColorToSend = Color.rgb(0, 0, 0);
	private int mColor = 0;
	private boolean  mNewColor = true;
	private int mNumConnectAttempts=0;
	private boolean llll;
	private static HashSet<String> mScanAddreses = new HashSet<String>();
	private CallbackContext mCallbackContext = null;
	private CallbackContext mAssociateNew = null;
	private CallbackContext mAssociatedCallbackContext = null;//烦，不能去掉就实现不了
	private String address;
	private int brightness = 50;
	private String netWorkKey = "123";
//	2017年2月27日  增加绑定后获得到的deviceID;
	private Map<Integer,Integer> deviceByAssocia = new HashMap<Integer,Integer>();
	
//2017年2月23日
	private ArrayList<ScanInfo> mNewDevices = new ArrayList<ScanInfo>();

	
//	需要添加一个设置亮度的函数！！！ 2017年1月3日
//	是否可以将参数全部改为 getJSONObject 形式，便于统一。
//	
	
	@Override
	public boolean execute(String action ,JSONArray args,
			CallbackContext callbackContext)throws JSONException{
		
		try{
			if (mBtAdapter == null) {
			Log.v("BLE-CSR","mBtAdapter == null");
            Activity activity = cordova.getActivity();
            final BluetoothManager bluetoothManager = (BluetoothManager) activity.getSystemService(Context.BLUETOOTH_SERVICE);
            mBtAdapter = bluetoothManager.getAdapter();
			}
		}catch(Exception e){
				android.widget.Toast.makeText(cordova.getActivity()," s "+e.toString(),Toast.LENGTH_LONG).show();
				callbackContext.error("errors"+e.toString());
				return false;
			}

//		public /*final*/ WeakReference<CsrmeshMainActivity>  mActivity = new WeakReference<CsrmeshMainActivity>(CsrmeshMainActivity);
		if("startScan".equals(action)){
			try{
				mCallbackContext = callbackContext;
				startScan();
				Log.v("CSR","startScan");	
			}catch(Exception e){
//				android.widget.Toast.makeText(cordova.getActivity()," s "+e.toString(),Toast.LENGTH_LONG).show();
				callbackContext.error("errors"+e.toString());
				return false;
//				callbackContext.error("error"+e);
			}			
		}else if("stopScan".equals(action)){
			try{
				Log.v("CSR","stopScan");
				stopScan();
			}catch(Exception e){
				android.widget.Toast.makeText(cordova.getActivity()," s "+e.toString(),Toast.LENGTH_LONG).show();
				callbackContext.error("errors"+e.toString());
				return false;
//				callbackContext.error("error"+e);
			}
			
		}else if("findMesh".equals(action)){
			Log.v("CSR","findMesh");
			try{
				Log.v("CSR_Plugin","conn start!--1");
				address = args.getString(0)/*||"00:02:5B:00:15:83"*/;
				conn();
				Log.v("CSR_Plugin","conn start!--2 "+address);
				
			}catch(Exception e){
//				android.widget.Toast.makeText(cordova.getActivity()," s "+e.toString(),Toast.LENGTH_LONG).show();
				callbackContext.error("errors"/*+e.toString()*/);
//				差别错开，对比callbackContext.error的不同
				return false;
			}
			callbackContext.success("right");
			return true;
		}else if("setKey".equals(action)){
			//暂无，不需要实现
			Log.v("CSR","SETKEY");
//			Log.v("CSR","SETKEY");
		}else if("setPower".equals(action)){
			Log.v("CSR","setPower");
			Log.v("CSR","State : "+args.getString(1)+" deviceId : "+ args.getInt(0)/*+args.getInt(1)*/);
			//args.getString()  getInt  getJSONArrary  ,后面的参数，都是唯一的，为参数列表中的序号
			if("on".equals(args.getString(1))){
				Log.v("CSR","state ："+args.getString(1));
				PowerModelApi.setState(args.getInt(0), PowerState.ON, false);
			//PowerModelApi.setState(0, PowerState.ON, false);
			}else if("off".equals(args.getString(1))){
				Log.v("CSR","state ："+args.getString(1));
				PowerModelApi.setState(args.getInt(0), PowerState.OFF, false);
			}
			//Toast.makeText(cordova.getActivity(), "setPower + ", Toast.LENGTH_LONG).show();
		}else if("setColor".equals(action)){
			float[] hsv = new float[3];
//			2017年2月27日 --- 原代码遗漏deviceID 
			mColor = args.getInt(1);
	        Color.colorToHSV(mColor, hsv);
//	        hsv[2] = ((float) brightness + 1) / 100.0f;
//	        2017年4月7日：可以去掉不用 --- 当前页面使用的 jcolor 返回来的是带亮度的RGB
	        mColorToSend = Color.HSVToColor(hsv);
	        Log.v("CSR","setColor :"+mColorToSend+" id: "+args.getInt(0));
	        mNewColor = true;
	        byte red = (byte) (Color.red(mColorToSend) & 0xFF);
            byte green = (byte) (Color.green(mColorToSend) & 0xFF);
            byte blue = (byte) (Color.blue(mColorToSend) & 0xFF);
	        LightModelApi.setRgb(args.getInt(0), red, green, blue, (byte)0xFF, 0, false);
	        callbackContext.success();
	        //			mDeviceId = args.getInt(0);
		}else if("setBrightness".equals(action)){
			brightness = args.getInt(1);
			Log.v("CSR","setBrightness"+brightness);
			mNewColor = true;
			//颜色转换 2017年1月4日
			float[] hsv = new float[3];
	        Color.colorToHSV(mColor, hsv);
	        hsv[2] = ((float) brightness + 1) / 100.0f;
	        mColorToSend = Color.HSVToColor(hsv);
	        callbackContext.success();
		}else if("getAssociableDevice".equals(action)){
//2017年2月23日
			//return mNewDevices数组
//			callbackContext.success(mNewDevices);
//			mNewDevices此处只为ArrayList;后续应该改成JSONObject
			String message = new String();
//			message = "{";
			
//			2017年5月18日  清空存储的所有已发现设备;即重新执行扫描过程
			mNewDevices.clear();

			mAssociatedCallbackContext = callbackContext;
			
			if(mNewDevices.size()>0){
				for(int i=0;i< mNewDevices.size();i++){
//					if( i == 0 ){
//						message += mNewDevices.get(i).uuidHash;
//					}else{
//						message += ","+mNewDevices.get(i).uuidHash;
//					}	
					JSONObject deviceresult = new JSONObject();
					try {
						deviceresult.put("name",mNewDevices.get(i).name);
//						deviceresult.put("uuid",mNewDevices.get(i).uuid);
						deviceresult.put("uuidHash",mNewDevices.get(i).uuidHash);
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					PluginResult result = new PluginResult(PluginResult.Status.OK,deviceresult);
					Log.v("BLE","返回的设备为： "+deviceresult);
		            result.setKeepCallback(true);
		            mAssociatedCallbackContext.sendPluginResult(result);
				}
			}else{
				message = "no result";	
				PluginResult result = new PluginResult(PluginResult.Status.OK,message);
				Log.v("BLE","返回的设备为： "+message);
	            result.setKeepCallback(true);
	            mAssociatedCallbackContext.sendPluginResult(result);
			}
			
//			PluginResult result = new PluginResult(PluginResult.Status.OK,message);
//			//2017年2月27日     1445519578
////			Log.v("BLE",""+mNewDevices.size()+""/*+mNewDevices.get(1)*/);
//			Log.v("BLE","返回的设备集为： "+message+mNewDevices.size());
//			//不能确定是否可以传过去
//            result.setKeepCallback(true);//2017年2月25日 -- cordova 应用中没有回调故改为true ;不一定对，待定
//            callbackContext.sendPluginResult(result);//是不是没有调用到指定 success ,error 函数
//            callbackContext.success();
		}else if("associate".equals(action)){
//2017年2月24日,绑定设备
//			2017年5月18日：将uuid转为uuidHash;为了统一，去掉 整数的 hash 
//			int uuidhash_fromUuid ;
//			uuidhash_fromUuid =  MeshSevice.getDeviceHashFromUuid( UUID.fromString(args.getString(0)) );
//			args.getString(0)
//			mService.associateDevice(uuidhash_fromUuid,0);//可以的话，将后一个参数0改为可以支持arthu的
			mService.associateDevice(args.getInt(0),0);
//			2017-5-18 ：需要删除已经绑定的设备 --- 因为每次获取的时候，清空设备列表，可忽略
			
			
//2017年2月27日，绑定回调函数，发回设备绑定后得到的deviceID.
//		因为实现起来有点难度，待参考其它方案和源码；
//		暂定实现方案为： JS端重新发回获取设备列表请求，这里返回新绑定上的
//			PluginResult result = new PluginResult(PluginResult.Status.OK,)
			mAssociateNew = callbackContext;
			Log.v("BLE","cordova in associate with args :"+args.getInt(0));//测试语句，成功后删除
			
		}else if("setGroups".equals(action)){
			int deviceId = args.getInt(0);
			int model = LightModelApi.MODEL_NUMBER;
//			ArrayList<Integer> groupdIds = args.getJSONObject(1).getObject();
			String grIDs = args.getString(1);//传过来的数组以字符串的形式传过来
			String[] grIDS = grIDs.split(",");
			Log.v("BLE","grIDs :"+grIDs);
			ArrayList<Integer> groupIds=new ArrayList<Integer>();
			for(String ids : grIDS ){
				groupIds.add(Integer.parseInt(ids));
				Log.v("BLE","待分配的groupID ："+ids);
			}
			groupDistribute(deviceId,model,groupIds);
		}else if("getDeviceId".equals(action)){
			int uuidHashWanted = args.getInt(0);
			int deviceID = deviceByAssocia.get(uuidHashWanted);
			Log.v("BLE","getDevcieId :"+deviceID+" HASH :"+uuidHashWanted);
			//需要进行一个判断，是否行为合法。此处测试，暂不实现
			PluginResult result = new PluginResult(PluginResult.Status.OK,deviceID);
			callbackContext.sendPluginResult(result);
			
		}else if("setNextDeviceId".equals(action)){
			//初始化 nextDeviceId
			Log.v("BLE","1设置蓝牙MESH的"+(args.getInt(0)+1));
			mService.setNextDeviceId((args.getInt(0)+1));
			Log.v("BLE","2设置蓝牙MESH的"+args.getInt(0)+1);
		}else if("resetDevice".equals(action)){
			Log.v("BLE","还原设备："+(args.getInt(0)));
			ConfigModelApi.resetDevice(args.getInt(0));
			callbackContext.success();
		}
			//callbackContext.success("succ");
		return true;
	}
	
	
	public void groupDistribute(int deviceId , int model, ArrayList<Integer> groupIds ){
		//先假设只有四个
		while (groupIds.size() < 4){
			groupIds.add(0);
		}		
		for(int i = 0 ;i<groupIds.size();i++){
			GroupModelApi.setModelGroupId(deviceId, LightModelApi.MODEL_NUMBER, i, 0, groupIds.get(i));
			GroupModelApi.setModelGroupId(deviceId, PowerModelApi.MODEL_NUMBER, i, 0, groupIds.get(i));
			
			Log.v("BLE", "配置分组  --- groupId："+groupIds.get(i)+"deviceId:"+deviceId);
		}
		
	}
	
	public void startScan(){
		if (mBtAdapter.isEnabled()) {
//          scanLeDevice(true);
			try{
//2017年1月3日 需要加停止扫描的延时函数！！！
//				mHandler.posetDelayed(scanTimeout,mScanTime);
//				mHandler.posetDelayed(stopScan,mScanTime);
//2017年4月10日   验证是否成功调用 
//				cordova.requestPermission()
				if(mBtAdapter.startLeScan(mLeScanCallback)){
					Log.v("BLE-success_scan", "yes");
				}else{
					Log.v("BLE-success_scan", " no");
				};
				Log.v("BLE","startLeScan begin :270");
			}
			catch(Exception e){
				System.out.println("ERRORERRORERRORERRORERROR :  "+e);
//				Toast.makeText(this, "ERROR+"+e, Toast.LENGTH_LONG).show;
			}
      }else{
//      	Toast.makeText(cordova.getActivity(),"蓝牙未打开！",Toast.LENGTH_LONG).show();
//      2017年4月11日   更改为主动申请是否打开
    	  if (mBtAdapter == null || !mBtAdapter.isEnabled()) {
              Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
              cordova.startActivityForResult(this,enableBtIntent, 1);
          }
      }
	}
	
//	2017年4月11日  申请打开蓝牙的回调函数
//	 @Override
	    public void onActivityResult(int requestCode, int resultCode, Intent data) {
//	        mCheckBt = false;
	        if (requestCode == 1 && resultCode != -1) {
//	            mScanButton.setEnabled(false);
	            Toast.makeText(cordova.getActivity(), "蓝牙不能打开 ", Toast.LENGTH_LONG).show();
	        }
	    }
	
	public void stopScan(){
		mBtAdapter.stopLeScan(mLeScanCallback);
		mScanAddreses.clear();
		Log.v("BLE", "stop the LeScan!");
	}
	
	public void conn(){
		Log.v("BLE", "CONN button is clicked ");
		try{
			final Activity act = cordova.getActivity();
			Intent bindIntent = new Intent(act, MeshService.class);
			act.startService(bindIntent);
			act.getApplicationContext().bindService(bindIntent, mServiceConnection, Context.BIND_AUTO_CREATE);
		}catch(Exception e){
			Log.v("BLE", " conn error:  "+e);
		}
       Log.v("BLE", "CONN button is clicked ");
	}
	
//	2016年12月23日：注释掉两句scanInfo,data.add();
	private LeScanCallback mLeScanCallback = new LeScanCallback() {
		@Override
	        public void onLeScan(final BluetoothDevice device, final int rssi, final byte[] scanRecord) {
//	添加  列表 ：deviceScaned     
	   //2017年4月10日   打开 runnable()
/*//	        	Handler handler = new Handler();
//	            handler.postDelayed(
//	            		new Runnable(){
//	    	        		@Override
//	    	        		public void run(){
//	    		        			Log.v("BLE", "run in the callback!");
//	    		                	if (device.getName() == null) {
//	    		                		return;
//	    		                	}
//	    		                	if (!mScanAddreses.contains(device.getAddress())) {    
//	    		                        mScanAddreses.add(device.getAddress());
//	    		                        //	                        Log.v('CSR',"新出现的DEVICE : "+device.getAddress());
//	    		                        Log.v("CSR","new device is : "+device.getAddress());
//	    		                        //2017年1月3日 待解决---多次回调
//	    		                        PluginResult result = new PluginResult(PluginResult.Status.OK,device.getAddress());
//	    		                        result.setKeepCallback(true);
//	    		                        mCallbackContext.sendPluginResult(result);
//	    		                        //	                        mCallbackContext.success(device.getAddress());
//	    		                    }
//	    		                    
//	    		                    
//	    		                	Log.v("BLE", device.getName()+"  : "+device.getAddress()+"uuid: "+device.getUuids());
//
//	    	        			}
//	    	        		},1000*SCANTIMESECOND);
*/			
//			synchronized(this){
				boolean isNewDevice = false;
				if (!mScanAddreses.contains(device.getAddress())&&device.getType() == BluetoothDevice.DEVICE_TYPE_LE) {    
                    mScanAddreses.add(device.getAddress());
                    //	                        Log.v('CSR',"新出现的DEVICE : "+device.getAddress());
                    Log.v("CSR","new device is : "+device.getAddress());
                    //2017年1月3日 待解决---多次回调
                    PluginResult result = new PluginResult(PluginResult.Status.OK,device.getAddress());
                    result.setKeepCallback(true);
                    mCallbackContext.sendPluginResult(result);
                    //	                        mCallbackContext.success(device.getAddress());
                    isNewDevice = true;
                }else{
                	isNewDevice = false;
                }
//				String device_result = "{"+"'isNew':"+(isNewDevice?"true":"false")+",'name':'"+device.getName()+"','address':'"+device.getAddress()+"','rssi':"+rssi+"}";
//				String device_result = '{'+'"isNew":'+(isNewDevice?'true':'false')+',"name":"'+device.getName()+'","address":"'+device.getAddress()+'","rssi":'+rssi+'}';
//				String device_result = "{"+"\"isNew\":"+(isNewDevice?"true":"false")+",\"name\":\""+device.getName()+"\",\"address\":\""+device.getAddress()+"\",\"rssi\":"+rssi+"}";
//				String device_result = 'aldkfj';//JAVA 不支持单引号字符串
//				PluginResult result = new PluginResult(PluginResult.Status.OK,device.getName()+"%"+device.getAddress()+rssi);
//				String device_result = "{"+"\"isNew\":"+(isNewDevice?"true":"false"));
				JSONObject deviceresult = new JSONObject();
				try {
//					deviceresult.put("cl", "cl");
				
					deviceresult.put("isNew",isNewDevice);
					deviceresult.put("name",device.getName());
					deviceresult.put("address",device.getAddress());
					deviceresult.put("rssi",rssi);
//				JSONArray device_array = JSONArray.fromObject(device_result);
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				PluginResult result = new PluginResult(PluginResult.Status.OK,deviceresult);
                result.setKeepCallback(true);
                mCallbackContext.sendPluginResult(result);
				Log.v("BLE-SCAN",deviceresult.toString());
			}
			//成功传回扫描到的设备信息
//	    }
//	        Log.v("BLE-SCAN",device.getName()+":"+device.getAddress());
	};
	
	//删除
	public void onLeScan(final BluetoothDevice device, final int rssi, final byte[] scanRecord) {
	        Log.v("BLE-SCAN",device.getName()+":"+device.getAddress());
	};
	
	
	 private ServiceConnection mServiceConnection = new ServiceConnection() {
	        public void onServiceConnected(ComponentName className, IBinder rawBinder) {
	        	Log.v("BLE", "mService localBinder is success");
	            mService = ((MeshService.LocalBinder) rawBinder).getService();
	            
	            
	            mService.setDeviceDiscoveryFilterEnabled(true);
//		        新加的 setNetworkPassPhrase -- 2016年12月7日
		        mService.setNetworkPassPhrase(netWorkKey);
	            if (mService != null) {
	            	// Start the required transport.                
	                mMeshHandler.postDelayed(connectTimeout, 10000);
//	            	缺少一个LocalStorage 即    restoreSettings
	                connect();
	            }
	        }
	        public void onServiceDisconnected(ComponentName classname) {
	            mService = null;
	            Log.v("BLE-CSR","onServiceDisconnected");
	        }
	 };
	 
	 
//	 可以从 findMesh 中抽离出来，独立应用于连接函数！！！
	 private void connect() {
	    	BluetoothDevice bridgeDevice = mBtAdapter.getRemoteDevice(address);
 	
	    	Log.d("BLE", "Connect attempt "  +mNumConnectAttempts+ ", address: " + bridgeDevice.getAddress()+"uuid: "+bridgeDevice.getUuids());
	    	mService.setHandler(mMeshHandler);
	        mService.setLeScanCallback(mScanCallBack);
	        mService.connectBridge(bridgeDevice);
	       
	 }
	    
	 private static class MeshHandler extends Handler {
//2016-12-28 20:26:59 ，因为原代码中，这段代码生效，但在插件里去掉Activity后不生效，准备改回activity形式
	        private final WeakReference<csrmeshPlugin> mActivity;

	        public MeshHandler(csrmeshPlugin activity) {
	            mActivity = new WeakReference<csrmeshPlugin>(activity);
	        }

	        public void handleMessage(Message msg) {
	        	csrmeshPlugin parentActivity = mActivity.get();
	            switch (msg.what) {
	            case MeshService.MESSAGE_LE_CONNECTED: {            	
	                Log.v("BLE","MESSAGE_LE_CONNECTED");
	                parentActivity.onConnected();
	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                Log.v("BLE", "UUIDhash : "+uuidHash);
	                break;
	            }
	            case MeshService.MESSAGE_LE_DISCONNECTED: {

	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                Log.v("BLE", "UUIDhash : "+uuidHash);
	            	Log.v("BLE", "MESSAGE_LE_DISCONNECTED--断开连接");
	            	break;
	            }
	            case MeshService.MESSAGE_TIMEOUT:{

	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                Log.v("BLE", "UUIDhash : "+uuidHash);
	            	int expectedMsg = msg.getData().getInt(MeshService.EXTRA_EXPECTED_MESSAGE);
	                int id;
	                int meshRequestId;
	                if (msg.getData().containsKey(MeshService.EXTRA_UUIDHASH_31)) {
	                	id = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                }
	                else {
	                	id = msg.getData().getInt(MeshService.EXTRA_DEVICE_ID);
	                }
	                meshRequestId = msg.getData().getInt(MeshService.EXTRA_MESH_REQUEST_ID);
	                Log.v("BLE", "MESSAGE_TIMEOUT  :  "+id+"  "+ meshRequestId);
	                break;
	            }
	            //2017年2月23日 --- 设备被发现后所做的处理---绑定的一部分。
//	            
	            case MeshService.MESSAGE_DEVICE_DISCOVERED: {	                
	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                ParcelUuid uuid = msg.getData().getParcelable(MeshService.EXTRA_UUID);  
	                Log.v("BLE","discovered uuid :"+uuid+ "UUIDhash : "+uuidHash);
	                int rssi = msg.getData().getInt(MeshService.EXTRA_RSSI);    
	                int ttl = msg.getData().getInt(MeshService.EXTRA_TTL);
//	                parentActivity.mService.setDeviceDiscoveryFilterEnabled(false);
//	                parentActivity.newUuid(uuid.getUuid(), uuidHash, rssi, ttl);//或者直接使用 mDevices.add();
//	                newUuid(uuid.getUuid(), uuidHash, rssi, ttl);//或者直接使用 mDevices.add();
	                //或者crsmeshPlugin.newUuid  可能出错
	                
	                Log.v("BLE", "MESSAGE_DEVICE_DISCOVERED  :  "+uuidHash+"  "+ ttl);
	                break;
	            }
	            case MeshService.MESSAGE_DEVICE_APPEARANCE: {
	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                ParcelUuid uuid = msg.getData().getParcelable(MeshService.EXTRA_UUID);
	                // 该APPEARANCE 中并无uuid
//	            	Log.v("BLE", "MESSAGE_DEVICE_APPEARANCE  :  ");
	                int rssi = msg.getData().getInt(MeshService.EXTRA_RSSI);    
	                int ttl = msg.getData().getInt(MeshService.EXTRA_TTL);
	                String shortName = msg.getData().getString(MeshService.EXTRA_SHORTNAME);   
	                Log.v("BLE", "MESSAGE_DEVICE_APPEARANCE ,UUIDhash : "+uuidHash+"uuid: "+uuid+" name:"+shortName+" apperance: "+msg.getData().getByteArray(MeshService.EXTRA_APPEARANCE)+"T:"+ttl+"r:"+rssi);
//	                parentActivity.newUuid(uuid!=null?uuid.getUuid():uuidHash,shortName, uuidHash, rssi, ttl);
	                parentActivity.newUuid(shortName, uuidHash, rssi, ttl);
	                break;
	            }
	            case MeshService.MESSAGE_DEVICE_ASSOCIATED: {
	            	int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	            	int deviceIdAssociated = msg.getData().getInt(MeshService.EXTRA_DEVICE_ID);
	            	parentActivity.deviceByAssocia.put(new Integer(uuidHash),new Integer(deviceIdAssociated));
	            	
	            	//回调函数，返回给页面，成功： uuidHash,deviceId
	            	// 插件根据这个来准备设置功能，
	            	
//	            	mAssociateNew.sendRequest
	            	parentActivity.newDevice(uuidHash,deviceIdAssociated);
	            	Log.v("BLE","associated is connetted ! deviceId is "+ deviceIdAssociated+" with uuidHash : "+uuidHash);
	                break;
	            }
	            case MeshService.MESSAGE_CONFIG_DEVICE_INFO: {
//2016-12-23	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
//	                Log.v("BLE", "UUIDhash : "+uuidHash);
	            	
	                Log.v("BLE", "MESSAGE_CONFIG_DEVICE_INFO");
	                break;
	            }
	            case MeshService.MESSAGE_GROUP_NUM_GROUPIDS: {
//2016-12-23	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
//	                Log.v("BLE", "UUIDhash : "+uuidHash);

	                Log.v("BLE", "MESSAGE_GROUP_NUM_GROUPI");
	                break;
	            }
	            case MeshService.MESSAGE_GROUP_MODEL_GROUPID: {  
	            	//2016-12-23	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
//	                Log.v("BLE", "UUIDhash : "+uuidHash);
       	
	                Log.v("BLE", "MESSAGE_GROUP_MODEL_GROUPID");
	                break;
	            }
	            case MeshService.MESSAGE_FIRMWARE_VERSION:
	            	//2016-12-23	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
//	                Log.v("BLE", "UUIDhash : "+uuidHash);

	            	Log.v("BLE", "MESSAGE_FIRMWARE_VERSION");
	            	break;
	            case MeshService.MESSAGE_ASSOCIATING_DEVICE:
//	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                Log.v("BLE", "UUIDhash : "+ msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31));

	            	Log.v("BLE", "MESSAGE_ASSOCIATING_DEVICE");
	            	break;
	            case MeshService.MESSAGE_RECEIVE_STREAM_DATA_END:
//	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                Log.v("BLE", "UUIDhash : "+ msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31));

	            	Log.v("BLE", "MESSAGE_RECEIVE_STREAM_DATA_END");
	            	
	            }            
	        }
	    };
//2016-12-23 伪parentActivity
	    public void onConnected(){
			 mMeshHandler.postDelayed(transmitCallback,240);
			 Log.v("BLE", "LE onconnect ");
			 mMeshHandler.removeCallbacks(connectTimeout);
		 }
//	    
	    private Runnable transmitCallback = new Runnable() {
	        @Override
	        public void run() {
	        	Log.v("BLE", "transmitCallback RUN : "+ mNewColor +"  Color is:"+ mColorToSend);
//	            if (mNewColor) {
//	                          
//	                    byte red = (byte) (Color.red(mColorToSend) & 0xFF);
//	                    byte green = (byte) (Color.green(mColorToSend) & 0xFF);
//	                    byte blue = (byte) (Color.blue(mColorToSend) & 0xFF);
//	                    Log.v("BLE-COLOR", "the mColorTosend is B: "+ mColorToSend );
//	                    try{
//	                    	LightModelApi.setRgb(0, red, green, blue, (byte)0xFF, 0, false);
//	                    	Log.v("LightModelApi", "LightModelApi  successed : "+mColorToSend);
////	                    	
//	                    }catch(Exception e){
//	                    	Log.v("LightModelApi", "LightModelApi not successed : "+e);
//	                    }
//	                	Log.v("BLE-COLOR","the mColorTosend is A : "+ mColorToSend);
////	                	Log.v("BLE-COLOR","the mColorTosend BLUE is : "+ Color.BLUE);
//	                mNewColor = false;
//	            }                        
//	            mMeshHandler.postDelayed(this, 1000);
	        }
	    };
//	    
	    private LeScanCallback mScanCallBack = new LeScanCallback() {
	        @Override
	        public void onLeScan(BluetoothDevice device, int rssi, byte[] scanRecord) { 
	        	Log.v("BLE","mScanCallBack : rssi "+rssi);
	        	mService.processMeshAdvert(scanRecord, rssi);
	        }
	 };
//	2017年2月23日
//	 可能不需要 static
	 void newUuid(String name, int uuidHash, int rssi, int ttl) {
		Log.v("BLE", "Association newUuid");
		boolean existing = false;
		Log.v("BLE", "Associated uuidHash :"+"\n"+uuidHash);
		for (ScanInfo info : mNewDevices) {
		    if (info.uuidHash == uuidHash) {
//		    	2017-5-18： 增加 uuid 的方法
		        info.rssi = rssi;
		        info.ttl = ttl;
		        info.updated();
		        existing = true;
		        break;
		    }
		}
		if (!existing) {
			ScanInfo info = new ScanInfo(name ,rssi, uuidHash,ttl);
			mNewDevices.add(info);
			//2017年4月13日  增加绑定设备的回调 --- 分成两个部分，一个是立即返回 mNewDevices 的设备，
			//另一个根据mServices 在新发现设备上的的更新,每发现一个，重新发送整个 mNewDevices 
			//
			if(mAssociatedCallbackContext != null){
				String message = new String();
				for(int i=0;i< mNewDevices.size();i++){
	//					if( i == 0){
	//						message += mNewDevices.get(i).uuidHash;
	//					}else{
	//						message += ","+mNewDevices.get(i).uuidHash;
	//					}					
					JSONObject deviceresult = new JSONObject();
					try {
						deviceresult.put("name",mNewDevices.get(i).name);
						deviceresult.put("uuid",/*mNewDevices.get(i).uuid ||*/ mNewDevices.get(i).uuidHash);
						deviceresult.put("uuidHash",mNewDevices.get(i).uuidHash);
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					PluginResult result = new PluginResult(PluginResult.Status.OK,deviceresult);
					Log.v("BLE","返回的设备集为2： "+deviceresult);
		            result.setKeepCallback(true);
		            mAssociatedCallbackContext.sendPluginResult(result);
				}
			}
		}        
	}

	 
	 void newDevice(int uuidHash,int deviceId){
		 if(mAssociateNew != null){
			 JSONObject newDevice = new JSONObject();
			 try{
				 newDevice.put("uuidHash",uuidHash);
				 newDevice.put("deviceId",deviceId);
				 
			 }catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
			 }
			 PluginResult result = new PluginResult(PluginResult.Status.OK,newDevice);
			 mAssociateNew.sendPluginResult(result);
			 Log.v("BLE","返回可绑定设备："+newDevice);
			 mAssociateNew = null;
		 }
		 
	 }
//	 2017年4月13日
//	 延时停止 扫描、  mAssociatedCallbackContext等回调函数
//	 mAssociatedCallbackContext = null;  stopScan ;清空 mNewDevices;
	 
	 
	 
	 
//	 2017年2月23日
	 private static class ScanInfo implements Comparable<ScanInfo>{
	        
	    	private static final long TIME_SCANINFO_VALID = 5* 1000; // 5 secs
	        
//			public String uuid;        
	        public int rssi;
	        public int uuidHash;
	        public long timeStamp;
	        public int ttl;
	        public String name;
	//        public Appearance appearance;
	        public ScanInfo(String name, int rssi, int uuidHash, int ttl) {
	        	Log.v("BLE", "Association " + "  "+uuidHash);
//	            this.uuid = uuid;
	            this.rssi = rssi;
	            this.uuidHash = uuidHash;
	            this.ttl = ttl;
	            //date:2017年4月14日
	            this.name = name;
	//            updated();
	        }
			public void updated() {
	        	Log.v("BLE", "Association updated");
				this.timeStamp = System.currentTimeMillis();
			}
			@Override
			public int compareTo(ScanInfo info) {
				// return 
				if(this.rssi>info.rssi)
					return -1;
				else if(this.rssi<info.rssi)
					return 1;
				return 0;
			}
		
			public boolean isInfoValid(){
	        	Log.v("BLE", "Association isInfoValid");
				return ((System.currentTimeMillis()-this.timeStamp)<TIME_SCANINFO_VALID);
			}
			
	    }
	 
	 public void associateDevice(int uuidHash) {
			Log.v("BLE", "associateDevice :"+uuidHash);
	        mService.associateDevice(uuidHash, 0);
	    }
	 
	 private Runnable connectTimeout = new Runnable() {
	        @Override
	        public void run() {
	    		Log.v("BLE", "connectTimeout");
	        	if (mNumConnectAttempts < 3) {
	        		mMeshHandler.postDelayed(connectTimeout, 10000);
	        		connect();
	        	}
	        	else {
		        	Log.v("BLE", "connect fail with : mNumConnectAttempts :"+mNumConnectAttempts);
//		        	finish();
	        	}
	        	mNumConnectAttempts++;
	        }        
	    };
	    
//2016年12月29日 添加 onDestroy事件
	    @Override
		public void onDestroy() {
	    	Log.v("BLE-CSR","unbindService");
			cordova.getActivity().unbindService(mServiceConnection);
		}
}