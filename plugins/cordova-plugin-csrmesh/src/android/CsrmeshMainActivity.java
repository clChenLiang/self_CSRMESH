//照搬MainActivity，实现bindService和MeshBlandler
package com.cl.cordova.csrmesh;

//import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.os.ParcelUuid;
import android.os.SystemClock;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothAdapter.LeScanCallback;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.graphics.Color;

import java.io.Console;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONException;
import org.json.JSONObject;



import com.csr.mesh.MeshService;
import com.csr.mesh.PowerModelApi;
import com.csr.mesh.PowerModelApi.PowerState;
import com.csr.mesh.ConfigModelApi;
import com.csr.mesh.LightModelApi;
import com.csr.mesh.AttentionModelApi;

//import com.csr.csrmeshdemo.entities.Setting;
//import com.csr.mesh.*;



public class CsrmeshMainActivity extends Activity {

	private boolean  mNewColor = true;
	private int mColorToSend = Color.rgb(0, 0, 0);
	
	private BluetoothAdapter mBtAdapter = null;
	private Arrays ble_Arrarys; 
	private ArrayList<blueScaninfo> data;
	private final  Handler mMeshHandler = new MeshHandler(this);
	
	private int mNumConnectAttempts=0;
	public TextView textview;
	public Button button1;
	private  MeshService mService = null;
	private boolean power = true;
//	private static ScanResultsAdapter mScanResultsAdapter;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
//		setContentView(R.layout.activity_main);
		final BluetoothManager btManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
		mBtAdapter = btManager.getAdapter();
		/*textview = (TextView)findViewById(R.id.textView1); 
		button1 = (Button)findViewById(R.id.button1);*/
		Log.v("CSR","startActivity success");
		
	
	}
	
	public void changeCorlor1(View v){
//        目前已经连接上灯泡，接下来就是控制灯泡的明暗与颜色了
//        byte red = (byte)(Color.red(Color.BLUE) & 0xFF);
//        byte green = (byte)(Color.green(Color.BLUE) & 0xFF);
//        byte blue = (byte)(Color.blue(Color.BLUE) & 0xFF);
//        ConfigModelApi.resetDevice(0);
//        LightModelApi.setRgb(0x0000, red, green, blue,  (byte)0xFF, 0, false);
		mNewColor = true;
		mColorToSend = -49812;
//        第一个参数  deviceId 待查，应该不是address，为  Mesh 网里的ID
        Log.v("BLE-send color", "color blue has send ");
	}
	
	public void changeCorlor2(View v){
//      byte red = (byte)(Color.red(Color.GREEN) & 0xFF);
//      byte green = (byte)(Color.green(Color.GREEN) & 0xFF);
//      byte blue = (byte)(Color.blue(Color.GREEN) & 0xFF);
//      LightModelApi.setRgb(0x0000, red, green, blue,  (byte)0xFF, 0, false);
//      ConfigModelApi.resetDevice(0);
		mNewColor = true;
		mColorToSend = 0;
      Log.v("BLE-send color", "color green has send ");
	}
	
	public void changeCorlor3(View v){
//      byte red = (byte)(Color.red(Color.RED) & 0xFF);
//      byte green = (byte)(Color.green(Color.RED) & 0xFF);
//      byte blue = (byte)(Color.blue(Color.RED) & 0xFF);
//      LightModelApi.setRgb(0x0000, red, green, blue,  (byte)0xFF, 0, false);
//      ConfigModelApi.resetDevice(0);
		mNewColor = true;
		mColorToSend = -11935745;
      Log.v("BLE-send color", "color red has send ");
	}

/*	public void off(View v){
		if(power){
			PowerModelApi.setState(0, PowerState.OFF, false);
			mNewColor = false;
			power = false;
		}else{
			PowerModelApi.setState(0, PowerState.ON, false);
			mNewColor = true;
			power = true;
		}
	}*/
	public void off(){
		if(power){
			PowerModelApi.setState(0, PowerState.OFF, false);
			mNewColor = false;
			power = false;
		}else{
			PowerModelApi.setState(0, PowerState.ON, false);
			mNewColor = true;
			power = true;
		}
	}
	
