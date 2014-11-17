using UnityEngine;
using System.Collections;

public class flightSimulator2 : MonoBehaviour {
	public float AmbientSpeed = 10.0f;
	public float RotationSpeed = 20.0f;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		Quaternion AddRot = Quaternion.identity;
		//float roll = 0;
		float pitch = 0;
		float yaw = 0;
		//roll = Input.GetAxis("Roll") * (Time.deltaTime * RotationSpeed);
		pitch = Input.GetAxis("Pitch") * (Time.deltaTime * RotationSpeed);
		yaw = Input.GetAxis("Yaw") * (Time.deltaTime * RotationSpeed);
		AddRot.eulerAngles = new Vector3(-pitch, yaw, 0);
		rigidbody.rotation *= AddRot;
		Vector3 AddPos = Vector3.forward;
		AddPos = gameObject.rigidbody.rotation * AddPos;
		rigidbody.velocity = AddPos * (Time.deltaTime * AmbientSpeed);
	}
}


