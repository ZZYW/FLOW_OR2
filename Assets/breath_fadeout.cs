using UnityEngine;
using System.Collections;

public class breath_fadeout : MonoBehaviour {
	private GameObject temp;
	// Use this for initialization
	void Start () {
		temp = GameObject.Find ("breathSensor");
	
	}
	
	// Update is called once per frame
	void Update () {

		if (temp.GetComponent<myReading> ().inhale == true) {
				
		}
	
	}
}
