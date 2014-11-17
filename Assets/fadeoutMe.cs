using UnityEngine;
using System.Collections;

public class fadeoutMe : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if ((Input.GetKey(KeyCode.V))) {
//			gameObject.renderer.material.shader = Shader.Find("Transparent/Diffuse");
//			print("&&&&&&&&&&&&&&&&&& I'm using " + renderer.material.color + "material");
			StartCoroutine(Fade());
		}
	}

	IEnumerator Fade() {
		for (float f = 1.0f; f > 0.0f; f -= 0.005f) {


			yield return new WaitForSeconds(0.05f);
		}
	}
}
