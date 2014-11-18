var isUnderwater : float = 0.0;
var checkPosition : Vector3;
private var moduleObject : SuimonoModule;
public var controller : GameObject;

function Awake() {
     moduleObject = GameObject.Find("SUIMONO_Module").gameObject.GetComponent(SuimonoModule);
}

function Update(){
	checkPosition = controller.transform.position;
	
     if (moduleObject != null){
          isUnderwater = moduleObject.SuimonoGetHeight(checkPosition,"object depth");
          isUnderwater = Mathf.Clamp01(isUnderwater);
     }
}