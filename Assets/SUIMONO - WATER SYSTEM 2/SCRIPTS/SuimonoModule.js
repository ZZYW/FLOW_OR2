#pragma strict

@script ExecuteInEditMode()

//Underwater Effects variables
var unityVersionIndex : int;// = 1;
var unityVersionUseIndex : int;//;
var unityVersionOptions = new Array("Unity","Unity DX11","Unity Pro","Unity Pro DX11","Unity iOS","Unity Android");

var includePresetsInBuild : boolean = false;

var useDarkUI : boolean = true;
var useUVReversal : boolean = false;
var isUnityPro : boolean = true;
var unityVersion : String = "---";
var setCamera : Transform;
var setTrack : Transform;
var enableUnderwaterPhysics : boolean = true;
var enableUnderwaterFX : boolean = true;
var enableUnderwaterDeferred : boolean = true;
var enableInteraction : boolean = true;

var enableRefraction : boolean = true;
var enableDynamicReflections : boolean = true;
var showPerformance : boolean = false;
var showGeneral : boolean = false;

var etherealScroll : float = 0.1; 

var enableBlur : boolean = true;
var underwaterColor : Color = Color(0.58,0.61,0.61,0.0);
var enableTransition : boolean = true;
var blurAmount : float = 0.005;
var refractionAmount : float = 20.0;
var cameraPlane_offset : float = 0.1;

var showDebug : boolean = false;
var blurSamples : int = 20;

var causticsOnMobile : boolean = false;
var causticObjectNum : int = 25;
//private var camRendering : RenderingPath;

var shaderSurface : Shader;
var shaderUnderwater : Shader;
var shaderUnderwaterFX : Shader;
private var shaderDropletsFX : Shader;
private var debrisShaderFX : Shader;

private var underwaterLevel = 0.0;
private var underwaterRefractPlane : GameObject;
private var waterTransitionPlane : GameObject;
private var waterTransitionPlane2 : GameObject;
private var underwaterDebris : ParticleSystem;

private var underLightAmt : float = 0.0;
private var underFogDist : float = 0.0;
private var underFogSpread : float = 0.0;
private var reflectColor : Color;
private var causticsColor : Color;
private var causticsSizing : float;
private var hitAmt : float = 1.0;
private var origDepthAmt : float = 1.0;
private var origReflColr : Color;

private var refractAmt : float = 0.0;
private var refractSpd : float = 0.0;
private var refractScl : float = 0.0;

private var targetSurface : GameObject;
private var targetObject : SuimonoObject;
private var doTransitionTimer : float = 0.0;
 
static var isUnderwater : boolean = false;
static var doWaterTransition : boolean = false;




//splash effects variables
var alwaysEmitRipples : boolean = false;
var maxEmission = 5000;
var playSounds : boolean = true;
var maxVolume = 1.0;
var maxSounds = 10;
var defaultSplashSound : AudioClip[];
var soundObject : Transform;

var fxObject : SuimonoModuleFX;

private var isinwater : boolean = false;
private var atDepth : float = 0.0;

private var splash_rings : Transform;
private var splash_small : Transform;
private var splash_med : Transform;
private var splash_dirt : Transform;
private var splash_drops : Transform;

private var isPlayingTimer = 0.0;

private var setvolumetarget = 0.65;
private var setvolume = 0.65;

private var ringsSystem : ParticleSystem;
private var ringsParticles : ParticleSystem.Particle[];

private var ringFoamSystem : ParticleSystem;
private var ringFoamParticles : ParticleSystem.Particle[];
private var ringFoamParticlesNum : int = 1;

private var splashSystem : ParticleSystem;
private var splashParticles : ParticleSystem.Particle[];
private var splashParticlesNum : int = 1;

private var splashDropSystem : ParticleSystem;
private var splashDropParticles : ParticleSystem.Particle[];
private var splashDropParticlesNum : int = 1;

private var sndparentobj : fx_soundModule;
private var sndObject = new Array();
private var sndObjects : Transform[];
private var currentSound = 0;

var currentObjectDepth : float = 0.0;
var currentSurfaceLevel : float = 0.0;
var suimonoObject : SuimonoObject;

private var effectBubbleSystem : ParticleSystem;
private var effectBubbles : ParticleSystem.Particle[];
private var effectBubblesNum : int = 1;

private var planeIsSet : boolean = false;

var suimonoModuleLibrary : SuimonoModuleLib;


private var waterTransitionRendererComponent : Renderer;
private var waterTransitionParticleComponent : ParticleSystem;
private var waterTransitionParticleRenderComponent : Renderer;
private var waterTransition2RendererComponent : Renderer;
private var waterTransition2ParticleComponent : ParticleSystem;
private var waterTransition2ParticleRenderComponent : Renderer;
private var underwaterDebrisRendererComponent : Renderer;
private var underwaterRefractRendererComponent : Renderer;
private var setCameraComponent : Camera;



