using UnityEngine;
using System.Collections;

public class sinkBuilding : MonoBehaviour {
	public bool isHit;
	public bool domeFade = false;
	public bool buildingFade = false;
	private GameObject temp;
	private int tempBreath;
//	public AudioClip buildingSink;
	
	void Start () {
		isHit = false;
		temp = GameObject.Find ("breathSensor");
		tempBreath = 0;
	}

	void Update () {

////////After each deep breath, all visible buildings fall
//		if (temp.GetComponent<myReading>().deepBreathCounter > tempBreath) {
//			if (gameObject.renderer.isVisible == true) {
//				isHit=true;		
//			}
//			tempBreath = temp.GetComponent<myReading>().deepBreathCounter;
//		}

		tempBreath = temp.GetComponent<myReading> ().deepBreathCounter;

		if (tempBreath > 10 && buildingFade == false) {
			gameObject.renderer.material.shader = Shader.Find("Transparent/Diffuse");
			buildingFade = true;
		}
	
		//hmmmmmm, this is not dome fader right?...
		if (tempBreath > 10 && domeFade==false) {

			StartCoroutine(Fade());
			domeFade=true;
		}


		if (isHit == true) {
			Vector3 pos = gameObject.transform.position;
			pos.y = pos.y - 0.1f;
			gameObject.transform.position = pos;
//			audio.PlayOneShot(buildingSink);

//			if(pos.y <= -50.0f){
//				Destroy(gameObject);
//			}
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
