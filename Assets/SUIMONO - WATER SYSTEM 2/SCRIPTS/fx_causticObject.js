#pragma strict

var setManual : boolean = false;
var lightRange : float = 20.0;
var lightFalloff : float = 20.0;
var shiftTime : float = 5.0;

var calcDist : float;

private var surfaceHeight : float = 0.0;
private var followObject : Transform;

private var moduleObject : SuimonoModule;
private var causticObject : fx_causticModule;
private var lightComponent : Light;
private var sceneLightComponent : Light;
private var sceneIntense : float = 1.0;
private var sceneTint : Color = Color(1,1,1,1);
private var localTint : Color = Color(1,1,1,1);

function Awake () {
	
	//get master objects
	moduleObject = GameObject.Find("SUIMONO_Module").GetComponent(SuimonoModule);
	causticObject = GameObject.Find("_caustic_effects").GetComponent(fx_causticModule);
	lightComponent = GetComponent(Light);
	
	if (causticObject.sceneLightObject != null){
		sceneLightComponent = causticObject.sceneLightObject.GetComponent(Light);
	}
	
	Random.seed = Mathf.Floor(transform.position.x + transform.position.y + transform.position.z);
	shiftTime = 3.0 + Random.Range(0.0,12.0);
	
}




function Start(){

	InvokeRepeating("SetCaustics",0.1,(1.0/causticObject.causticFPS));
	
}




function SetCaustics () {
	
	//enable caustic light
	if (!causticObject.enableCaustics){
		lightComponent.enabled = false;
	} else {
	
	
	//get the current follow object from module
	if (moduleObject.setCamera != null){
		followObject = moduleObject.setCamera;
	} else {
		if (Camera.main != null){
			followObject = Camera.main.transform;
		}
	}
	
	//set manual/auto controls
	if (!setManual){
		lightRange = causticObject.causticRange * 0.4;
		lightFalloff = causticObject.causticRange * 0.2;
	}
	
	//get the water surface height
	surfaceHeight = this.transform.position.y;

	if (!setManual){
	
		/*
		surfaceHeight = 1.9;
		lightComponent.enabled = false;
		
		var layer : int = 4;
		var layermask : int = 1 << layer;
		surfaceHeight = -500;
		var hasHit : boolean = true;
		var hits : RaycastHit[];
		var testpos : Vector3 = Vector3(transform.position.x,transform.position.y+5000.0,transform.position.z);
		hits = Physics.RaycastAll(testpos, -Vector3.up, 10000.0, layermask);
		for (var i = 0;i < hits.Length; i++) {
			var ht : RaycastHit = hits[i];
			if (ht.transform.gameObject.layer==4){
				surfaceHeight = ht.transform.position.y - 0.01;
				lightComponent.enabled = true;
				break;
			}
		}
		*/
	}
	
	//get the current light texture from Module
	lightComponent.cookie = causticObject.useTex;
	lightComponent.cullingMask = causticObject.useTheseLayers;
	
	
	//ping pong the light angle and position
	if (!setManual){
		lightComponent.spotAngle = 155.0 + (Mathf.Sin(Time.time / (shiftTime*2.25)) * shiftTime);
		surfaceHeight = moduleObject.SuimonoGetHeight(this.transform.position,"surfaceLevel");
		lightComponent.transform.position.y = surfaceHeight - 0.1 - (Mathf.Sin(Time.time / (shiftTime*2.2)) * 0.2);
		lightComponent.transform.eulerAngles.y = 0.0 + (Mathf.Sin(Time.time / (shiftTime*50.0)) * 360.0);

	
	}
	
	//get scene lighting
	sceneIntense = 2.0;
	sceneTint = Color(1,1,1,1);
	localTint = causticObject.causticTint;
	if (sceneLightComponent != null){
		sceneIntense = sceneLightComponent.intensity*2.0;
		sceneTint = sceneLightComponent.color;
		if (!sceneLightComponent.enabled) sceneIntense = 0.0;
	}
	//ping pong the light color
	lightComponent.color = sceneTint * localTint * (0.85+(Mathf.Sin(Time.time / (shiftTime*0.4)) * 0.15));
	//lightComponent.color.b = (0.85+(Mathf.Sin(Time.time / (shiftTime*0.3)) * 0.15));
	
	//dim the light based on distance
	if (followObject != null) calcDist = Vector3.Distance(this.transform.position, followObject.transform.position);
	if (calcDist <= lightRange+lightFalloff){
		lightComponent.enabled = true;
		//if (calcDist <= lightRange){
			//lightComponent.intensity = 0.65;
		//} else {
			lightComponent.intensity = Mathf.Lerp(sceneIntense,0.0,((calcDist-lightRange)/lightFalloff));
		//}
	} else {
		lightComponent.enabled = false;
		lightComponent.intensity = 0.0;
	}
	lightComponent.intensity *= 2.0;
	
	}
	
}