/*	public void conn(View v){
		Log.v("BLE", "CONN button is clicked ");
		try{
			Intent bindIntent = new Intent(this, MeshService.class);
	        bindService(bindIntent, mServiceConnection, Context.BIND_AUTO_CREATE);
		}catch(Exception e){
			Log.v("BLE", " conn error:  "+e);
		}
		
        Log.v("BLE", "CONN button is clicked ");
	}*/
	
	public void conn(){
		Log.v("BLE", "CONN button is clicked ");
		try{
			Intent bindIntent = new Intent(this, MeshService.class);
	        bindService(bindIntent, mServiceConnection, Context.BIND_AUTO_CREATE);
		}catch(Exception e){
			Log.v("BLE", " conn error:  "+e);
		}
		
        Log.v("BLE", "CONN button is clicked ");
	}
	
	 private ServiceConnection mServiceConnection = new ServiceConnection() {
	        public void onServiceConnected(ComponentName className, IBinder rawBinder) {
	            mService = ((MeshService.LocalBinder) rawBinder).getService();
	            Log.v("BLE", "mService localBinder is success");
	            
	            mService.setDeviceDiscoveryFilterEnabled(true);
//		        新加的 setNetworkPassPhrase -- 2016年12月7日
		        mService.setNetworkPassPhrase("123");
		        
	            if (mService != null) {
	            	// Start the required transport.                
	                mMeshHandler.postDelayed(connectTimeout, 10000);
//	            	缺少一个LocalStorage 即    restoreSettings
	                connect();
	            }
	        }

	        public void onServiceDisconnected(ComponentName classname) {
	            mService = null;
	        }
	 };
	 private Runnable connectTimeout = new Runnable() {
	        @Override
	        public void run() {
	    		Log.v("BLE", "connectTimeout");
	        	if (mNumConnectAttempts < 3) {
	        		mMeshHandler.postDelayed(connectTimeout, 10000);
	        		connect();
	        	}
	        	else {
		        	Log.v("BLE", "mNumConnectAttempts :"+mNumConnectAttempts);
		        	finish();
	        	}
	        }        
	    };    
	 
	 private void connect() {
	    	BluetoothDevice bridgeDevice = mBtAdapter.getRemoteDevice("00:02:5B:00:15:83");
    	
	    	Log.d("BLE", "Connect attempt "  + ", address: " + bridgeDevice.getAddress()+"uuid: "+bridgeDevice.getUuids());
	    	mService.setHandler(mMeshHandler);
	        mService.setLeScanCallback(mScanCallBack);
	        mService.connectBridge(bridgeDevice);
	       
	 }
	 
	 
	 
	    private Runnable transmitCallback = new Runnable() {
	        @Override
	        public void run() {
	        	Log.v("BLE", "transmitCallback RUN : "+ mNewColor +"  Color is:"+ mColorToSend);
	            if (mNewColor) {
	                          
	                    byte red = (byte) (Color.red(mColorToSend) & 0xFF);
	                    byte green = (byte) (Color.green(mColorToSend) & 0xFF);
	                    byte blue = (byte) (Color.blue(mColorToSend) & 0xFF);
	                    Log.v("BLE-COLOR", "the mColorTosend is B: "+ mColorToSend );
	                    try{
	                    	LightModelApi.setRgb(0, red, green, blue, (byte)0xFF, 0, false);              
	                    }catch(Exception e){
	                    	Log.v("LightModelApi", "LightModelApi not successed : "+e);
	                    }
	                	Log.v("BLE-COLOR","the mColorTosend is A : "+ mColorToSend);
//	                	Log.v("BLE-COLOR","the mColorTosend BLUE is : "+ Color.BLUE);
	                mNewColor = false;
	            }                        
	            mMeshHandler.postDelayed(this, 1000);
	        }
	    };

	 private LeScanCallback mScanCallBack = new LeScanCallback() {
	        @Override
	        public void onLeScan(BluetoothDevice device, int rssi, byte[] scanRecord) { 
	        	Log.v("BLE","mScanCallBack : rssi "+rssi);
	        	mService.processMeshAdvert(scanRecord, rssi);
	        }
	 };
	 
	 public void onConnected(){
		 mMeshHandler.postDelayed(transmitCallback,240);
//		 AttentionModelApi.setState(0,true,1000);
//		 疑似遗漏的方法
		 Log.v("BLE", "LE onconnect ");
		 mMeshHandler.removeCallbacks(connectTimeout);
	 }
	 
	 public void associ(View v){
		 //
//		 AttentionModelApi.setState(0, true, 20000);
//		 associateDevice(0);
//		 暂时不能发现问题所在 
//		 一点击该函数 就会进入组网状态，灯泡闪烁等待
//		 疑似是下面的这个函数造成的--待查！！
//		 ConfigModelApi.resetDevice(0);
	 }
	 
