using UnityEngine;
using System.Collections;

public class sinkMyself : MonoBehaviour {
	public bool isSink;
	// Use this for initialization
	void Start () {
		isSink = true;
		//iTween.ShakePosition(gameObject, iTween.Hash("x", 2, "easeType", "easeInOutExpo", "loopType", "pingPong", "delay", .1));
		//iTween.ShakePosition(gameObject, Vector3(10,10,10), 10.0f);
	}
	
	// Update is called once per frame
	void Update () {

		if (isSink == true) {
				
						Vector3 pos = gameObject.transform.position;
						pos.y = pos.y - 1.0f;
						gameObject.transform.position = pos;
				}
	}
}
