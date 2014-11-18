using UnityEngine;
using System.Collections;

public class centralController : MonoBehaviour {
	private GameObject breath;
	public float deepBreathCounter;

	// Use this for initialization
	void Start () {
		breath = GameObject.Find("breathSensor");
		deepBreathCounter = 0.0f;
	}
	
	// Update is called once per frame
	void Update () {

		deepBreathCounter = breath.GetComponent<myReading>().deepBreathCounter;

		if(Time.time > 70.0f){
			print ("------------< START RAISE WATER >----------- ");
			GameObject.Find("SUIMONO_Surface").GetComponent<raiseWater>().isRaise = true;
		}
	
	}
}
