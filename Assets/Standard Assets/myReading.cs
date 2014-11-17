using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Uniduino;

public class myReading : MonoBehaviour {
	public Arduino arduino;
	public int pin = 0;
	public float pinValue;
	public float spinSpeed;

//	public int pin2 = 1;
//	public int pinValue2;
	
	public List<float> breath; //each breath value
	public int deepBreathCounter; //count number of deep breath 
	public int breathCounter;//count number of total breath
	public float totalBreath; //interim variable for caulcuating aveBreath
	public float aveBreath; //average breath benchmark
	public float tempIn;
	public bool inhale = false; //flag for deep breath

//	public bool exhale = false;
//	public int totalGsr;
//	public int aveGsr;
//	public List<int> gsr;
//	public int gsrCounter;//count number of total breath
//	public int deepGsrCounter; //count number of shallow breath

	public float timeA;
	public bool cooldown = false;
	const int booldown_threshold = 4;


	void Start () {
		arduino = Arduino.global;
		//	arduino.Log = (s) => Debug.Log("Arduino: " +s);
		arduino.Setup(ConfigurePins);
		breath = new List<float> ();
		breathCounter = 0;
		deepBreathCounter = 0;
		totalBreath = 0;
		aveBreath = 0;

//		deepGsrCounter = 0;
//		totalGsr = 0;
//		gsrCounter = 0;
//		gsr = new List<int> ();
//		aveGsr = 0;
	}


	void ConfigurePins( )
	{
		arduino.pinMode(pin, PinMode.ANALOG);
		arduino.reportAnalog(pin, 1);
//		arduino.reportAnalog (pin2, 1);
	}

	void Update () {
		Debug.Log (pinValue);
		float timeB = Time.time;

		//timeB = Time.time;
		//read in pinvalue & save in array
		if(Time.frameCount % 5 == 0){
			pinValue = arduino.analogRead(pin);
//			pinValue2 = arduino.analogRead(pin2);

			//			calculating average
		if (breathCounter >= 80 && aveBreath == 0) {
			for (int j = 20; j < 80; j++) {
				totalBreath = totalBreath + breath [j];
				aveBreath = totalBreath / 60;
			}
			Debug.Log ("************************************ average breath is "+aveBreath);
		}
			
			if(pinValue > 100){
				breath.Add (pinValue);
				Debug.Log("breath "+breathCounter+":"+ breath[breathCounter]);
				breathCounter++;
			}

//			detect and count deep breath
		if (aveBreath > 0) {

			tempIn = aveBreath - 0.4f;
			//testing for inhaling
			if(cooldown==false){
				if(pinValue < aveBreath - 0.4f){
					deepBreathCounter++;
					cooldown = true;
					timeA = Time.time;
					Debug.Log ("*********************************** total deep breath "+deepBreathCounter);
					inhale = true;
					Debug.Log("inhaling");
				}
			}

			//if deep breath starts, 
			if(pinValue < tempIn){
				tempIn = pinValue;
			}
	
			if(pinValue > tempIn){
				inhale = false;
				Debug.Log("not inhaling");
			}
		
			if(cooldown == true){
				if(timeB - timeA > booldown_threshold){
					cooldown = false;
				}
			}



		}



//			if(pinValue2 > 0){
//				gsr.Add (pinValue2);
//				Debug.Log("GSR "+gsrCounter+":"+ gsr[gsrCounter]);
//				gsrCounter++;
//			}
//			
//
//			detect and count deep gsr
//			if (aveGsr > 0) {
//				if(pinValue2 > aveGsr + 6){
//					deepGsrCounter++;
//					Debug.Log ("*************************total deep Gsr "+deepGsrCounter);
//				}
//				
//			}
//
//
//			if (gsrCounter >= 30 && aveGsr == 0) {
//				for (int j = 5; j < 20; j++) {
//					totalGsr = totalGsr + gsr [j];
//					aveGsr = totalGsr / 15;
//				}
//				Debug.Log ("*********************average gsr is "+aveGsr);
//			}
		}
		

		
		//		float map(float value, float istart, float istop, float ostart, float ostop){
		//			return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
		//		}
		
		//	function intToFloat(num, decPlaces) { return num.toFixed(decPlaces); }
	}
	
}

