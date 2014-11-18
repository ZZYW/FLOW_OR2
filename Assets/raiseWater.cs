using UnityEngine;
using System.Collections;

public class raiseWater : MonoBehaviour
{
	GameObject temp;
	int tempBreath;
	public bool isRaise;
	public float raiseAcc;
	public float timer;

	void Start ()
	{
		isRaise = false;
		raiseAcc = 0.0f;
	}

	void LateUpdate ()
	{

		timer = Time.time;

		if (isRaise) {
			Vector3 pos = gameObject.transform.position;
			raiseAcc += 0.00005f;
			pos.y = pos.y + raiseAcc;
			gameObject.transform.position = pos;
		} 

	}


}
