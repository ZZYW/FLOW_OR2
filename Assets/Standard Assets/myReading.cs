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
		public bool disableDeepBreathCounterIncrease;
		private List<float> breath; //each breath value
		public int deepBreathCounter; //count number of deep breath 
		
		public float aveBreath; //average breath benchmark
		private float tempIn;
		public bool inhale = false; //flag for deep breath
		float timeA;
		public bool cooldown = false;
		const int booldown_threshold = 4;

		void Start ()
		{
				disableDeepBreathCounterIncrease = false;
				arduino = Arduino.global;
				arduino.Setup (ConfigurePins);
				breath = new List<float> ();
				deepBreathCounter = 0;
				aveBreath = 0;
		}

		void ConfigurePins ()
		{
				arduino.pinMode (pin, PinMode.ANALOG);
				arduino.reportAnalog (pin, 1);
		}

		void LateUpdate ()
		{
				Debug.Log (pinValue);
				float timeB = Time.time;
				pinValue = arduino.analogRead (pin);



			if (pinValue > 100  && aveBreath == 0) {
				breath.Add (pinValue);
			}


			if (Time.time >= 29 && aveBreath == 0) {

					float sum = 0.0f;
					float totalBreath = 0;

					for (int j = 20; j < breath.Count - 20; j++) {
							totalBreath = totalBreath + breath [j];
							sum++;
					}

					aveBreath = totalBreath/sum;
			}


		//detect and count deep breath
				if (aveBreath > 0) {

						float deepBreathOffset = 0.5f;
						tempIn = aveBreath - deepBreathOffset;

						//testing for inhaling
						if (cooldown == false) {
						if (pinValue < aveBreath - deepBreathOffset) {

										if (!disableDeepBreathCounterIncrease) {
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