function Start(){


	#if UNITY_EDITOR
		PrefabUtility.DisconnectPrefabInstance(this.gameObject);
	#endif
    
	//get unity version
	unityVersion = Application.unityVersion.ToString().Substring(0,1);
	
	//INITIATE DEFAULT SHADERS
	//shaderSurface = Shader.Find("Suimono2/water_pro_final");
	//shaderUnderwater = Shader.Find("Suimono2/water_under_pro_final");
	//shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_final");
	//shaderDropletsFX = Shader.Find("Suimono2/effect_refraction");
	//debrisShaderFX = Shader.Find("Suimono2/particle_Alpha");


	//INITIATE OBJECTS
    suimonoModuleLibrary = this.gameObject.GetComponent(SuimonoModuleLib);
    
    if (this.gameObject.Find("effect_refract_plane") != null) underwaterRefractPlane = this.gameObject.Find("effect_refract_plane");
    if (this.gameObject.Find("effect_dropletsParticle") != null) waterTransitionPlane = this.gameObject.Find("effect_dropletsParticle");
    if (this.gameObject.Find("effect_water_fade") != null) waterTransitionPlane2 = this.gameObject.Find("effect_water_fade");
    
    #if !UNITY_3_5
    	if (underwaterRefractPlane != null) underwaterRefractPlane.SetActive(true);
    #else
    	if (underwaterRefractPlane != null) underwaterRefractPlane.active = true;
    #endif
    
    fxObject = this.gameObject.GetComponent(SuimonoModuleFX) as SuimonoModuleFX;
    
    if (this.gameObject.Find("effect_underwater_debris") != null) underwaterDebris = this.gameObject.Find("effect_underwater_debris").gameObject.GetComponent(ParticleSystem);
    if (this.gameObject.Find("effect_fx_bubbles") != null) effectBubbleSystem = this.gameObject.Find("effect_fx_bubbles").gameObject.GetComponent(ParticleSystem);
       
    //splash effects init
	if (this.gameObject.Find("splash_rings_normal_prefab") != null) ringsSystem = this.gameObject.Find("splash_rings_normal_prefab").gameObject.GetComponent(ParticleSystem);
	if (this.gameObject.Find("splash_ringsFoam_prefab") != null) ringFoamSystem = this.gameObject.Find("splash_ringsFoam_prefab").gameObject.GetComponent(ParticleSystem);
	if (this.gameObject.Find("splash_prefab") != null) splashSystem = this.gameObject.Find("splash_prefab").gameObject.GetComponent(ParticleSystem);
	if (this.gameObject.Find("splash_droplets_prefab") != null) splashDropSystem = this.gameObject.Find("splash_droplets_prefab").gameObject.GetComponent(ParticleSystem);
	if (this.gameObject.Find("_sound_effects") != null) sndparentobj = this.gameObject.Find("_sound_effects").gameObject.GetComponent(fx_soundModule);


	#if UNITY_EDITOR
	if (EditorApplication.isPlaying){
	#endif
	if (soundObject != null && sndparentobj != null){
		maxSounds = sndparentobj.maxSounds;
		sndObjects = new Transform[maxSounds];
		for (var sx=0; sx < (maxSounds); sx++){
			var soundObjectPrefab = Instantiate(soundObject, transform.position, transform.rotation);
			soundObjectPrefab.transform.parent = sndparentobj.transform;
			sndObjects[sx] = (soundObjectPrefab);
		}
	}

	#if UNITY_EDITOR
	}
	#endif
	//
	

	
	//set camera
	if (setCamera == null){
		if (Camera.main != null){
			setCamera = Camera.main.transform;
			//setCameraComponent = Camera.main.GetComponent(Camera);
			//camRendering = setCameraComponent.renderingPath;
		//} else {
			//Debug.Log("SUIMONO Error: no camera has been defined!  Suimono requires a camera to either be explicitly set in the Suimono_Module object, OR to be tagged with the 'MainCamera' GameObject tag."); 
		}
	} else {
		//setCameraComponent.depthTextureMode = DepthTextureMode.DepthNormals;
		//camRendering = setCameraComponent.renderingPath;
	}
	
	//set track object
	if (setTrack == null && setCamera != null){
		setTrack = setCamera.transform;
	}

	//store component references
	waterTransitionRendererComponent = waterTransitionPlane.GetComponent(Renderer);
	waterTransitionParticleComponent = waterTransitionPlane.GetComponent(ParticleSystem);
	waterTransitionParticleRenderComponent = waterTransitionPlane.GetComponent(ParticleSystem).GetComponent(Renderer);
	waterTransition2RendererComponent = waterTransitionPlane2.GetComponent(Renderer);
	waterTransition2ParticleComponent = waterTransitionPlane2.GetComponent(ParticleSystem);
	waterTransition2ParticleRenderComponent = waterTransitionPlane2.GetComponent(ParticleSystem).GetComponent(Renderer);
	underwaterDebrisRendererComponent = underwaterDebris.GetComponent(Renderer);
	underwaterRefractRendererComponent = underwaterRefractPlane.GetComponent(Renderer);

	InvokeRepeating("StoreSurfaceHeight",0.1,0.1);

}




function FixedUpdate () {
		
		
		//UNITY BASIC VERSION SPECIFIC
		if (unityVersionIndex == 0){//unity basic version
			//shaderSurface = Shader.Find("Suimono2/water_basic2");
			//shaderUnderwater = Shader.Find("Suimono2/water_under_basic");
			shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_basic");
			shaderDropletsFX = Shader.Find("Suimono2/effect_refraction_mobile");
			debrisShaderFX = Shader.Find("Suimono2/particle_Alpha_4");
		}
		
		//UNITY BASIC DX11 VERSION SPECIFIC
		if (unityVersionIndex == 1){//unity basic dx11 version
			//shaderSurface = Shader.Find("Suimono2/water_basic_dx11");
			//shaderUnderwater = Shader.Find("Suimono2/water_under_basic_dx11");
			shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_basic");
			shaderDropletsFX = Shader.Find("Suimono2/effect_refraction_mobile");
			debrisShaderFX = Shader.Find("Suimono2/particle_Alpha_4");
		}
				
		//UNITY iOS VERSION SPECIFIC
		else if (unityVersionIndex == 4){//mobile
			//shaderSurface = Shader.Find("Suimono2/water_ios");
			//shaderUnderwater = Shader.Find("Suimono2/water_under_ios");
			shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_basic");
			shaderDropletsFX = Shader.Find("Suimono2/effect_refraction_mobile");
			debrisShaderFX = Shader.Find("Suimono2/particle_Alpha_4");	
		}
		
		//UNITY ANDROID VERSION SPECIFIC
		else if (unityVersionIndex == 5){//android
			//shaderSurface = Shader.Find("Suimono2/water_android");
			//shaderUnderwater = Shader.Find("Suimono2/water_under_android");
			shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_basic");
			shaderDropletsFX = Shader.Find("Suimono2/effect_refraction_mobile");
			debrisShaderFX = Shader.Find("Suimono2/particle_Alpha_4");	
		}
			
		//UNITY PRO DX11 VERSION SPECIFIC
		#if !UNITY_STANDALONE_OSX
		else if (unityVersionIndex == 3){//dx11
			//shaderSurface = Shader.Find("Suimono2/water_pro_dx11");
			//shaderUnderwater = Shader.Find("Suimono2/water_under_pro_dx11");
			shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_dx11");
			shaderDropletsFX = Shader.Find("Suimono2/effect_refraction");
			debrisShaderFX = Shader.Find("Suimono2/particle_Alpha_4");
		}
		#endif
		
		//UNITY PRO VERSION SPECIFIC
		else if (unityVersionIndex == 2){//pro
			//shaderSurface = Shader.Find("Suimono2/water_pro");
			//shaderUnderwater = Shader.Find("Suimono2/water_under_pro");
			shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane");
			if (!enableRefraction) shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_norefract");
			shaderDropletsFX = Shader.Find("Suimono2/effect_refraction");
			debrisShaderFX = Shader.Find("Suimono2/particle_Alpha_4");
			//if (setCamera.GetComponent(Camera).actualRenderingPath == RenderingPath.Forward){
			//	shaderUnderwater = Shader.Find("Suimono2/water_under_pro_fwd");
			//}
		}
		
		//suimonoModuleLibrary.shader3 = shaderUnderwaterFX;
	

	
	
	
	//reset sound objects
	//#if UNITY_EDITOR
	//if (!EditorApplication.isPlaying){
	//	sndObjects = null;
	//}
	//#endif
	
	//set camera
	if (setCamera == null){
		if (Camera.main != null){
			setCamera = Camera.main.transform;
			//setCameraComponent = Camera.main.GetComponent(Camera);
		//} else {
			//Debug.Log("SUIMONO Error: no camera has been defined!  Suimono requires a camera to either be explicitly set in the Suimono_Module object, OR to be tagged with the 'MainCamera' GameObject tag."); 
		}
	} else {
		setCamera.GetComponent(Camera).depthTextureMode = DepthTextureMode.Depth;
	}
	
	//set track object
	if (setTrack == null && setCamera != null){
		setTrack = setCamera.transform;
	}


}








