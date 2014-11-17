using UnityEngine;
using System.Collections;

public class masterAudio : MonoBehaviour {
	private GameObject temp;
	private GameObject suimono;
	private float vol;
	bool zeroSound;
//	int count_one;
//	int count_two;

	// Use this for initialization
	void Start () {
		temp = GameObject.Find ("breathSensor");
		suimono = GameObject.Find ("SUIMONO_Surface");
		//suimono.GetComponent<SuimonoObject.js>().
		vol = 1.0f;
		zeroSound = false;
	
	}
	
	// Update is called once per frame
	void Update () {
		//count_two = Time.frameCount;
	//	Debug.Log ("!!!!!!!!!"+zeroSound);
		if (temp.GetComponent<myReading> ().inhale == true) {
			AudioListener.volume = AudioListener.volume - 0.08f;
			//ter.renderer.material.SetColor("_Color", Color.white);

//			count_one = Time.frameCount;

//			if(count_two - count_one > 200){
//				zeroSound = true;
//			}
//			if(AudioListener.volume < 0.2){
//				zeroSound = true;
//			};
				}
//		if (zeroSound == true) {
//     		AudioListener.volume = AudioListener.volume + 0.01f;
//			if(AudioListener.volume == 1){
//				zeroSound = false;
//				}	
//			}
		if (temp.GetComponent<myReading> ().inhale == false) {
			AudioListener.volume = 1.0f;
			//ter.renderer.material.SetColor("_Color", Color.black);

				}

		}
}
