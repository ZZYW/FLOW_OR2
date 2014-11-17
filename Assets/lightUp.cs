using UnityEngine;
using System.Collections;

public class lightUp : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
				if ((Input.GetKey (KeyCode.X))) {
						StartCoroutine (Fade ());
				}

	
	}


	IEnumerator Fade() {
		for (float f = 0.5f; f < 8.0f; f += 0.005f) {
			light.intensity = f;
			yield return new WaitForSeconds(0.1f);
		}


	}

}