//#############################
//	CUSTOM FUNCTIONS
//#############################


function StoreSurfaceHeight(){
	
	if (setCamera != null){
		SuimonoGetHeight(setCamera.transform.position,"store variables");
		checkUnderwaterEffects();
		checkWaterTransition();
	}
}








/*
function AddFX2(fxSystem : int, effectPos : Vector3, addRate : int, addSize : float, addRot : float, addARot : float, addVeloc : Vector3, addCol : Color){
	if (fxObject != null){

		var setParticles = new ParticleSystem.Particle[addRate];
		for (var px : int = 0; px < addRate; px++){
				
			//set position
			setParticles[px].position.x = effectPos.x;
			setParticles[px].position.y = effectPos.y;
			setParticles[px].position.z = effectPos.z;
			
			//set variables
			setParticles[px].size = addSize;
			setParticles[px].rotation = addRot;
			setParticles[px].angularVelocity = fxSystem * 1.0; //system;
			setParticles[px].velocity.x = addVeloc.x;
			setParticles[px].velocity.y = addVeloc.y;
			setParticles[px].velocity.z = addVeloc.z;
			setParticles[px].color *= addCol;
			
			fxObject.AddParticle(setParticles[px]);
			//fxObject.particleReserve.Add(setParticles[px]);
			
		}
	}
}
*/







function AddFX(fxSystem : int, effectPos : Vector3, addRate : int, addSize : float, addRot : float, addARot : float, addVeloc : Vector3, addCol : Color){
	if (fxObject != null){
		var fx = fxSystem;
		//if (addMode == "rings"){
			if (fxObject.fxObjects[fx] != null){

			//fxObject.fxObjects[px].GetComponent(ParticleSystem).GetComponent(Renderer).sharedMaterial.shader = shaderDropletsFX;
			
			
			//#if !UNITY_3_5
				//In Unity 4.0+ We can simply emit the particle with specific parameters
				//fxObject.fxObjects[fx].GetComponent(ParticleSystem).Emit(effectPos,addVeloc,addSize,10.0,addCol);
				
			//#else
				//In Unity 3.5 we have to run through this stupid whol-system reset just to define emitted particles!
				fxObject.fxObjects[fx].GetComponent(ParticleSystem).Emit(addRate);
				//get particles
				var setParticles = new ParticleSystem.Particle[fxObject.fxObjects[fx].GetComponent(ParticleSystem).particleCount];
				fxObject.fxObjects[fx].GetComponent(ParticleSystem).GetParticles(setParticles);
				//set particles
				if (fxObject.fxObjects[fx].GetComponent(ParticleSystem).particleCount > 0.0){
				for (var px : int = (fxObject.fxObjects[fx].GetComponent(ParticleSystem).particleCount-addRate); px < fxObject.fxObjects[fx].GetComponent(ParticleSystem).particleCount; px++){
						
						//set position
						setParticles[px].position.x = effectPos.x;
						setParticles[px].position.y = effectPos.y;
						setParticles[px].position.z = effectPos.z;
						
						//set variables
						setParticles[px].size = addSize;
						
						setParticles[px].rotation = addRot;
						setParticles[px].angularVelocity = addARot;
						
						setParticles[px].velocity.x = addVeloc.x;
						setParticles[px].velocity.y = addVeloc.y;
						setParticles[px].velocity.z = addVeloc.z;
						
						setParticles[px].color *= addCol;
						
				}
				fxObject.fxObjects[fx].GetComponent(ParticleSystem).SetParticles(setParticles,setParticles.length);
				fxObject.fxObjects[fx].GetComponent(ParticleSystem).Play();
				}
			//#endif
			
			
		}
		//}
	}
}





/*
function AddFX(fxSystem : int, effectPos : Vector3, addRate : int, addSize : float, addRot : float, addARot : float, addVeloc : Vector3, addCol : Color){
	if (fxObject != null){
		var fx = fxSystem;
		//if (addMode == "rings"){
			if (fxObject.fxObjects[fx] != null){

			//fxObject.fxObjects[px].GetComponent(ParticleSystem).GetComponent(Renderer).sharedMaterial.shader = shaderDropletsFX;
			fxObject.fxObjects[fx].GetComponent(ParticleSystem).Emit(addRate);

			//get particles
			var setParticles = new ParticleSystem.Particle[fxObject.fxObjects[fx].GetComponent(ParticleSystem).particleCount];
			fxObject.fxObjects[fx].GetComponent(ParticleSystem).GetParticles(setParticles);
			//set particles
			if (fxObject.fxObjects[fx].GetComponent(ParticleSystem).particleCount > 0.0){
			for (var px : int = (fxObject.fxObjects[fx].GetComponent(ParticleSystem).particleCount-addRate); px < fxObject.fxObjects[fx].GetComponent(ParticleSystem).particleCount; px++){
					
					//set position
					setParticles[px].position.x = effectPos.x;
					setParticles[px].position.y = effectPos.y;
					setParticles[px].position.z = effectPos.z;
					
					//set variables
					setParticles[px].size = addSize;
					
					setParticles[px].rotation = addRot;
					setParticles[px].angularVelocity = addARot;
					
					setParticles[px].velocity.x = addVeloc.x;
					setParticles[px].velocity.y = addVeloc.y;
					setParticles[px].velocity.z = addVeloc.z;
					
					setParticles[px].color *= addCol;
					
			}
			fxObject.fxObjects[fx].GetComponent(ParticleSystem).SetParticles(setParticles,setParticles.length);
			//fxObject.fxObjects[fx].GetComponent(ParticleSystem).Play();
			}
		}
		//}
	}
}
*/






