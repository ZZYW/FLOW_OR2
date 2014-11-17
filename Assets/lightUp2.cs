using UnityEngine;
using System.Collections;

public class lightUp2 : MonoBehaviour {

	GameObject temp;
	public int deepBreathCounter;
	public bool started = false;

	// Use this for initialization
	void Start () {
		temp = GameObject.Find ("breathSensor");
	}
	
	// Update is called once per frame

	void Update () {
		deepBreathCounter = temp.GetComponent<myReading> ().deepBreathCounter;

		if (deepBreathCounter > 10 && started == false) {
				StartCoroutine (Fade ());
				started = true;
			}

//		if ((Input.GetKey (KeyCode.C))) {
//			StartCoroutine (Fade ());
//		}
	}


	IEnumerator Fade() {
		for (float f = 0.0f; f < 8.0f; f += 0.0003f) {
			light.intensity = f;
			yield return new WaitForSeconds(0.01f);
		}
	}

}

