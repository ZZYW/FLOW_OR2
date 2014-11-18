using UnityEngine;
using System.Collections;

public class sinkTerrain : MonoBehaviour {
	public bool isHit;
	private GameObject temp;
	int tempBreath;
	
	void Start () {
		isHit = false;
		temp = GameObject.Find ("breathSensor");
		tempBreath = 0;
	}
	
	void Update () {
		if (temp.GetComponent<myReading>().deepBreathCounter > tempBreath) {
			isHit=true;		
			tempBreath = temp.GetComponent<myReading>().deepBreathCounter;
		}

		if(tempBreath > 10){
			Destroy(gameObject);
		}

	}

}