using UnityEngine;
using System.Collections;

public class aboveWater : MonoBehaviour {
	GameObject temp;
	// Use this for initialization
	void Start () {
		audio.Play ();
		temp = GameObject.Find ("SUIMONO_Surface");
	}
	
	// Update is called once per frame
	void Update () {
//		if (Time.time > 50.0f) {
				if(audio.volume <= 0.2f){
					audio.volume += 0.0001f;
				}

			if (temp.transform.position.y > 3.0f) {
				if(audio.volume > 0){
					audio.volume -= 0.002f;
				}
			}

//		}
	}
}
