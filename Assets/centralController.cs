using UnityEngine;
using System.Collections;

public class centralController : MonoBehaviour {
	public GameObject breath;
	public float deepBreathCounter;
	public GameObject terrian;
	public GameObject suimono;

	// Use this for initialization
	void Start () {
		deepBreathCounter = 0.0f;
	}
	
	// Update is called once per frame
	void LateUpdate () {

		deepBreathCounter = breath.GetComponent<myReading>().deepBreathCounter;

		if(Time.time >= 70.0f && Time.time <= 71.0f){
			print ("------------< START RAISE WATER >----------- ");
			GameObject.Find("SUIMONO_Surface").GetComponent<raiseWater>().isRaise = true;
		}

		if(deepBreathCounter > 10.0f){

			suimono.GetComponent<raiseWater>().isDescent = true;

			if(suimono.transform.position.y <= -5){
				suimono.GetComponent<raiseWater>().isDescent = false;
			}

		}
	
	}
}
