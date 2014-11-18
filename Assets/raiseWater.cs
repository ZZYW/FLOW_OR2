using UnityEngine;
using System.Collections;

public class raiseWater : MonoBehaviour
{
	GameObject temp;
	int tempBreath;
	public bool isRaise;
	public float raiseAcc;
	public float timer;
	public bool isDescent;

	void Start ()
	{
		isDescent = false;
		isRaise = false;
		raiseAcc = 0.0f;
	}

	void LateUpdate ()
	{

		timer = Time.time;

		if (isRaise && isDescent==false) {
			Vector3 pos = gameObject.transform.position;
			raiseAcc += 0.00005f;
			pos.y = pos.y + raiseAcc;
			gameObject.transform.position = pos;
		} 

		if(isDescent){
			Vector3 pos = gameObject.transform.position;
			pos.y = pos.y - 0.02f;
			gameObject.transform.position = pos;
		}

	}


}
