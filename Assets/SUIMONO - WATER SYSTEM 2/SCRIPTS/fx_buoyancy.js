#pragma strict

//PUBLIC VARIABLES
var applyToParent : boolean = false;
var engageBuoyancy : boolean = false;
var inheritForce : boolean = false;
var keepAtSurface : boolean = false;
var buoyancyStrength : float = 1.0;
var buoyancyOffset : float = 0.0;
var surfaceRange : float = 0.2;
var forceAmount : float = 1.0;
var forceHeightFactor : float = 0.0;
var maxVerticalSpeed: float = 5.0;
//var testHeightAmt : float = 1.0;

// PRIVATE VARIABLES
private var isUnder : boolean = false;
private var surfaceLevel : float = 0.0;
private var underwaterLevel : float = 0.0;

private var isUnderwater : boolean = false;
private var isOverWater : boolean = false;

private var physTarget : Transform;
private var moduleObject : SuimonoModule;
private var suimonoObject : SuimonoObject;

private var height : float = -1;
private var getScale : float = 1.0;
private var waveHeight : float = 0.0;

private var modTime : float = 0.0;
private var splitFac : float = 1.0;

private var rendererComponent : Renderer;
private var rigidbodyComponent : Rigidbody;


function OnDrawGizmos (){
	var gizPos : Vector3 = transform.position;
	gizPos.y += 0.03;
	Gizmos.DrawIcon(gizPos, "gui_icon_buoy.psd", true);
	gizPos.y -= 0.03;
	//Gizmos.color = Color(0.4,0.7,1.0,0.6);
	//Gizmos.DrawSphere(gizPos, 0.2);
	Gizmos.color = Color(0.2,0.4,1.0,0.75);
	Gizmos.DrawWireSphere(gizPos, 0.2);
	Gizmos.DrawWireSphere(gizPos, 0.195);
	Gizmos.DrawWireSphere(gizPos, 0.19);
}


function Awake() {

	moduleObject = GameObject.Find("SUIMONO_Module").gameObject.GetComponent(SuimonoModule);
	rendererComponent = GetComponent(Renderer);

}


function Start(){

	//get number of buoyant objects
	if (applyToParent){
		var buoyancyObjects : Component[];
		buoyancyObjects = transform.parent.gameObject.GetComponentsInChildren(fx_buoyancy);
		if (buoyancyObjects != null){
			splitFac = 1.0/buoyancyObjects.Length;
		}
	}
	
}




function FixedUpdate () {


	//clamp
	forceHeightFactor = Mathf.Clamp(forceHeightFactor,0.0,1.0);
	
	//set debug visibility
	if (rendererComponent && applyToParent){
	if (moduleObject != null){
		if (moduleObject.showDebug){
			rendererComponent.enabled = true;
		}
	
		if (!moduleObject.showDebug && rendererComponent){
			rendererComponent.enabled = false;
		}
	}
	}


	
	//set physics target
	if (applyToParent){
		physTarget = this.transform.parent.transform;
		if (rigidbodyComponent == null){
			rigidbodyComponent = physTarget.GetComponent(Rigidbody);
		}
	} else {
		physTarget  = this.transform;
		if (rigidbodyComponent == null){
			rigidbodyComponent = GetComponent(Rigidbody);
		}
	}
	

	
	//Reset values
	isUnderwater = false;
	isOverWater = false;
	height = -1;
	surfaceLevel = -1;
	suimonoObject = null;
	underwaterLevel = 0.0;



	//get wave height calculations from suimono module
	height = moduleObject.SuimonoGetHeight(this.transform.position,"height");
	surfaceLevel = moduleObject.SuimonoGetHeight(this.transform.position,"surfaceLevel");
	var isOver : float = moduleObject.SuimonoGetHeight(this.transform.position,"isOverWater");
	if (isOver == 1.0) isOverWater = true;

	
	
	//calculate scaling
	var testObjectHeight = (transform.position.y+buoyancyOffset);
	
	//if (suimonoObject != null){
		//getScale = suimonoObject.waveHeight;
		waveHeight = surfaceLevel;
		if (testObjectHeight < waveHeight){
			isUnderwater = true;
		}
		underwaterLevel =  waveHeight-testObjectHeight;
	//}
	
	


	
	//set buoyancy
	//if (!keepAtSurface){
	if (engageBuoyancy && isOverWater){
	if (rigidbodyComponent && !rigidbodyComponent.isKinematic){
		//if (underwaterLevel > 0.1){
			
			var buoyancyFactor : float = 10.0;

			if (this.transform.position.y+buoyancyOffset < waveHeight-surfaceRange){
				
				// add vertical force to buoyancy while underwater
				isUnder = true;
				var forceMod : float = (buoyancyFactor * (buoyancyStrength * rigidbodyComponent.mass) * (underwaterLevel) * splitFac);
				if (rigidbodyComponent.velocity.y < maxVerticalSpeed){
					rigidbodyComponent.AddForceAtPosition(Vector3(0,1,0) * forceMod, transform.position);
				}
				modTime = 0.0;
				
			} else {
				
				// slow down vertical velocity as it reaches water surface or wave zenith
				isUnder = false;
				modTime = (this.transform.position.y+buoyancyOffset) / (waveHeight+Random.Range(0.0,0.25));
				if (rigidbodyComponent.velocity.y > 0.0){
					rigidbodyComponent.velocity.y = Mathf.SmoothStep(rigidbodyComponent.velocity.y,0.0,modTime);
				}
				
			}
			
			
			//Add Water Force / Direction to Buoyancy Object
			if (inheritForce){
			if (this.transform.position.y+buoyancyOffset <= waveHeight){
				var forceDir : float = moduleObject.SuimonoGetHeight(this.transform.position,"direction");
				var forceAngles : Vector2 = moduleObject.SuimonoConvertAngleToDegrees(forceDir);
				var forceSpeed : float = moduleObject.SuimonoGetHeight(this.transform.position,"speed");
				var waveHt : float = moduleObject.SuimonoGetHeight(this.transform.position,"wave height");
				var waveFac : float = Mathf.Lerp(forceHeightFactor,1.0,waveHt);//forceHeightFactor
				rigidbodyComponent.AddForceAtPosition(Vector3(forceAngles.x,0,forceAngles.y) * (buoyancyFactor*2.0) * forceSpeed * waveFac * splitFac * forceAmount, transform.position);
			}
			}
			

	}
	}
	//}

	
}



function LateUpdate(){
	
	if (keepAtSurface){
		//rigidbodyComponent.isKinematic = true;
		//rigidbodyComponent.useGravity = false;
		//physTarget.transform.position.y = (waveHeight - (this.transform.localPosition.y));
	}
	
	//under surface range
	//if (this.transform.position.y > waveHeight-surfaceRange && isUnder){
	
		//if (rigidbodyComponent.velocity.y > 0.0) rigidbodyComponent.velocity.y = 0.0;

		//if (Mathf.Approximately(rigidbodyComponent.velocity.y,0.0)){
			//this.transform.position.y = waveHeight;
			//isUnder = false;
		//}
	//}
	


}