//	associateDevice方法
    public void associateDevice(int uuidHash) {
		Log.v("BLE", "associateDevice :"+uuidHash);
        mService.associateDevice(uuidHash, 0);
    }
    
    public boolean associateDevice(int uuidHash, String shortCode) {
		Log.v("BLE", "associateDevice");
    	int decodedHash = MeshService.getDeviceHashFromShortcode(shortCode);
    	if (decodedHash == uuidHash) { 
    		Log.v("BLE", "associateDevice :"+uuidHash+"  "+MeshService.getAuthorizationCode(shortCode));
    		mService.associateDevice(uuidHash, MeshService.getAuthorizationCode(shortCode));
    		return true;
    	}
    	return false;
    }
    
    
	 
	 private static class MeshHandler extends Handler {
	        private final WeakReference<CsrmeshMainActivity> mActivity;

	        public MeshHandler(CsrmeshMainActivity activity) {
	            mActivity = new WeakReference<CsrmeshMainActivity>(activity);
	        }

	        public void handleMessage(Message msg) {
	            CsrmeshMainActivity parentActivity = mActivity.get();
	            switch (msg.what) {
	            case MeshService.MESSAGE_LE_CONNECTED: {            	
	                Log.v("BLE","MESSAGE_LE_CONNECTED");
	                parentActivity.onConnected();
	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                Log.v("BLE", "UUIDhash : "+uuidHash);
//	                目前已经连接上灯泡，接下来就是控制灯泡的明暗与颜色了
//	                byte red = (byte)(Color.red(Color.BLUE) & 0xFF);
//	                byte green = (byte)(Color.green(Color.BLUE) & 0xFF);
//	                byte blue = (byte)(Color.blue(Color.BLUE) & 0xFF);
//	                LightModelApi.setRgb(0x0000, red, green, blue,  (byte)0xFF, 1000, false);
//	                第一个参数  deviceId 待查，应该不是address
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
	            case MeshService.MESSAGE_DEVICE_DISCOVERED: {

	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                Log.v("BLE", "UUIDhash : "+uuidHash);

	                ParcelUuid uuid = msg.getData().getParcelable(MeshService.EXTRA_UUID);                
//	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                int rssi = msg.getData().getInt(MeshService.EXTRA_RSSI);    
	                int ttl = msg.getData().getInt(MeshService.EXTRA_TTL);
	                Log.v("BLE", "Associated :"+uuid);
	                parentActivity.associateDevice(uuidHash);
	                parentActivity.mService.setDeviceDiscoveryFilterEnabled(false);
//	                在这里实现 绑定功能！！！
	                
//	                associateDevice(uuidHash);
//	                确定 “0” 是正确的吗？ shortCode
	                Log.v("BLE", "MESSAGE_DEVICE_DISCOVERED  :  "+uuidHash+"  "+ ttl);
	                break;
	            }
	            case MeshService.MESSAGE_DEVICE_APPEARANCE: {
	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                Log.v("BLE", "UUIDhash : "+uuidHash);

	            	Log.v("BLE", "MESSAGE_DEVICE_APPEARANCE  :  ");
	                break;
	            }
	            case MeshService.MESSAGE_DEVICE_ASSOCIATED: {
	                // New device has been associated and is telling us its device id.
	                // Request supported models before adding to DeviceStore, and the UI.
	                int deviceId = msg.getData().getInt(MeshService.EXTRA_DEVICE_ID);
	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                ParcelUuid uuid = msg.getData().getParcelable(MeshService.EXTRA_UUID);                
//	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                int rssi = msg.getData().getInt(MeshService.EXTRA_RSSI);    
	                int ttl = msg.getData().getInt(MeshService.EXTRA_TTL);
	                Log.v("BLE", "New device associated with id " + String.format("0x%x", deviceId));

//	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                Log.v("BLE", "UUIDhash : "+uuidHash);

	               
	                break;
	            }
	            case MeshService.MESSAGE_CONFIG_DEVICE_INFO: {
	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                Log.v("BLE", "UUIDhash : "+uuidHash);

	                Log.v("BLE", "MESSAGE_CONFIG_DEVICE_INFO");
	                break;
	            }
	            case MeshService.MESSAGE_GROUP_NUM_GROUPIDS: {
	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                Log.v("BLE", "UUIDhash : "+uuidHash);

	                Log.v("BLE", "MESSAGE_GROUP_NUM_GROUPI");
	                break;
	            }
	            case MeshService.MESSAGE_GROUP_MODEL_GROUPID: {  
	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                Log.v("BLE", "UUIDhash : "+uuidHash);
          	
	                Log.v("BLE", "MESSAGE_GROUP_MODEL_GROUPID");
	                break;
	            }
	            case MeshService.MESSAGE_FIRMWARE_VERSION:
	                int uuidHash = msg.getData().getInt(MeshService.EXTRA_UUIDHASH_31);
	                Log.v("BLE", "UUIDhash : "+uuidHash);

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

	 
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
//		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

/*	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		int id = item.getItemId();
		if (id == R.id.action_settings) {
			return true;
		}
		return super.onOptionsItemSelected(item);
	}*/
	
/*	public void startScan(View v){
		if (mBtAdapter.isEnabled()) {
//            scanLeDevice(true);
			try{
				mBtAdapter.startLeScan(mLeScanCallback);
			}
//         mBtAdapter.startLeScan(mLeScanCallback);
			catch(Exception e){
				System.out.println("ERRORERRORERRORERRORERROR :  "+e);
				Toast.makeText(this, "ERROR+"+e, Toast.LENGTH_LONG);
			}
        }else{
        	Toast.makeText(this,"蓝牙打开有误！",Toast.LENGTH_LONG).show();
        }
	}*/
	public void startScan(){
		if (mBtAdapter.isEnabled()) {
//          scanLeDevice(true);
			try{
				mBtAdapter.startLeScan(mLeScanCallback);
			}
//       mBtAdapter.startLeScan(mLeScanCallback);
			catch(Exception e){
				System.out.println("ERRORERRORERRORERRORERROR :  "+e);
				Toast.makeText(this, "ERROR+"+e, Toast.LENGTH_LONG);
			}
      }else{
      	Toast.makeText(this,"蓝牙打开有误！",Toast.LENGTH_LONG).show();
      }
	}
	
/*	public void stopScan(View v){
		mBtAdapter.stopLeScan(mLeScanCallback);
		Log.v("BLE", "stop the LeScan!");
	}*/	
	public void stopScan(){
		mBtAdapter.stopLeScan(mLeScanCallback);
		Log.v("BLE", "stop the LeScan!");
	}
	
	
	/*private BluetoothAdapter.LeScanCallback mlenStopScanCallback = new BluetoothAdapter.LeScanCallback() {
		@Override 
		public void onLeScan(final BluetoothDevice device, final int rssi, final byte[] scanRecord){
			Log.v("BLE", "stop the LeScan!");
		}
	};
	*/
    private BluetoothAdapter.LeScanCallback mLeScanCallback = new BluetoothAdapter.LeScanCallback() {
        @Override
        public void onLeScan(final BluetoothDevice device, final int rssi, final byte[] scanRecord) {
//        	待查：返回值怎么查看
           /* runOnUiThread(new Runnable() {
                @Override
                public void run() {*/
                	Log.v("BLE", "run in the callback!");
                	if (device.getName() == null) {
                		// Sometimes devices are seen with a null name and empirically connection
                		// to such devices is less reliable, so ignore them.
                		return;
                	}
//2016年12月21日                	textview.setText("aaaaa");
                    // Check that this isn't a device we have already seen, and add it to the list.
                    blueScaninfo bbb = new blueScaninfo(device.getName(), device.getAddress());
//                	if(data.contains(bbb)){}
//                	else{
                		Log.v("BLE", device.getName()+"  : "+device.getAddress()+"uuid: "+device.getUuids());
                		data.add(bbb);
                		
//                	}
                		
                	/*textview.setText(device.getName()+":  "+device.getAddress());*/
              /*  }
            });*/
        }
    };
    
    
    
    public class blueScaninfo{
    	public String name;
        public String address;
//        public int rssi;
        public blueScaninfo(String name, String address/*, int rssi*/) {
            this.name = name;
            this.address = address;
//            this.rssi = rssi;
        }
        
    }
}


