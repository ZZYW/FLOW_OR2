using UnityEngine;
using System.Collections;

public class flyMe : MonoBehaviour {
	GameObject tempWater;

	// Use this for initialization
	void Start () {
	tempWater = GameObject.Find ("SUIMONO_Surface");
	}
	
	// Update is called once per frame
	void Update () {
		print ("tempWater level is :" + tempWater.transform.position.y);
		if (tempWater.transform.position.y > -5.0f) {
			print ("water is higher than -5.0f");
			GetComponent<CharacterController> ().enabled = false;
			GetComponent<OVRPlayerController> ().enabled = false;
			GetComponent<OVRGamepadController> ().enabled = false;
			GetComponent<flightSimulator>().enabled = true;
//			float beginTime = Time.time;
//			float rate = (Time.time - beginTime) / 15.0f;
//			Vector3 pos = gameObject.transform.position;
//			pos.y = Mathf.Lerp (20.0f, 30.0f, rate);
//			gameObject.transform.position = pos;
//			print ("controller rate is: " + rate + "   controller y position is: " + pos.y);
		} else {
			GetComponent<CharacterController> ().enabled = true;
			GetComponent<OVRPlayerController> ().enabled = true;
			GetComponent<OVRGamepadController> ().enabled = true;
			GetComponent<flightSimulator>().enabled = false;
		}
	}
}
