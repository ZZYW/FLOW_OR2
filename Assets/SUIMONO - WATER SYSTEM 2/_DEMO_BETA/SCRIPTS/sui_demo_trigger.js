#pragma strict

enum Sui_Demo_TriggerType{
		switchtovehicle,
		watersurface
		}
var triggerType : Sui_Demo_TriggerType =  Sui_Demo_TriggerType.switchtovehicle;
var requireLineOfSight : boolean = true;

var showIcon : Texture2D;
var showLabel : boolean = true;
var label : String = "";
var labelColor : Color = Color(0,0,0,1);
var labelOffset : Vector2 = Vector2(80,-75);
var labelSize : Vector2 = Vector2(250,25);
var actionKey : String = "f";
var requireReset : boolean = true;
var trackObject : Transform;
var fadeSpeed : float = 0.0;

private var moduleObject : SuimonoModule;
private var suimonoCamera : sui_demo_Controller2;
private var isInRange : boolean = false;
private var onLabel : boolean = false;
private var onAction = false;
private var resetTrigger : boolean = false;
private var useLabel : String = "";
private var style : GUISkin;
private var fadeTimer : float = 0.0;
private var isInSight : boolean = false;

function Start () {

	// Object References
	if (GameObject.Find("SUIMONO_Module")){
		moduleObject = GameObject.Find("SUIMONO_Module").GetComponent(SuimonoModule) as SuimonoModule;
		suimonoCamera = moduleObject.setCamera.gameObject.GetComponent(sui_demo_Controller2) as sui_demo_Controller2;
		trackObject = suimonoCamera.characterTarget;
	}

}



function Update () {
	
	if (!resetTrigger){
	
	//set default label
	useLabel = label;
	
	//change colors and fading
	if (renderer){
	if (isInRange){
		renderer.material.SetColor("_TintColor",Color(0,1,0,0.1));
		fadeTimer = Mathf.Lerp(fadeTimer,1.0,Time.deltaTime * fadeSpeed);
	} else {
		renderer.material.SetColor("_TintColor",Color(1,0,0,0.1));
		fadeTimer = Mathf.Lerp(fadeTimer,0.0,Time.deltaTime * fadeSpeed * 5.0);
	}
	}
	fadeTimer = Mathf.Clamp(fadeTimer,0.0,1.0);

	//CHECK FOR ACTION KEY
	if (isInRange){
		if (Input.GetKeyUp(actionKey)) onAction = true;
	}
	
	//CHECK LINE OF SIGHT
	isInSight = CheckLineOfSight();

	//PERFORM TRIGGER ACTIONS
	if (onAction){
		useLabel = "";
		onAction= false;
		if (requireReset) resetTrigger = true;
		if (suimonoCamera != null){
		if (triggerType == Sui_Demo_TriggerType.switchtovehicle && suimonoCamera != null){
			if (suimonoCamera.controllerType == Sui_Demo_ControllerType.vehicle){
				suimonoCamera.controllerType = Sui_Demo_ControllerType.character;
			} else if (suimonoCamera.controllerType == Sui_Demo_ControllerType.character){
				suimonoCamera.controllerType = Sui_Demo_ControllerType.vehicle;
			}
		}
		}
		
	}
	
	}
	
	//SHOW LABEL
	if (suimonoCamera != null){
	if (isInRange && useLabel != "" && suimonoCamera.vehicleReset){
		onLabel = true;
	} else {
		onLabel = false;
	}
	}


}



function OnTriggerEnter(other : Collider){
	if (trackObject != null){
	if (other == trackObject.GetComponent(Collider)){
		isInRange = true;
		if (requireLineOfSight && !isInSight) isInRange = false;
	}}
}

function OnTriggerStay(other : Collider){
	if (trackObject != null){
	if (other == trackObject.GetComponent(Collider)){
		isInRange = true;
		if (requireLineOfSight && !isInSight) isInRange = false;
	}}
}


function OnTriggerExit(other : Collider){
	if (trackObject != null){
	if (other == trackObject.GetComponent(Collider)){
		isInRange = false;
		resetTrigger = false;
	}}
}


function CheckLineOfSight(){
	var retBool : boolean = false;
	
	if (requireLineOfSight && Camera.main != null){
		var hits : RaycastHit[];
		var ray : Ray = Camera.main.ViewportPointToRay (Vector3(0.5,0.5,0));
		hits = Physics.RaycastAll(ray,500.0);
		
		for (var i = 0;i < hits.Length; i++) {
			var hit : RaycastHit = hits[i];
			var coll =  hit.collider;
			if (coll) {
				if (coll == this.collider) retBool = true;
			}
		}
		
		
	}

	return retBool;
}



function OnGUI(){

	//if (onLabel && !resetTrigger){
	if (fadeTimer > 0.0 && onLabel && !resetTrigger){
		//handle fade
		//if (fadeSpeed > 0.0){
		//	fadeTimer = Mathf.Lerp(fadeTimer,1.0,Time.deltaTime * fadeSpeed);
		//} else {
		//	fadeTimer = 1.0;
		//}
		
		GUI.color = labelColor;
		GUI.color.a = fadeTimer;
		
		//show label
	 	if (showLabel) GUI.Box(Rect (Screen.width/2-labelOffset.x, Screen.height/2-labelOffset.y, labelSize.x,labelSize.y), useLabel);
	 	GUI.color = Color(1.0,1.0,1.0,fadeTimer);
	 	if (showIcon != null) GUI.Label(Rect (Screen.width/2-labelOffset.x, Screen.height/2-labelOffset.y, showIcon.width,showIcon.height), showIcon);
	}
	
}
