using UnityEngine;
using System.Collections;

public class countBuilding : MonoBehaviour {
	public int totalBuilding;
	// Use this for initialization
	void Start () {
		totalBuilding = 0; 
	}
	
	// Update is called once per frame
	void Update () {
		int temp = 0;

		foreach (Transform child in transform){
				temp ++;
				print ("There are "+temp+" buildings left");
				}

		totalBuilding = temp;
		temp = 0;
		//print ("There are "+totalBuilding+" buildings left");
	}
}
