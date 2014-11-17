using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Uniduino;

public class myReadingBackup : MonoBehaviour {
	public Arduino arduino;

	public int pin = 0;
	public int pin2 = 1;
	public int pinValue;
	public int pinValue2;
	public float spinSpeed;
	
	public List<int> breath; //each breath value
	public List<int> heart;
	public int deepBreathCounter; //count number of deep breath 
	public int shallowBreathCounter; //count number of shallow breath
	public int breathCounter;//count number of total breath
	public int heartCounter;//count number of total breath
	public int totalBreath; //interim variable for caulcuating aveBreath
	public int aveBreath; //average breath benchmark
	public bool inhale = false; //flag for deep breath
	public bool exhale = false;

	void Start () {
		arduino = Arduino.global;
		//	arduino.Log = (s) => Debug.Log("Arduino: " +s);
		arduino.Setup(ConfigurePins);
		breath = new List<int> ();
		heart = new List<int> ();
		breathCounter = 0;
		heartCounter = 0;
		deepBreathCounter = 0;
		shallowBreathCounter = 0;
		totalBreath = 0;
		aveBreath = 0;
	}

	void ConfigurePins( )
	{
		arduino.pinMode(pin, PinMode.ANALOG);
		arduino.reportAnalog(pin, 1);
		arduino.reportAnalog (pin2, 1);
	}

	void Update () {
		//read in pinvalue & save in array
		if(Time.frameCount % 20 == 0){
			pinValue = arduino.analogRead(pin);
			pinValue2 = arduino.analogRead(pin2);
			
//			if(pinValue > 200){
//				breath.Add (pinValue);
//				Debug.Log("breath "+breathCounter+":"+ breath[breathCounter]);
//				breathCounter++;
//			}

			if(pinValue2 > 0){
				heart.Add (pinValue2);
				Debug.Log("heartrate "+heartCounter+":"+ heart[heartCounter]);
				heartCounter++;
			}
			
			//detech and count deep breath
			if (aveBreath > 0) {
				if(pinValue < aveBreath - 2){
					deepBreathCounter++;
					Debug.Log ("*************************total deep breath "+deepBreathCounter);
				}

				if(pinValue > aveBreath + 2){
					shallowBreathCounter++;
					Debug.Log ("*************************total shallow breath "+shallowBreathCounter);
				}
			}
			
			//calculating average
			if (breathCounter >= 20 && aveBreath == 0) {
				for (int j = 5; j < 20; j++) {
					totalBreath = totalBreath + breath [j];
					aveBreath = totalBreath / 15;
				}
				Debug.Log ("*********************average breath is "+aveBreath);
			}
		}
		

		
		//		float map(float value, float istart, float istop, float ostart, float ostop){
		//			return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
		//		}
		
		//	function intToFloat(num, decPlaces) { return num.toFixed(decPlaces); }
	}
	
}

