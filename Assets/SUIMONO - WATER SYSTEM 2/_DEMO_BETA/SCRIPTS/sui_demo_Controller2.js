#pragma strict


//PUBLIC VARIABLES
enum Sui_Demo_ControllerType{
		character, vehicle
		}
var controllerType : Sui_Demo_ControllerType =  Sui_Demo_ControllerType.character;

var isControllable : boolean = true;
var isTargeting : boolean = false;
var isUsingSight : boolean = false;
var isFiring : boolean = false;
var isExtraZoom : boolean = false;
var cameraTarget : Transform;
var characterTarget : Transform;
var vehicleTarget : Transform;
var followDistance : float = 5.0;
var followHeight : float = 1.0;
var followLat : float = 0.0;
var followSensitivity : float = 2.0;
var reverseYAxis : boolean = true;
var reverseXAxis : boolean = false;
var yRotationLimits : Vector2 = Vector2(71.04725,108.0562);
var axisSensitivity : Vector2 = Vector2(4.0,4.0);
var camFOV : float = 35.0;
var camRotation = 0.0;
var camHeight = 0.0;
var camYDamp : float;
var targetDistance : float = 0.0;
var targetingSkew :float = 7.0;
var targetingSpeed : float = 5.0;
var followTgt : boolean = true;

var isInWater : boolean = false;
var isInWaterDeep : boolean = false;
var isUnderWater : boolean = false;
var isFloating : boolean = false;
var isFalling : boolean = false;

var keepUnderwater : boolean = true;

var cameraLean : float = 1.0;
var targetLean : float = 1.0;


//PUBLIC VARIABLES
public var tgtZeroing : float = 100.0;
public var projectileVelocity : float = 0.0;
public var targetPosition : Vector3;
//public var currentGunObject : Object_Gun;
public var MouseRotationDistance : float = 0.0;
public var MouseVerticalDistance : float = 0.0;


//PRIVATE VARIABLES
private var suimonoGameObject : GameObject;
private var suimonoModuleObject : SuimonoModule;

private var followTgtDistance : float = 0.0;

private var cameraReset : boolean = false;
var orbitView : boolean = false;
private var targetRotation : Quaternion;
private var MouseScrollDistance : float = 0.0;
private var playerObject : Transform;
//private var sfxShake : sui_demo_cameraShake;
private var projEmitTimer : float = 0.0;
private var camVRotation : float = 0.0;
private var firingTime : float = 0.0;
private var sightingTime : float = 0.0;
private var setFOV : float = 1.0;

private var rotDiff : float = 0.0;
private var rotDiffV : float = 0.0;
private var targetUseLean : float = 0.0;
private var useSpeed : float = 0.0;
private var useSideSpeed : float = 0.0;
private var moveSpeed : float = 0.05;
private var moveForward : float = 0.0;
private var moveSideways : float = 0.0;
private var moveVertical : float =0.0;
private var isRunning : boolean = false;
private var isMouseMove : boolean = false;

private var lastYPos : float = 0.0;
private var propSpd : float = 0.0;
private var engPos : float = 0.5;

private var vehiclePosition : Transform;
private var vehicleExitPosition : Transform;
private var characterCollider : Collider;
public var vehicleReset : boolean = true;

//editor variables
private var forwardAmt : float = 0.0;
private var sidewaysAmt : float = 0.0;
private var editorSensitivity : float = 1.0;
private var button3time : float = 0.0;
//private var targetAnimator : sui_demo_characterAnim;
private var vehicle_engine_object : sui_demo_boathandler;

private var savePos : Vector3;



function Awake() {

	//get Suimono Specific Objects
	suimonoGameObject = GameObject.Find("SUIMONO_Module");
	if (suimonoGameObject != null) suimonoModuleObject = suimonoGameObject.GetComponent(SuimonoModule);
	
	targetPosition = cameraTarget.position;
	targetRotation = cameraTarget.rotation;
	
	if (cameraTarget != null){
		//targetAnimator = cameraTarget.gameObject.GetComponent(sui_demo_characterAnim);
	}

	characterCollider = characterTarget.GetComponent(Collider);
	
	if (vehicleTarget != null){
		vehiclePosition = vehicleTarget.gameObject.Find("PlayerPositionMarker").transform;
		vehicleExitPosition = vehicleTarget.gameObject.Find("PlayerExitMarker").transform;
		vehicle_engine_object = vehicleTarget.gameObject.GetComponent(sui_demo_boathandler) as sui_demo_boathandler;
	}

}




