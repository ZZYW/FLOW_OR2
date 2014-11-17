using UnityEngine;
using System.Collections;

public class sphereColor : MonoBehaviour {
	private float tempTrans;
	private float startTime;
	private GameObject temp;
	private bool isFade;
	public float tempDeepBreath = 0;


	void Start () {
		startTime = 0.0f;
		tempTrans = 0.0f;
		temp = GameObject.Find("breathSensor");
		isFade = false;


		}
	
	// Update is called once per frame
	void Update () {
		//if (temp.GetComponent<myReading>().deepBreathCounter > 5 && isFade == false) {

		tempDeepBreath = temp.GetComponent<myReading> ().deepBreathCounter;

		if ( tempDeepBreath > 10 && isFade == false) {
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