/*
function AddEffect(addMode : String, effectPos : Vector3, addRate : int, addSize : float, addRot : float, addVeloc : Vector3){

if (enableInteraction){
	var px = 0;
	

	if (addMode == "rings"){
		if (ringsSystem != null){

		ringsSystem.GetComponent(Renderer).sharedMaterial.shader = shaderDropletsFX;
		ringsSystem.Emit(addRate);
		//get particles
		ringsParticles = new ParticleSystem.Particle[ringsSystem.particleCount];
		ringsSystem.GetParticles(ringsParticles);
		//set particles
		if (ringsSystem.particleCount > 0.0){
		for (px = (ringsSystem.particleCount-addRate); px < ringsSystem.particleCount; px++){
				//set position
				ringsParticles[px].position.x = effectPos.x;
				ringsParticles[px].position.y = effectPos.y;
				ringsParticles[px].position.z = effectPos.z;
				//set variables
				ringsParticles[px].size = addSize;
				ringsParticles[px].rotation = addRot;
				ringsParticles[px].velocity = addVeloc;
		}
		ringsSystem.SetParticles(ringsParticles,ringsParticles.length);
		ringsSystem.Play();
		}
	}
	}
	
	
	if (addMode == "ringfoam"){
		if (ringFoamSystem != null){
		ringFoamSystem.Emit(addRate);
		//get particles
		ringFoamParticles = new ParticleSystem.Particle[ringFoamSystem.particleCount];
		ringFoamSystem.GetParticles(ringFoamParticles);
		//set particles
		if (ringFoamSystem.particleCount > 0.0){
		for (px = (ringFoamSystem.particleCount-addRate); px < ringFoamSystem.particleCount; px++){
				//set position
				ringFoamParticles[px].position.x = effectPos.x;
				ringFoamParticles[px].position.y = effectPos.y;
				ringFoamParticles[px].position.z = effectPos.z;
				//set variables
				ringFoamParticles[px].size = addSize;
				ringFoamParticles[px].rotation = addRot;
				ringFoamParticles[px].velocity = addVeloc;
		}
		ringFoamSystem.SetParticles(ringFoamParticles,ringFoamParticles.length);
		ringFoamSystem.Play();
		}
	}
	}
	
	
	if (addMode == "splash"){
		if (splashSystem != null){
		splashSystem.Emit(addRate);
		//get particles
		splashParticles = new ParticleSystem.Particle[splashSystem.particleCount];
		splashSystem.GetParticles(splashParticles);
		//set particles
		if (splashSystem.particleCount > 0.0){
		for (px = (splashSystem.particleCount-addRate); px < splashSystem.particleCount; px++){
				//set position
				splashParticles[px].position.x = effectPos.x;
				splashParticles[px].position.y = effectPos.y;
				splashParticles[px].position.z = effectPos.z;
				//set variables
				splashParticles[px].size = addSize;
				splashParticles[px].rotation = addRot;
				splashParticles[px].velocity = addVeloc;
		}
		splashSystem.SetParticles(splashParticles,splashParticles.length);
		splashSystem.Play();
		}
	}
	}
	
	
	
	if (addMode == "splashDrop"){
		if (splashDropSystem != null){
		splashDropSystem.Emit(addRate);
		//get particles
		splashDropParticles = new ParticleSystem.Particle[splashDropSystem.particleCount];
		splashDropSystem.GetParticles(splashDropParticles);
		//set particles
		if (splashDropSystem.particleCount > 0.0){
		for (px = (splashDropSystem.particleCount-addRate); px < splashDropSystem.particleCount; px++){
				//set position
				splashDropParticles[px].position.x = effectPos.x;
				splashDropParticles[px].position.y = effectPos.y;
				splashDropParticles[px].position.z = effectPos.z;
				splashDropParticles[px].size = addSize;
				splashDropParticles[px].velocity = addVeloc;
		}
		splashDropSystem.SetParticles(splashDropParticles,splashDropParticles.length);
		splashDropSystem.Play();
		}
	}
	}
	
	

	if (addMode == "bubbles"){
		if (effectBubbleSystem != null){
		effectBubbleSystem.Emit(addRate);
		//get particles
		effectBubbles = new ParticleSystem.Particle[effectBubbleSystem.particleCount];
		effectBubbleSystem.GetParticles(effectBubbles);
		//set particles
		if (effectBubbleSystem.particleCount > 0.0){
		for (px = (effectBubbleSystem.particleCount-addRate); px < effectBubbleSystem.particleCount; px++){
				//set position
				effectBubbles[px].position.x = effectPos.x;
				effectBubbles[px].position.y = effectPos.y;
				effectBubbles[px].position.z = effectPos.z;
				effectBubbles[px].size = addSize;
				effectBubbles[px].velocity = addVeloc;
		}
		effectBubbleSystem.SetParticles(effectBubbles,effectBubbles.length);
		effectBubbleSystem.Play();
		}
	}
	}
   
       
       
       

}
}
*/












function AddSoundFX(sndClip : AudioClip, soundPos : Vector3, sndVelocity:Vector3){


	var setstep : AudioClip;
	var setpitch = 1.0;
	var waitTime = 0.4;
	var setvolume = 1.0;
	
	
	
	if (playSounds && sndparentobj.defaultSplashSound.length >= 1 ){
		setstep = sndparentobj.defaultSplashSound[Random.Range(0,sndparentobj.defaultSplashSound.length-1)];
		waitTime = 0.4;
		setpitch = sndVelocity.y;//Random.Range(1.0,1.5);
		setvolume = sndVelocity.z;//0.2;
		setvolume = Mathf.Lerp(0.0,1.0,setvolume);

		//check depth and morph sounds if underwater
		if (currentObjectDepth > 0.0){
			setpitch *=0.25;
			setvolume *=0.5;
		}
		
		var useSoundAudioComponent : AudioSource = sndObjects[currentSound].GetComponent(AudioSource);
		useSoundAudioComponent.clip = sndClip;
		if (!useSoundAudioComponent.isPlaying){
			useSoundAudioComponent.transform.position = soundPos;
			useSoundAudioComponent.volume = setvolume;
			useSoundAudioComponent.pitch = setpitch;
			useSoundAudioComponent.minDistance = 4.0;
			useSoundAudioComponent.maxDistance = 20.0;
			useSoundAudioComponent.clip = setstep;
			useSoundAudioComponent.loop = false;
			useSoundAudioComponent.Play();
		}

		currentSound += 1;
		if (currentSound >= (maxSounds-1)) currentSound = 0;
	}


}







function AddSound(sndMode : String, soundPos : Vector3, sndVelocity:Vector3){

if (enableInteraction){
	var setstep : AudioClip;
	var setpitch = 1.0;
	var waitTime = 0.4;
	var setvolume = 1.0;
	
	
	
	if (playSounds && sndparentobj.defaultSplashSound.length >= 1 ){
		setstep = sndparentobj.defaultSplashSound[Random.Range(0,sndparentobj.defaultSplashSound.length-1)];
		waitTime = 0.4;
		setpitch = sndVelocity.y;//Random.Range(1.0,1.5);
		setvolume = sndVelocity.z;//0.2;
		setvolume = Mathf.Lerp(0.0,10.0,setvolume);

		//check depth and morph sounds if underwater
		if (currentObjectDepth > 0.0){
			setpitch *=0.25;
			setvolume *=0.5;
		}
		
		var useSoundAudioComponent : AudioSource = sndObjects[currentSound].GetComponent(AudioSource);
		if (!useSoundAudioComponent.isPlaying){
			useSoundAudioComponent.transform.position = soundPos;
			useSoundAudioComponent.volume = setvolume;
			useSoundAudioComponent.pitch = setpitch;
			useSoundAudioComponent.minDistance = 4.0;
			useSoundAudioComponent.maxDistance = 20.0;
			useSoundAudioComponent.clip = setstep;
			useSoundAudioComponent.loop = false;
			useSoundAudioComponent.Play();
		}

		currentSound += 1;
		if (currentSound >= (maxSounds-1)) currentSound = 0;
	}

}

}















