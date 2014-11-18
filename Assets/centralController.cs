using UnityEngine;
using System.Collections;


public class centralController : MonoBehaviour {
	public GameObject breath;
	bool buildingFadeOutLoop;
	public float deepBreathCounter;
	public GameObject terrian;
	public GameObject suimono;
	public GameObject getUnderwaterHeight;
	public GameObject dome;
	public GameObject buildingFolder;
	public GameObject[] buildings;
	public GameObject[] mainCameras;
	public float sceneEndTime;
	public bool noteSceneEndTime;

	
	//float isUnderwater = 0.0f;
	Vector3 checkPosition;
	private bool gotTerrianSank;


	// Use this for initialization
	void Start () {
		noteSceneEndTime = false;
		sceneEndTime = 0;
		buildingFadeOutLoop = false;
		print ("how many buildings in this folder?: "+buildingFolder.transform.childCount);
		//buildings = GameObject[buildingFolder.transform.childCount];
		buildings = GameObject.FindGameObjectsWithTag("Building");
		mainCameras = GameObject.FindGameObjectsWithTag("MainCamera");
		deepBreathCounter = 0.0f;
	}


	// Update is called once per frame
	void LateUpdate () {

//		checkPosition = getUnderwaterHeight.GetComponent<getHeight>().checkPosition;
		deepBreathCounter = breath.GetComponent<myReading>().deepBreathCounter;

		if(Time.time >= 50.0f && Time.time <= 51.0f){
			print ("------------< START RAISE WATER >----------- ");
			GameObject.Find("SUIMONO_Surface").GetComponent<raiseWater>().isRaise = true;
		}



		if(deepBreathCounter > 10.0f && suimono.transform.position.y > 20){


			if(!noteSceneEndTime){
				sceneEndTime = Time.time;
				noteSceneEndTime = true;
			}



			dome.GetComponent<sphereColor>().startFadeout = true;
			suimono.GetComponent<raiseWater>().isDescent = true;

			if(!buildingFadeOutLoop){
				for(int i=0;i<buildings.Length;i++){
					buildings[i].GetComponent<sinkBuilding>().startFadeOut = true;
				}
			}

			if(!gotTerrianSank){ //make sure the code only executed once.
				terrian.GetComponent<sinkTerrain>().sink = true;
				gotTerrianSank = true;
			}
		}

	
		
		
		if(Time.time >= sceneEndTime + 16.0f && sceneEndTime != 0){

			for(int i=0;i<2;i++){

				if(mainCameras[i].GetComponent<BlurEffect>().iterations < 20){
					mainCameras[i].GetComponent<BlurEffect>().enabled = true;
					int tempBlurLeavel = mainCameras[i].GetComponent<BlurEffect>().iterations;
					tempBlurLeavel ++;
					mainCameras[i].GetComponent<BlurEffect>().iterations = tempBlurLeavel;
				
				}
				print ("END!!!!!!!!!!!!!!!!");
		
			}

			Application.Quit();
			
		}

	
	}





}
