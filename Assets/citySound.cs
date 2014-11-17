using UnityEngine;
using System.Collections;

public class citySound : MonoBehaviour {
	GameObject temp;
	// Use this for initialization
	void Start () {
		audio.Play ();
		temp = GameObject.Find ("SUIMONO_Surface");
	}
	
	// Update is called once per frame
	void Update () {
		if (temp.transform.position.y > 0) {
			if(audio.volume > 0){
				audio.volume -= 0.002f;
			}
		}
	}
}