function Start () {

}





function Update () {
	
	controllerType = Sui_Demo_ControllerType.vehicle;
	/*
	//---------------------------------
	//  SWITCH CONTROLLER TYPES
	//---------------------------------
	if (controllerType ==  Sui_Demo_ControllerType.character){
		cameraTarget = characterTarget;
	} else if (controllerType ==  Sui_Demo_ControllerType.vehicle){
		cameraTarget = vehicleTarget;
	}


	//---------------------------------
	//  PLACE PLAYER IN VEHICLE
	//---------------------------------
	if (controllerType ==  Sui_Demo_ControllerType.vehicle){
		//set character to child of vehicle
		characterTarget.parent = vehicleTarget;
		characterTarget.rigidbody.isKinematic = true;
		characterTarget.localPosition = vehiclePosition.localPosition;
		characterTarget.localRotation = vehiclePosition.localRotation;
		characterCollider.enabled = false;
		if (!vehicleReset){
			followDistance = 7.0;
		}
		vehicleReset = false;

	} else {
		//reset character to main object
		if (!vehicleReset){
			characterTarget.localPosition = vehicleExitPosition.localPosition;
			characterTarget.localRotation = vehicleExitPosition.localRotation;
			characterTarget.parent = null;
			characterTarget.rigidbody.isKinematic = false;
			characterCollider.enabled = true;
			followDistance = 3.0;
			vehicleReset = true;
		}
	}
	*/
	
	
	
	//---------------------------------
	//  GET KEYBOARD AND MOUSE INPUTS
	//---------------------------------
	
	if (isControllable){
	
		//CHECK FOR MOUSE INPUT
		//setup initial variables
		targetPosition = cameraTarget.position;
		var oldMouseRotation = MouseRotationDistance;
		var oldMouseVRotation = MouseVerticalDistance;
		
		//MOUSE BUTTON 1
		// allow camera movement
		isMouseMove = false;
		if (Input.GetKey("mouse 0")) isMouseMove = true;
		
		
		//MOUSE BUTTON 2 / SHIFT
		// switches between normal walk mode and running mode
		isTargeting = false;
		isRunning = false;
		//if (Input.GetKey("mouse 1")) isRunning = true;
		if (Input.GetKey("left shift")) isRunning = true;
	
		//MOUSE BUTTON 3 / SPACE
		//Enable / Disable orbit view
		orbitView = false;
		if (Input.GetKey("space")) orbitView = true;
		//if (Input.GetKey("left alt")) orbitView = true;
		//if (Input.GetKey("right alt")) orbitView = true;


		//"WASD" MOVEMENT KEYS
		//moves character around scene
		moveForward = 0.0;
		moveSideways = 0.0;
		if (Input.GetKey("w")) moveForward = 1.0;
		if (Input.GetKey("s")) moveForward = -1.0;
		if (Input.GetKey("a")) moveSideways = -1.0;
		if (Input.GetKey("d")) moveSideways = 1.0;
		
		if (moveForward == -1.0) isRunning = false;
		
		
		//"QZ" MOVEMENT KEYS
		//ascends or descends while underwater
		moveVertical = 0.0;
		if (Input.GetKey("q")) moveVertical = 1.0;
		if (Input.GetKey("z")) moveVertical = -1.0;


		// "LEFT SHIFT" KEY
		// focus the view in all viewing modes... essentially a secondary
		// zoom key.  changes the zoom percentage based on "setFOV" variable
		isExtraZoom = false;
		if (Input.GetKey("mouse 1")) isExtraZoom = true;
		if (isExtraZoom){
			setFOV = 0.5;
		} else {
			setFOV = 1.0;
		}
		
		
		//GET MOUSE MOVEMENT
		//record X and Y mouse axis and scroll wheel amount for later use
		MouseRotationDistance = Input.GetAxisRaw("Mouse X");
		MouseVerticalDistance = Input.GetAxisRaw("Mouse Y");
		MouseScrollDistance = Input.GetAxisRaw("Mouse ScrollWheel");
		if (reverseYAxis) MouseVerticalDistance = -Input.GetAxisRaw("Mouse Y");
		if (reverseXAxis) MouseRotationDistance = -Input.GetAxisRaw("Mouse X");


	}


	
	//---------------------------------
	//  HANDLE CAMERA VIEWS
	//---------------------------------
	if (!isControllable){
	
		//Zoom Settings used for the intro screen
		camFOV = 63.2;//Mathf.Lerp(camFOV,75.2,Time.deltaTime*4.0);
		followLat = Mathf.Lerp(followLat,-0.85,Time.deltaTime*4.0);
		followHeight = Mathf.Lerp(followHeight,1.8,Time.deltaTime*4.0);
		followDistance = Mathf.Lerp(followDistance,5.0,Time.deltaTime*4.0);
		axisSensitivity.x = Mathf.Lerp(axisSensitivity.x,4.0,Time.deltaTime*4.0);
		axisSensitivity.y = Mathf.Lerp(axisSensitivity.y,10.0,Time.deltaTime*4.0);
		camera.fieldOfView = camFOV;
	}
	
	
	//Turn the cursor on
	Screen.lockCursor = false;
		

	//IDLE SETTINGS lerp camera back
	camFOV = Mathf.Lerp(camFOV,35.0*setFOV,Time.deltaTime*4.0);
	followLat = Mathf.Lerp(followLat,-0.4,Time.deltaTime*4.0);
	followHeight = Mathf.Lerp(followHeight,1.4,Time.deltaTime*2.0);
	axisSensitivity.x = Mathf.Lerp(axisSensitivity.x,4.0,Time.deltaTime*4.0);
	axisSensitivity.y = Mathf.Lerp(axisSensitivity.y,10.0,Time.deltaTime*4.0);



	
	
	
	//---------------------------------
	//  SUIMONO SPECIFIC HANDLING
	//---------------------------------
	// we use this to get the current Suimono plane water level (if applicable) from the
	// main Suimono Module object, then translate this into different walk / run speeds
	// based on water depth.
	//var waterLevel : float = suimonoModuleObject.GetWaterDepth(cameraTarget);
	if (suimonoModuleObject != null){
		var waterLevel : float = suimonoModuleObject.SuimonoGetHeight(cameraTarget.position,"object depth");
		var propLevel : float = suimonoModuleObject.SuimonoGetHeight(vehicle_engine_object.propObject.transform.position,"object depth");
		var waterHeight : float = suimonoModuleObject.SuimonoGetHeight(transform.position,"surfaceLevel");
		
		isInWater = false;
		
		if (waterLevel < 0.0) waterLevel = 0.0;
		if (waterLevel > 0.0){
	
			isInWater = true;
			isInWaterDeep = false;
			isUnderWater = false;
			isFloating = false;
			
			if (waterLevel >= 1.2 && waterLevel < 1.8) isInWaterDeep = true;
			if (waterLevel >= 1.8) isUnderWater = true;

			if (isInWaterDeep && waterLevel > 2.0) isFloating = true;
			
			
			//if (isInWaterDeep) moveSpeed *= 0.5;
			//if (isUnderWater) moveSpeed *= 0.4;
			//if (isUnderWater) moveSideways = 0.0;
			
		}
	}
	
	
	
	
	
	//set camera "bob" movement based on boat position
	if (controllerType == Sui_Demo_ControllerType.vehicle){
		var yDiff = savePos.y - cameraTarget.transform.position.y;
		
		MouseVerticalDistance += yDiff*6.0;
		
		
		
		savePos = cameraTarget.transform.position;
		
	}
	
	

	//---------------------------------
	// SET MOVEMENT SPEEDS
	//---------------------------------
	var spdLerp : float = 5.0;

	if (isUnderWater){
		if (moveForward == -1.0) moveForward = 0.0;
		//if (moveForward != 1.0) moveSideways = 0.0;
	}
	
	if (controllerType == Sui_Demo_ControllerType.character){
		moveSpeed = 0.03;
		if (moveForward != 0.0 && moveSideways != 0.0) moveSpeed = 0.02;
		if (isRunning && !isUnderWater && !isInWaterDeep) moveSpeed = 0.1;
		useSpeed = Mathf.Lerp(useSpeed, (moveSpeed * moveForward), Time.deltaTime*spdLerp);
		useSideSpeed = Mathf.Lerp(useSideSpeed, (moveSpeed * moveSideways), Time.deltaTime*spdLerp);
	}
	
	else if (controllerType ==  Sui_Demo_ControllerType.vehicle){
		spdLerp = 0.5;
		
		//calculate propeller
		var moveMult : float = 1.0;
		if (moveForward == 1.0){
			moveMult = 1.0;
		} else if (moveForward == -1.0){
			moveMult = -1.0;
		} else {
			moveMult = 1.0;
			propSpd = Mathf.Lerp(propSpd,100.0,Time.deltaTime*1.0);
		}


		//calculate lerps
		if (moveForward != 0.0){
			if (isRunning){
				spdLerp = 0.25;
				propSpd = Mathf.Lerp(propSpd,3000.0*moveMult,Time.deltaTime*1.0);
				moveSpeed = Mathf.Lerp(moveSpeed,0.35,Time.deltaTime*0.15);
			} else {
				if (moveForward == 1.0){
					propSpd = Mathf.Lerp(propSpd,1000.0*moveMult,Time.deltaTime*1.0);
					moveSpeed = Mathf.Lerp(moveSpeed,0.15,Time.deltaTime*4.0);
				} else if (moveForward == -1.0){
					propSpd = Mathf.Lerp(propSpd,600.0*moveMult,Time.deltaTime*1.0);
					moveSpeed = Mathf.Lerp(moveSpeed,0.06,Time.deltaTime*4.0);
				}
				

			}
			if (propLevel <= 0.0){
				moveSpeed = 0.0;
			}
		}
		
		//set speed
		useSpeed = Mathf.Lerp(useSpeed, (moveSpeed * moveForward), Time.deltaTime*spdLerp);
		useSideSpeed = 0.0;
		

	}
	//send data to boat engine
	if (vehicleTarget != null){
		if (controllerType == Sui_Demo_ControllerType.character) propSpd = Mathf.Lerp(propSpd,0.0,Time.deltaTime*1.0);
		vehicle_engine_object.propellerSpeed = propSpd;
		
		var setIsRevving : boolean = false;
		var setIsRevvingHigh : boolean = false;
		var setIsInWater : boolean = false;
		var setIsOn : boolean = false;
		
		if (controllerType == Sui_Demo_ControllerType.vehicle){
			setIsOn = true;
		}
			
		if (controllerType == Sui_Demo_ControllerType.vehicle && moveForward == 1.0){
			setIsRevving = true;
			if (isRunning) setIsRevvingHigh = true;
			if (propLevel > 0.0) setIsInWater = true;
		}
		vehicle_engine_object.behaviorIsRevving = setIsRevving;
		vehicle_engine_object.behaviorIsRevvingHigh = setIsRevvingHigh;
		vehicle_engine_object.behaviorIsInWater = setIsInWater;
		vehicle_engine_object.behaviorIsOn = setIsOn;
		
		
		
	}
		
	
	

	//---------------------------------
	//  CAMERA AND PLAYER POSITIONING
	//---------------------------------
	
	//check for falling
	isFalling = false;
	if ((lastYPos - cameraTarget.position.y) > 0.05 && !isUnderWater) isFalling = true;
	lastYPos = cameraTarget.position.y;
	
	if (isControllable){

		//ROTATE CHARACTER
		//if (orbitView) cameraReset = true;
			
		if (!orbitView){
			
			if (!cameraReset){
				
				var rotSpeed : float = 20.0;
				if (isUnderWater) rotSpeed = 2.0;
				if (controllerType == Sui_Demo_ControllerType.vehicle) rotSpeed = 1.0 + useSpeed;
				rotDiff = Mathf.Lerp(rotDiff,MouseRotationDistance,Time.deltaTime*rotSpeed);
				
				//character rotation
				if (controllerType ==  Sui_Demo_ControllerType.character){
					cameraTarget.Rotate(Vector3(0,1,0),rotDiff);
				}
				
				//character underwater rotation
				if (controllerType ==  Sui_Demo_ControllerType.character && isUnderWater && moveForward > 0.0){
					cameraTarget.transform.eulerAngles.x += (MouseVerticalDistance);//(cameraTarget.right, moveVertical*rotSpeed*0.4);
				}
				
				//vehicle rotation
				//if (controllerType == Sui_Demo_ControllerType.vehicle && moveForward != 0.0){
				//	cameraTarget.Rotate(Vector3(0,1,0),rotDiff);
				//	if (MouseRotationDistance < 0.0){
				//		engPos = Mathf.Lerp(engPos,1.0,Time.deltaTime*3.0);
				//	} else if (MouseRotationDistance > 0.0){
				//		engPos = Mathf.Lerp(engPos,0.0,Time.deltaTime*3.0);
				//	}
				//}
				if (controllerType == Sui_Demo_ControllerType.vehicle){
				
					if (moveSideways < 0.0){
						engPos = Mathf.Lerp(engPos,1.0,Time.deltaTime*3.0);
					} else if (moveSideways > 0.0){
						engPos = Mathf.Lerp(engPos,0.0,Time.deltaTime*3.0);
					}
					
					if (moveForward != 0.0){
						var setRot : float = (0.1 * moveSideways)+(moveSideways * (moveSpeed*2.0));
						if (!isInWater) setRot = setRot*0.3;
						//yaw
						cameraTarget.Rotate(Vector3(0,1,0),setRot); 
						//pitch
						//if (cameraTarget.transform.eulerAngles.x > 354.0) cameraTarget.Rotate(Vector3(-1,0,0),moveSpeed*4.0);
						//roll
						//if (cameraTarget.transform.eulerAngles.z > 354.0 || cameraTarget.transform.eulerAngles.z < 6.0){
						//	cameraTarget.Rotate(Vector3(0,0,-1),setRot*4.0);
						//}

					}
				}
				//vehicle rotate engine
				if (controllerType == Sui_Demo_ControllerType.vehicle){

					if (MouseRotationDistance == 0.0){
						engPos = Mathf.Lerp(engPos,0.5,Time.deltaTime*3.0);
					}

					vehicle_engine_object.engineRotation = engPos;
					
					//slowly angle boat while catching air
					if (!isInWater && isRunning && moveForward == 1.0){
						var vAngle : float = vehicle_engine_object.transform.localEulerAngles.x;
						if (vAngle > 340.0 || vAngle < 10.0){
							vehicle_engine_object.transform.Rotate(Vector3(-1,0,0),Time.deltaTime*10.0);
						}
					}
					
				}
			}
		}
		
		

		//MOVE CHARACTER
		if (cameraTarget.rigidbody){
			//calculate forward / backward movement
			var setNewPos : Vector3;
			setNewPos = ((cameraTarget.transform.forward * (useSpeed)));
			
			//calculate vertical while underwater
			var setNewVertPos : Vector3;
			//if (isUnderWater) setNewVertPos = ((cameraTarget.transform.up * (useSpeed * moveVertical)));
			
			//calculate sideways movement
			var setNewSidePos : Vector3;
			setNewPos += ((cameraTarget.transform.right * (useSideSpeed)));
			
			//move sideways only when not moving forward
			if (moveSideways != 0.0 && moveForward != 0.0){
				setNewSidePos = Vector3(0,0,0);
			}
			
			//set final movement
			cameraTarget.rigidbody.MovePosition(cameraTarget.rigidbody.position + (setNewPos + setNewSidePos + setNewVertPos));


		}
		
		
		
		
		//set camera to follow target object
		var followPos : Vector3 = targetPosition;
		followPos.y = targetPosition.y + followHeight;
		
		
		
			
		// set camera rotation
		camRotation = Mathf.Lerp(oldMouseRotation,MouseRotationDistance,Time.deltaTime*axisSensitivity.x);

		
		if (!orbitView && cameraReset){
			var rotDiff : float = Mathf.Abs(transform.rotation.eulerAngles.y - cameraTarget.rotation.eulerAngles.y);
			camRotation = rotDiff * 0.2;
			transform.rotation = Quaternion.Lerp(transform.rotation,cameraTarget.rotation,Time.deltaTime * 0.1);
			if (rotDiff < 0.1) cameraReset = false;
		}
		
		if (!isUnderWater){
			camHeight = Mathf.Lerp(camHeight,camHeight+MouseVerticalDistance,Time.deltaTime*axisSensitivity.y);
		} else {
			camHeight = Mathf.Lerp(camHeight,camHeight+MouseVerticalDistance,Time.deltaTime*axisSensitivity.y*0.5);
		}
		
		//clamp character rotations
		if (controllerType ==  Sui_Demo_ControllerType.character){
			if (!isUnderWater){
				cameraTarget.eulerAngles.x = 0.0;
				cameraTarget.eulerAngles.z = 0.0;
			} else {
				cameraTarget.eulerAngles.z = 0.0;
			}
		}
		
		camHeight = Mathf.Clamp(camHeight,0.1,12.0);


		// Set Follow Distance
		var followLerpSpeed : float = 2.0;
		if (controllerType ==  Sui_Demo_ControllerType.vehicle){
			followDistance -= (MouseScrollDistance*10.0);
			followDistance = Mathf.Clamp(followDistance,2.25,20.0);
		} else if (controllerType ==  Sui_Demo_ControllerType.character){
			followDistance -= (MouseScrollDistance*8.0);
			followDistance = Mathf.Clamp(followDistance,1.25,8.0);
		}
		followTgtDistance = Mathf.Lerp(followTgtDistance,followDistance,Time.deltaTime*followLerpSpeed);
		
		
		//rotate target object based on mouse input
		targetRotation.eulerAngles.y += camRotation;


		//set camera distance
		transform.position = targetPosition;
		transform.position.y += camHeight;//followPos.y;
			
		//rotate camera to follow target and set distance
		transform.eulerAngles.x = targetRotation.eulerAngles.x;
		transform.eulerAngles.y = targetRotation.eulerAngles.y ;

		
		//set final camera position
		transform.Translate(-Vector3.forward*followTgtDistance,transform);
		if (isUnderWater && keepUnderwater){
			if (transform.position.y >= waterHeight-0.1){
				transform.position.y = waterHeight-0.11;
			}
		} else if (!isUnderWater && keepUnderwater){
			if (transform.position.y <= waterHeight+0.2){
				transform.position.y = waterHeight+0.21;
			}
		}
		transform.LookAt(followPos);






		//check camera for blocking obstacles, and reposition
		var hits : RaycastHit[];
		var testPos : Vector3 = cameraTarget.transform.position;
		testPos.y += followHeight;
		var hit : RaycastHit;
	    if(Physics.Linecast(testPos,transform.position, hit)) {
		    if (hit.transform.gameObject.layer!=4){
				if (hit.transform == transform || hit.transform == cameraTarget){
					//do nothing
				} else {
					//check for triggers
					var trigCheck : boolean = false;
					//if (hit.transform.GetComponent(MeshCollider) != null){
					//	if (hit.transform.GetComponent(MeshCollider).isTrigger) trigCheck = true;
					//}
					if (hit.transform.GetComponent(Collider) != null){
						if (hit.transform.GetComponent(Collider).isTrigger) trigCheck = true;
					}
					
					if (!trigCheck){
		           	//calculate ray
		            var dirRay = new Ray(testPos, testPos - transform.position);
		           	 //move camera
		            transform.position = hit.point;
		            }
		        }
	        }
	    }

		//set camera leaning
		transform.rotation.eulerAngles.z = Mathf.Lerp(transform.rotation.eulerAngles.z,(transform.rotation.eulerAngles.z + (cameraLean * MouseRotationDistance)), Time.deltaTime*25.0);

		
	}
	
	
	
	
	//---------------------------------
	//  SET CAMERA SETTINGS and FX
	//---------------------------------
	if (isControllable){
		//SET CAMERA SETTINGS
		camera.fieldOfView = camFOV;
	}




	//------------------------------------
	//  SEND MODES TO CHARACTER ANIMATOR
	//------------------------------------
	/*
	if (targetAnimator != null){
	

		if (controllerType == Sui_Demo_ControllerType.vehicle){
		
			//send vehicle-specific animations
			targetAnimator.isWalking = false;
			targetAnimator.isRunning = false;
			targetAnimator.moveForward = 0.0;
			targetAnimator.moveSideways = 0.0;
			targetAnimator.moveVertical = 0.0;
			targetAnimator.isInWater = false;
			targetAnimator.isInWaterDeep = false;
			targetAnimator.isUnderWater = false;
			targetAnimator.isFloating = false;
			targetAnimator.isFalling = false;
			
		} else if (controllerType == Sui_Demo_ControllerType.character){
		
			//send normal animations
			if (moveForward != 0.0 || moveSideways != 0.0){
				targetAnimator.isWalking = true;
				//targetAnimator.isRunning = false;
				//if (isRunning) targetAnimator.isRunning = true;
			} else {
				targetAnimator.isWalking = false;
				//targetAnimator.isRunning = false;
			}
		
			targetAnimator.isRunning = isRunning;
			targetAnimator.moveForward = moveForward;
			targetAnimator.moveSideways = moveSideways;
			targetAnimator.moveVertical = moveVertical;
			targetAnimator.isInWater = isInWater;
			targetAnimator.isInWaterDeep = isInWaterDeep;
			targetAnimator.isUnderWater = isUnderWater;
			targetAnimator.isFloating = isFloating;
			targetAnimator.isFalling = isFalling;
			
		}
	
	}
	*/



}




