using UnityEngine;
using System.Collections;

public class sinkBuilding : MonoBehaviour {
	public bool isHit;
	public bool buildingFade = false;
	public bool startFadeOut = false;
	private bool forloopStarted = false;

	public GameObject suimono;

	
	void Start () {
		isHit = false;

		forloopStarted = false;
	}

	void Update () {



		if(startFadeOut){
			if(!forloopStarted){
				gameObject.renderer.material.shader = Shader.Find("Transparent/Diffuse");
				StartCoroutine(Fade());
				forloopStarted = true;
			}
		}


		if (isHit == true) {
			Vector3 pos = gameObject.transform.position;
			pos.y = pos.y - 0.1f;
			gameObject.transform.position = pos;
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