function checkUnderwaterEffects(){

//#if UNITY_EDITOR
//if (EditorApplication.isPlaying){
//#endif
	//check for underwater
	
		
	//set blur
	if (enableBlur){
		underwaterRefractRendererComponent.sharedMaterial.SetFloat("_BlurSpread",blurAmount);
		//underwaterRefractRendererComponent.sharedMaterial.SetInt("_blurSamples",blurSamples);
		underwaterRefractRendererComponent.sharedMaterial.SetFloat("_blurSamples",blurSamples);
	} else {
		underwaterRefractRendererComponent.sharedMaterial.SetFloat("_BlurSpread",0.0);
		//underwaterRefractRendererComponent.sharedMaterial.SetInt("_blurSamples",blurSamples);
		underwaterRefractRendererComponent.sharedMaterial.SetFloat("_blurSamples",blurSamples);
	}


	
	if (currentObjectDepth > 0.0){
	
		if (enableUnderwaterFX){
		
			//swap camera rendering to deferred for best underwater rendering!
			//note: this can be disabled in the module settings.
			//if (enableUnderwaterDeferred) setCamera.GetComponent(Camera).renderingPath = RenderingPath.DeferredLighting;
		
			//reposition refract plane
			//underwaterRefractRendererComponent.sharedMaterial.SetInt("_blurSamples",blurSamples);
			underwaterRefractRendererComponent.sharedMaterial.SetFloat("_blurSamples",blurSamples);
			underwaterRefractRendererComponent.sharedMaterial.shader = shaderUnderwaterFX;
			underwaterRefractPlane.transform.parent = setCamera.transform;
			underwaterRefractPlane.transform.localScale = Vector3(0.4,1.0,0.3);
			underwaterRefractPlane.transform.localPosition = Vector3(0.0,0.0,(setCamera.GetComponent(Camera).nearClipPlane+(cameraPlane_offset)+0.05));
			underwaterRefractPlane.transform.localEulerAngles = Vector3(270.0,0.0,0.0);
	   		underwaterRefractRendererComponent.enabled = true;


		}
		
	} else {
		
		//swap camera rendering to back to default
		//setCamera.GetComponent(Camera).renderingPath = camRendering;
   		underwaterRefractRendererComponent.enabled = false;

	}
	
	
//#if UNITY_EDITOR	
//}
//#endif

}








function checkWaterTransition () {

//#if UNITY_EDITOR
//if (EditorApplication.isPlaying){
//#endif
		doTransitionTimer += Time.deltaTime;
		
		//SET COLORS
		reflectColor = Color(0.827,0.941,1.0,1.0);

		if (enableUnderwaterFX){

		if (currentObjectDepth > 0.0){
		
			doWaterTransition = true;
			
	       	//set underwater debris
	       	if (suimonoObject != null && setCamera != null){
		       	if (suimonoObject.enableUnderDebris && setCamera != null){

		       		underwaterDebrisRendererComponent.sharedMaterial.shader = debrisShaderFX;
			       	underwaterDebris.transform.position = setCamera.transform.position;
			       	underwaterDebris.transform.rotation = setCamera.transform.rotation;
			       	underwaterDebris.transform.Translate(Vector3.forward * 40.0);
					underwaterDebrisRendererComponent.enabled=true;
					underwaterDebris.enableEmission=true;
					underwaterDebris.Play();
				}
			
				//get attributes from surface
				underwaterColor = suimonoObject.underwaterColor;
				refractionAmount = suimonoObject.underRefractionAmount;
		       	blurAmount = suimonoObject.underBlurAmount;
		       	underFogSpread = suimonoObject.underwaterFogSpread;
		       	underFogDist = suimonoObject.underwaterFogDist;
		       	
		       	underLightAmt = suimonoObject.reflectDistUnderAmt;
		       	refractAmt = suimonoObject.underRefractionAmount;
		       	refractSpd = suimonoObject.underRefractionSpeed*10;
		       	refractScl = suimonoObject.underRefractionScale;

	       	
		       	//set attributes to shader
		       	var useRefract : float = 1.0;
		       	if (!enableRefraction) useRefract = 0.0;
		       	underwaterRefractRendererComponent.sharedMaterial.SetFloat("_UnderReflDist",underLightAmt);
		       	//underwaterRefractRendererComponent.sharedMaterial.SetInt("_blurSamples",blurSamples);
		       	underwaterRefractRendererComponent.sharedMaterial.SetFloat("_blurSamples",blurSamples);
		       	underwaterRefractRendererComponent.sharedMaterial.SetFloat("_RefrStrength",refractAmt*useRefract);
		       	underwaterRefractRendererComponent.sharedMaterial.SetFloat("_RefrSpeed",refractSpd*useRefract);
		       	underwaterRefractRendererComponent.sharedMaterial.SetFloat("_AnimSpeed",refractSpd);
		       	underwaterRefractRendererComponent.sharedMaterial.SetFloat("_MasterScale",refractScl);
		       	
		       	underwaterRefractRendererComponent.sharedMaterial.SetFloat("_underFogStart",underFogDist);
		       	underwaterRefractRendererComponent.sharedMaterial.SetFloat("_underFogStretch",underFogSpread);
		       	underwaterRefractRendererComponent.sharedMaterial.SetFloat("_BlurSpread",blurAmount*useRefract);
				underwaterRefractRendererComponent.sharedMaterial.SetColor("_DepthColorB",underwaterColor);
				//underwaterRefractRendererComponent.sharedMaterial.SetFloat("_DepthAmt",0.001+(hitAmt*0.2));
				underwaterRefractRendererComponent.sharedMaterial.SetFloat("_DepthAmt",0.001);
				underwaterRefractRendererComponent.sharedMaterial.SetFloat("_Strength",refractionAmount);
				underwaterRefractPlane.transform.parent = setCamera.transform;
				//underwaterRefractPlane.transform.localPosition = Vector3(0.0,0.0,(setCamera.GetComponent(Camera).nearClipPlane+0.02));
				underwaterRefractPlane.transform.localEulerAngles = Vector3(270.0,0.0,0.0);
			    underwaterRefractRendererComponent.enabled = true;
	  
	       	} else {
	       		underwaterRefractRendererComponent.enabled = false;
	       	}
	       	
	       	
	       	//hide water transition
	       	waterTransitionPlane.transform.parent = this.transform;
	     	waterTransitionParticleRenderComponent.enabled = false;
	     	waterTransitionParticleComponent.Clear();
	     	
	     	waterTransitionPlane2.transform.parent = this.transform;
			waterTransition2ParticleRenderComponent.enabled = false;
	        waterTransition2ParticleComponent.Clear();

	       	//if (targetSurface){
	       		//if (targetSurface.GetComponent(Renderer).sharedMaterial.shader != shaderUnderwater){
				//	targetSurface.GetComponent(Renderer).sharedMaterial.shader = shaderUnderwater;
				//}
			//}

		
	    } else {

	        //reset underwater debris
	        underwaterDebris.transform.parent = this.transform;
	       	underwaterDebrisRendererComponent.enabled=false;

	       	//turn off water refraction plane
	       	underwaterRefractPlane.transform.parent = this.transform;
	     	underwaterRefractRendererComponent.enabled = false;
	

	     	//show water transition
	     	if (enableTransition){
	     	if (doWaterTransition && setCamera != null){
	     		
	     		doTransitionTimer = 0.0;
	     		//sets and emits random water "screen" droplets

	     		waterTransitionRendererComponent.sharedMaterial.shader = shaderDropletsFX;
	     		waterTransitionParticleRenderComponent.enabled = true;
	     		waterTransitionPlane.transform.parent = setCamera.transform;
	     		//cameraPlane_offset = 3.7;
	       		waterTransitionPlane.transform.localPosition = Vector3(0.0,0.0,setCamera.GetComponent(Camera).nearClipPlane+cameraPlane_offset+0.02);
	       		waterTransitionPlane.transform.localEulerAngles = Vector3(270.0,262.9,0.0);
	      		waterTransitionParticleComponent.Play();
	      		waterTransitionParticleComponent.Emit(Random.Range(60,120));
	      		
	      		//sets and plays water transition "screen" effect

	      		waterTransition2RendererComponent.sharedMaterial.shader = shaderDropletsFX;
	      		waterTransition2ParticleRenderComponent.enabled = true;
	     		waterTransitionPlane2.transform.parent = setCamera.transform;
	       		waterTransitionPlane2.transform.localPosition = Vector3(0.0,0.0,setCamera.GetComponent(Camera).nearClipPlane+cameraPlane_offset+0.01);
	       		waterTransitionPlane2.transform.localEulerAngles = Vector3(270.0,262.9,0.0);
	      		waterTransition2ParticleComponent.Emit(1);
	      		
    		
	      		
	       		doWaterTransition = false;
	       		
	       		//reset component positions
	       		yield WaitForSeconds(12);
		       		if (doTransitionTimer >= 12.0){
			       		waterTransitionPlane.transform.parent = this.transform;
			       		waterTransitionPlane2.transform.parent = this.transform;
		       		}
		       		
		       		
	     	} else {
	     		

	     		waterTransitionRendererComponent.sharedMaterial.shader = shaderDropletsFX;
	     		waterTransitionParticleRenderComponent.enabled = true;
	     		waterTransitionParticleComponent.Stop();
	     		
  
	     		waterTransition2RendererComponent.sharedMaterial.shader = shaderDropletsFX;
	     		waterTransition2ParticleRenderComponent.enabled = true;
	     		
		     	//turn off water transitions plane
		       	//waterTransitionPlane.transform.parent = this.transform;
		     	//waterTransitionRendererComponent.enabled = false;
		     	//waterTransitionPlane2.transform.parent = this.transform;
		     	//waterTransition2RendererComponent.enabled = false;
	     		
	     	}
	       	}

	     
	    }
    }
    
    
    if (!enableUnderwaterFX){
    	//reset underwater FX and Shaders
    	underwaterRefractPlane.transform.parent = this.transform;
   		underwaterRefractRendererComponent.enabled = false;
		underwaterDebrisRendererComponent.enabled=false;

    }

}







