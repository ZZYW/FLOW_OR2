using UnityEngine;
using System.Collections;

public class flightSimulator : MonoBehaviour {
	public float AmbientSpeed;
	public float RotationSpeed;
	public float pitch;
	public float yaw;

	// Use this for initialization
	void Start () {
		//Debug.Log ("plane pilot script added to: " + gameObject.name);
		AmbientSpeed = 5.0f;
		RotationSpeed = 10.0f;
		pitch = 0.0f;
		yaw = 0.0f;
	}
	
	// Update is called once per frame
	void Update () {
		//Vector3 moveCamTo = transform.position - transform.forward * 10.0f + Vector3.up * 10.0f;
		//Camera.main.transform.position = moveCamTo;
		//Camera.main.transform.LookAt (transform.position + transform.forward * 10.0f);

		Quaternion AddRot = Quaternion.identity; //store rotation value

		float terrainHeightWhereWeAre = Terrain.activeTerrain.SampleHeight(transform.position);

		pitch = Input.GetAxis("Pitch") * (Time.deltaTime * RotationSpeed);
		yaw = Input.GetAxis("Yaw") * (Time.deltaTime * RotationSpeed);

		transform.position += transform.forward * Time.deltaTime * AmbientSpeed;
		transform.Rotate (Input.GetAxis ("Pitch"), Input.GetAxis("Yaw"), 0);
		//AmbientSpeed -= transform.forward.y * Time.deltaTime * 2.0f;

		if (AmbientSpeed > 20.0f) {
			AmbientSpeed = 20.0f;		
		}

		AddRot.eulerAngles = new Vector3(pitch, yaw, 0);
		if (terrainHeightWhereWeAre > transform.position.y) {
		transform.position = new Vector3(transform.position.x,
			                             terrainHeightWhereWeAre,
			                             transform.position.z);
		}
		rigidbody.rotation *= AddRot;
		Vector3 AddPos = Vector3.forward;
		AddPos = gameObject.rigidbody.rotation * AddPos;
		rigidbody.velocity = AddPos * (Time.deltaTime * AmbientSpeed);
	}
}


