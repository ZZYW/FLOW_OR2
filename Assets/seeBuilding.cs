using UnityEngine;
using System.Collections;

public class seeBuilding : MonoBehaviour {

	GameObject temp;
//	GameObject tempWater;
//	bool isCast;

	void Start () {
//		tempWater = GameObject.Find("breathSensor");
//		isCast = true;
	}
	

	void Update () {
		///////////////raycast start///////////////////////////
		RaycastHit hit;
		
		if(Physics.SphereCast(transform.position, 1, transform.forward, out hit))
		{
			//Debug.DrawLine (transform.position, hit.point, Color.cyan, 5000.0f);
			if(hit.collider.gameObject.tag == "Building"){
				temp = hit.collider.gameObject;
				temp.GetComponent<sinkBuilding>().isHit = true;

			}
		}
		/////////////////raycast finish////////////////////////
	}
}
