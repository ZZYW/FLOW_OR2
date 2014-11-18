using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Uniduino;

public class myReading : MonoBehaviour
{
		private Arduino arduino;
		private int pin = 0;
		public float pinValue;
		private float spinSpeed;
		public bool disableCounterPlus;
		private List<float> breath; //each breath value
		public int deepBreathCounter; //count number of deep breath 
		public int breathCounter;//count number of total breath
		public float totalBreath; //interim variable for caulcuating aveBreath
		public float aveBreath; //average breath benchmark
		private float tempIn;
		public bool inhale = false; //flag for deep breath


		public float timeA;
		public bool cooldown = false;
		const int booldown_threshold = 4;

		void Start ()
		{
				disableCounterPlus = false;
				arduino = Arduino.global;
				arduino.Setup (ConfigurePins);
				breath = new List<float> ();
				breathCounter = 0;
				deepBreathCounter = 0;
				totalBreath = 0;
				aveBreath = 0;
		}

		void ConfigurePins ()
		{
				arduino.pinMode (pin, PinMode.ANALOG);
				arduino.reportAnalog (pin, 1);
		}

		void Update ()
		{
				Debug.Log (pinValue);
				float timeB = Time.time;

				if (Time.frameCount % 5 == 0) {
						pinValue = arduino.analogRead (pin);

						if (breathCounter >= 80 && aveBreath == 0) {
								for (int j = 20; j < 80; j++) {
										totalBreath = totalBreath + breath [j];
										aveBreath = totalBreath / 60;
								}
								Debug.Log ("************************************ average breath is " + aveBreath);
						}
			
						if (pinValue > 100) {
								breath.Add (pinValue);
								Debug.Log ("breath " + breathCounter + ":" + breath [breathCounter]);
								breathCounter++;
						}

				//detect and count deep breath
						if (aveBreath > 0) {
								tempIn = aveBreath - 0.4f;
								//testing for inhaling
								if (cooldown == false) {
										if (pinValue < aveBreath - 0.4f) {

												if (!disableCounterPlus) {
														deepBreathCounter++;
												}
												cooldown = true;
												timeA = Time.time;
												Debug.Log ("*********************************** total deep breath " + deepBreathCounter);
												inhale = true;
												Debug.Log ("inhaling");
										}
								}

								//if deep breath starts, 
								if (pinValue < tempIn) {
										tempIn = pinValue;
								}
	
								if (pinValue > tempIn) {
										inhale = false;
										Debug.Log ("not inhaling");
								}
		
								if (cooldown == true) {
										if (timeB - timeA > booldown_threshold) {
												cooldown = false;
										}
								}
						}


				}
		

		}
	
}

