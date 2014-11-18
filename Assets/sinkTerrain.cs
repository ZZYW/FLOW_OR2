using UnityEngine;
using System.Collections;

public class sinkTerrain : MonoBehaviour {
	public bool sink;

	void Start () {
		sink = false;
	
	}
	
	void Update () {


		if (sink) {
			Destroy(gameObject);
		}
	
	}

}