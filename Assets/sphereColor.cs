using UnityEngine;
using System.Collections;

public class sphereColor : MonoBehaviour {
	private float tempTrans;
	private float startTime;
	private bool isFade;
	public float tempDeepBreath = 0;
	public bool startFadeout;


	void Start () {
		startFadeout = false;
		startTime = 0.0f;
		tempTrans = 0.0f;
		isFade = false;
	}
	
	// Update is called once per frame
	void Update () {

		if ( startFadeout && isFade == false) {
			StartCoroutine(Fade());
			isFade = true;
		}

		if (gameObject.renderer.material.color.a == 0) {
			gameObject.active = false;
		}
	}
		

	IEnumerator Fade() {
		for (float f = 1.0f; f > 0.0f; f -= 0.005f) {
			Color c = renderer.material.color;
			c.a = f;
			//print ("fade value is: "+c.a);
			gameObject.renderer.material.color = c;
			yield return new WaitForSeconds(0.05f);
		}
	}
}

