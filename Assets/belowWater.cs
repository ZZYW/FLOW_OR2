using UnityEngine;
using System.Collections;

public class belowWater : MonoBehaviour {
	GameObject temp;
	GameObject temp2;
	bool isFade = false;



	// Use this for initialization
	void Start () {
		audio.Play ();
		temp = GameObject.Find ("SUIMONO_Surface");
		temp2 = GameObject.Find ("breathSensor");
	}
	
	// Update is called once per frame
	void Update () {
		if (temp.transform.position.y >= 10.0f && audio.volume < 0.4f && temp2.GetComponent<myReading> ().deepBreathCounter <= 10) {
			audio.volume = audio.volume + 0.002f;
		}
		if (temp2.GetComponent<myReading> ().deepBreathCounter > 10 && audio.volume > 0) {
			isFade = true;
			audio.volume = audio.volume - 0.002f;
			Debug.Log(audio.volume);
		}


	}

}