function OnApplicationQuit(){

    if (underwaterRefractPlane != null) underwaterRefractPlane.transform.parent = this.transform;
	if (waterTransitionPlane != null) waterTransitionPlane.transform.parent = this.transform;
	if (waterTransitionPlane2 != null) waterTransitionPlane2.transform.parent = this.transform;

}






function SuimonoConvertAngleToDegrees(convertAngle : float) : Vector2{

	var flow_dir : Vector2 = Vector3(0,0);
	var tempAngle : Vector3 = Vector3(0,0,0);
	if (convertAngle <= 180.0){
		tempAngle = Vector3.Slerp(Vector3.forward,-Vector3.forward,(convertAngle)/180.0);
		flow_dir = Vector2(tempAngle.x,tempAngle.z);
	}
	if (convertAngle > 180.0){
		tempAngle = Vector3.Slerp(-Vector3.forward,Vector3.forward,(convertAngle-180.0)/180.0);
		flow_dir = Vector2(-tempAngle.x,tempAngle.z);
	}
	
	return flow_dir;
}






function SuimonoGetHeight(testObject : Vector3, returnMode : String) : float {

	
	var getmap : Color = Color(0.0,0.0,0.0,0.0);
	var getheight : float = -1.0;
	var getheightW : float = -1.0;
	var getheightD1 : float = -1.0;
	var getheightD2 : float = -1.0;
	var getheight1 : float = 0.0;
	var getheight2 : float = 0.0;
	var getheight3 : float = 0.0;
	var isOverWater : boolean = false;
	var surfaceLevel : float = -1.0;
	var groundLevel : float = 0.0;
	//var suimonoObject : SuimonoObject;
	var layer : int = 4;
	var layermask : int = 1 << layer;

	
	//var hit : RaycastHit;
	var testpos : Vector3 = Vector3(testObject.x,testObject.y+5000,testObject.z);
	//if (Physics.Raycast (testpos, -Vector3.up, hit,10000,layermask)) {
	
	
	var hits : RaycastHit[];
	//var ray : Ray = Camera.main.ViewportPointToRay (Vector3(0.5,0.5,0));
	//hits = Physics.RaycastAll(ray,500.0);
	hits = (Physics.RaycastAll(testpos, -Vector3.up,10000));
	for (var i = 0;i < hits.Length; i++) {
	//if (i == 0){
		var hit : RaycastHit = hits[i];

		if (hit.transform.gameObject.layer==4){ //hits object on water layer
			
		
			if (hit.transform.parent.gameObject.GetComponent(SuimonoObject) != null && hit.collider != null){
				targetSurface = hit.transform.gameObject;
				suimonoObject = hit.transform.parent.gameObject.GetComponent(SuimonoObject);	
				isOverWater = true;
				surfaceLevel = hit.point.y;
				
				
					// default height to hit.point on flat water planes
			   	if (suimonoObject != null){
				if (suimonoObject.typeIndex != 2 && unityVersionIndex != 4 && unityVersionIndex != 5){

			   	
			   	
				if (Application.isPlaying){
				if (hit.collider.GetComponent(Renderer).sharedMaterial.GetTexture("_Surface1") != null){
				
					var pixelUV : Vector2 = hit.textureCoord;
					var pixelUV2 : Vector2 = hit.textureCoord;
					var pixelUV3 : Vector2 = hit.textureCoord;
					var checktex = hit.collider.GetComponent(Renderer).sharedMaterial.GetTexture("_Surface1") as Texture2D;
					var flowtex = hit.collider.GetComponent(Renderer).sharedMaterial.GetTexture("_FlowMap") as Texture2D;
					var wavetex = hit.collider.GetComponent(Renderer).sharedMaterial.GetTexture("_WaveTex") as Texture2D;
					
					//if (checktex != null) pixelUV.x *= checktex.width;
		    		//if (checktex != null) pixelUV.y *= checktex.height;

					// detail waves calculation
					//pixelUV = hit.textureCoord;
					//var offsD : Vector2 = hit.collider.GetComponent(Renderer).sharedMaterial.GetTextureOffset("_WaveLargeTex");
					//var tscaleD : Vector2 = hit.collider.GetComponent(Renderer).sharedMaterial.GetTextureScale("_WaveLargeTex");
		   			//pixelUV.x = (pixelUV.x * tscaleD.x + offsD.x);
		   			//pixelUV.y = (pixelUV.y * tscaleD.y + offsD.y);
		   			

		   			//if (checktex != null) pixelUV.x *= checktex.width;
		    		//if (checktex != null) pixelUV.y *= checktex.height;
		    		//if (checktex != null) getheight1 = checktex.GetPixel(pixelUV.x, pixelUV.y).r;
					//if (QualitySettings.activeColorSpace == ColorSpace.Linear) getheight1 = Mathf.GammaToLinearSpace(getheight1);
		    		
		    		// CALCULATE DEEP WAVES
		    		var twfMult : float = 0.15;
					var waveSpd : Vector2 = Vector2(suimonoObject._suimono_uvx*0.4,suimonoObject._suimono_uvy*0.4); 
					var tscaleN : Vector2 = hit.collider.GetComponent(Renderer).sharedMaterial.GetTextureScale("_Surface1");
					
		   			pixelUV.x = (hit.textureCoord.x * tscaleN.x * twfMult + waveSpd.x);
		   			pixelUV.y = (hit.textureCoord.y * tscaleN.y * twfMult + waveSpd.y);
		   			if (checktex != null) pixelUV.x *= checktex.width;
		    		if (checktex != null) pixelUV.y *= checktex.height;
		    		if (checktex != null) getheight1 = checktex.GetPixel(pixelUV.x, pixelUV.y).r;
		  
		  			pixelUV2.x = (hit.textureCoord.x * tscaleN.x * twfMult - waveSpd.x - 0.5);
		   			pixelUV2.y = (hit.textureCoord.y * tscaleN.y * twfMult - waveSpd.y - 0.5);
				   	if (checktex != null) pixelUV2.x *= checktex.width;
		    		if (checktex != null) pixelUV2.y *= checktex.height;
		    		if (checktex != null) getheight2 = checktex.GetPixel(pixelUV2.x, pixelUV2.y).r;   			
		   			
		   			pixelUV3.x = (hit.textureCoord.x * tscaleN.x * twfMult - waveSpd.x - 0.25);
		   			pixelUV3.y = (hit.textureCoord.y * tscaleN.y * twfMult);
					if (checktex != null) pixelUV3.x *= checktex.width;
		    		if (checktex != null) pixelUV3.y *= checktex.height;
		    		if (checktex != null) getheight3 = checktex.GetPixel(pixelUV3.x, pixelUV3.y).r;   	   			

		    		if (QualitySettings.activeColorSpace == ColorSpace.Linear){
		    			getheight1 = Mathf.GammaToLinearSpace(getheight1);
						getheight2 = Mathf.GammaToLinearSpace(getheight2);
						getheight3 = Mathf.GammaToLinearSpace(getheight3);
					} else {
		    			getheight1 *= (0.4545);
						getheight2 *= (0.4545);
						getheight3 *= (0.4545);
					}
					
					getheightW = Mathf.Lerp(0.0,suimonoObject.useDpWvHt,Mathf.Clamp01(getheight1+getheight2+getheight3));
		   			
		   			
		   			
		   			// CALCULATE DETAIL WAVES
		    		twfMult = 1.0;// * suimonoObject.setDtScale;
					waveSpd = Vector2(suimonoObject._suimono_uvx,suimonoObject._suimono_uvy); 
					tscaleN = hit.collider.GetComponent(Renderer).sharedMaterial.GetTextureScale("_WaveLargeTex");
					
		   			pixelUV.x = (hit.textureCoord.x * tscaleN.x * twfMult + waveSpd.x);
		   			pixelUV.y = (hit.textureCoord.y * tscaleN.y * twfMult + waveSpd.y);
		   			if (checktex != null) pixelUV.x *= checktex.width;
		    		if (checktex != null) pixelUV.y *= checktex.height;
		    		if (checktex != null) getheight1 = checktex.GetPixel(pixelUV.x, pixelUV.y).r;
		  
		  			pixelUV2.x = (hit.textureCoord.x * tscaleN.x * twfMult - waveSpd.x - 0.5);
		   			pixelUV2.y = (hit.textureCoord.y * tscaleN.y * twfMult - waveSpd.y - 0.5);
				   	if (checktex != null) pixelUV2.x *= checktex.width;
		    		if (checktex != null) pixelUV2.y *= checktex.height;
		    		if (checktex != null) getheight2 = checktex.GetPixel(pixelUV2.x, pixelUV2.y).r;   			
		   			
		   			pixelUV3.x = (hit.textureCoord.x * tscaleN.x * twfMult - waveSpd.x - 0.25);
		   			pixelUV3.y = (hit.textureCoord.y * tscaleN.y * twfMult);
					if (checktex != null) pixelUV3.x *= checktex.width;
		    		if (checktex != null) pixelUV3.y *= checktex.height;
		    		if (checktex != null) getheight3 = checktex.GetPixel(pixelUV3.x, pixelUV3.y).r;   	   			

		    		if (QualitySettings.activeColorSpace == ColorSpace.Linear){
		    			getheight1 = Mathf.GammaToLinearSpace(getheight1);
						getheight2 = Mathf.GammaToLinearSpace(getheight2);
						getheight3 = Mathf.GammaToLinearSpace(getheight3);
					} else {
						getheight1 *= (0.4545);
						getheight2 *= (0.4545);
						getheight3 *= (0.4545);
					}
					
					getheightD1 = Mathf.Lerp(0.0,suimonoObject.useDtHt,Mathf.Clamp01(getheight1+getheight2+getheight3));
		   			
		   			
		   			
		   			
		   			
		   			
		   			
		   			
		   			
		   			
					//shoreline calculation - Normalize
		    		twfMult = 1.0;// * suimonoObject.setDtScale;
					waveSpd = Vector2(suimonoObject._suimono_uvx,suimonoObject._suimono_uvy); 
					tscaleN = hit.collider.GetComponent(Renderer).sharedMaterial.GetTextureScale("_FlowMap");
					
		   			pixelUV.x = (hit.textureCoord.x * tscaleN.x * twfMult);
		   			pixelUV.y = (hit.textureCoord.y * tscaleN.y * twfMult);
		   			if (flowtex != null) pixelUV.x *= flowtex.width;
		    		if (flowtex != null) pixelUV.y *= flowtex.height;
		    		if (flowtex != null) getmap.r = flowtex.GetPixel(pixelUV.x, pixelUV.y).r;
		    		
		    		if (QualitySettings.activeColorSpace == ColorSpace.Linear){
		    			getmap.r = Mathf.GammaToLinearSpace(getmap.r);
				   		getmap.g = Mathf.GammaToLinearSpace(getmap.g);
		    		} else {
		    			getmap.r *= (0.4545);
						getmap.g *= (0.4545);
					}
		    		
		    		
		    		
		    		//shoreline calculation - Shore wave Height
			    	//twfMult = 1.0;// * suimonoObject.setDtScale;
					//waveSpd = Vector2(suimonoObject._suimono_uvx,suimonoObject._suimono_uvy); 
					//tscaleN = hit.collider.GetComponent(Renderer).sharedMaterial.GetTextureScale("_FlowMap");
					
					//var getflowmap : Color;
					var getwavetex : Color;
		   			//pixelUV.x = (hit.textureCoord.x * tscaleN.x * twfMult);
		   			//pixelUV.y = (hit.textureCoord.y * tscaleN.y * twfMult);
		   			//if (flowtex != null) pixelUV.x *= flowtex.width;
		    		//if (flowtex != null) pixelUV.y *= flowtex.height;
		    		//if (flowtex != null) getflowmap = flowtex.GetPixel(pixelUV.x, pixelUV.y);
		    		
				 	//var flowmap : Vector2 = Vector2(Mathf.Clamp01(getflowmap.r + getflowmap.g),getflowmap.b);
				 	//flowmap.x *= 2.0 - 1.0;
				 	//flowmap.y *= 2.0 - 1.0;
					//flowmap.x = Mathf.Lerp(0.0,flowmap.x,suimonoObject.setFlowShoreScale);
					//flowmap.y = Mathf.Lerp(0.0,flowmap.y,suimonoObject.setFlowShoreScale);

			    	twfMult = suimonoObject.setFlowShoreScale;
					waveSpd = Vector2(suimonoObject._suimono_uvx,suimonoObject._suimono_uvy); 
					tscaleN = hit.collider.GetComponent(Renderer).sharedMaterial.GetTextureScale("_WaveMap");
		   			pixelUV.x = (hit.textureCoord.x * tscaleN.x * twfMult)+suimonoObject.setflowOffX;//+flowmap.x;
		   			pixelUV.y = (hit.textureCoord.y * tscaleN.y * twfMult)+suimonoObject.setflowOffY;//+flowmap.y;
		   			if (wavetex != null) pixelUV.x *= wavetex.width;
		    		if (wavetex != null) pixelUV.y *= wavetex.height;

					if (wavetex != null) getwavetex = wavetex.GetPixel(pixelUV.x,pixelUV.y);
					
		    		if (QualitySettings.activeColorSpace == ColorSpace.Linear){
			    		getwavetex.r = Mathf.GammaToLinearSpace(getwavetex.r);
			    		getwavetex.g = Mathf.GammaToLinearSpace(getwavetex.g);
			    		getwavetex.b = Mathf.GammaToLinearSpace(getwavetex.b);
		    		} else {
						getwavetex.r *= (0.4545);
						getwavetex.g *= (0.4545);
						getwavetex.b *= (0.4545);
					}

	//wrap normal to shore calculations
	//float4 getflowmap = tex2D(_FlowMap, IN.uv_FlowMap);
 	//float2 flowmap = float2(saturate(getflowmap.r + getflowmap.g),getflowmap.b) * 2.0 - 1.0;
	//flowmap.x = lerp(0.0,flowmap.x,_FlowShoreScale);
	//flowmap.y = lerp(0.0,flowmap.y,_FlowShoreScale);
	//half4 waveTex = tex2D(_WaveTex, float2((IN.uv_FlowMap.x*shoreWaveScale)+flowOffX+flowmap.x,(IN.uv_FlowMap.y*shoreWaveScale)+flowOffY+flowmap.y));
	//o.Normal = lerp(o.Normal,half3(0,0,1),waveTex.g * _WaveShoreHeight * flow.g);
	




		    		//####   final Height calculation  #####
		    		getheight = getheightW + getheightD1;
		    		
		    	

		    		
		   			//getheight = (getheight1 * suimonoObject.detailHeight);
		   			//getheight += (getheight2 * suimonoObject.waveHeight);
		   				//normalize shore
		   				getheight = Mathf.Lerp(getheight,0.0, getmap.r * suimonoObject.normalShore);
		   				
		   				//add shore waves - turned off for now
		   				getheight += Mathf.Lerp(0.0,1.0, getwavetex.g * suimonoObject.usewaveShoreHt * getmap.r);
		   				//suimonoObject.usewaveShoreHt
		   									//o.Normal = lerp(o.Normal,half3(0,0,1),getwavetex.g * _WaveShoreHeight * flow.g);
		   									
		   				//getheight += Mathf.Lerp(0.0,suimonoObject.usewaveShoreHt,waveTex.r)*getmap.r;
		   		}

		   		
	    		}
	    		
	    		break;
	    		
	    		} else {

				   	getheight = 0.0;//surfaceLevel;
				}
	    		}
			}
		}

	//}
	}


	

	var returnValue : float = 0.0;
	
	//if (returnMode == "depth") returnValue = (surfaceLevel+getheight)-groundLevel;
	if (returnMode == "height") returnValue = getheight;
	if (returnMode == "surfaceLevel") returnValue = surfaceLevel+getheight;
	if (returnMode == "baseLevel") returnValue = surfaceLevel;
	if (returnMode == "object depth") returnValue = (surfaceLevel+getheight)-testObject.y;
	if (returnMode == "isOverWater" && isOverWater) returnValue = 1.0;
	if (returnMode == "isOverWater" && !isOverWater) returnValue = 0.0;
	
	if (returnMode == "isAtSurface"){
		if (((surfaceLevel+getheight)-testObject.y) < 0.25 && ((surfaceLevel+getheight)-testObject.y) > -0.25)
			returnValue = 1.0;
	}
	
	if (suimonoObject != null){
		if (returnMode == "direction") returnValue = suimonoObject.flow_dir_degrees;
		if (returnMode == "speed") returnValue = suimonoObject.setflowSpeed;
			
		if (returnMode == "wave height"){
			var h1 = (suimonoObject.detailHeight + suimonoObject.waveHeight);
		   	h1 = Mathf.Lerp(h1, 0.0, getmap.r * suimonoObject.normalShore);
			returnValue = getheight/h1;
		}
	}

	//set local variables
	if (returnMode == "store variables"){
		currentSurfaceLevel = surfaceLevel+getheight;
		currentObjectDepth = (surfaceLevel+getheight)-testObject.y;
	}
	

	return returnValue;

}




