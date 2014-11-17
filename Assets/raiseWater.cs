using UnityEngine;
using System.Collections;

public class raiseWater : MonoBehaviour {
	GameObject temp;
	int tempBreath;
//	public AudioClip oceanFlow;
//	public AudioClip underWater;
//	private float vol;
	bool isRaise;
//	bool waterFall;
	
	void Start () {
		temp = GameObject.Find ("breathSensor");
		tempBreath = 0;
//		vol = 0.0f;
		isRaise = false;
//		waterFall = false;
	}

	
	// Update is called once per frame
	void Update () {
		tempBreath = temp.GetComponent<myReading>().deepBreathCounter;
		//print ("deepBreath reading from water is " + temp.GetComponent<myReading> ().deepBreathCounter);

		Vector3 pos = gameObject.transform.position;

		float startingPos = pos.y;

		//this section controls audio volume and effect
//		if (vol <= 0.3f) {
//			vol = vol + 0.002f;
//		}
//
//		if (pos.y < 2.0f) {
//						audio.PlayOneShot (oceanFlow, vol);
//				}
//
//		if (pos.y >= 2.0f) {
//						audio.PlayOneShot (underWater, vol);
//				}

		//this section controls speed of flooding
		if (Time.time > 10.0f) {
			isRaise = true;	
			//print ("&&&&&&&&&&&&&&&&&&&&&&&& water about to rise");
		}


		if (isRaise == true) {

			pos.y = pos.y + 0.01f;
			gameObject.transform.position = pos;

			if(pos.y > 0.0f){
			pos.y = pos.y + 1.0f;
			}

		}
			

//		if ((Input.GetKey (KeyCode.V))) {
//			waterFall = true;
//			Debug.Log("water falling---------" + waterFall);
//			isRaise = false;
//		}

//		if (waterFall == true) {
//
//			pos.y = pos.y - 0.1f;
//			gameObject.transform.position = pos;
//
//			if(pos.y < -30.0f){
//				Destroy(gameObject);
//			}
//			
//			if (vol >= 0) {
//				vol = vol - 0.02f;
//			}
//		}

	}
	

}
