#pragma strict

var propObject : GameObject;
var engineObject : GameObject;
var propellerSpeed : float = 0.0;
var engineRotation : float = 0.5;

var audioEngineStart : AudioClip;
var audioEngineStop : AudioClip;
var audioEngineIdle : AudioClip;
var audioEngineRev : AudioClip;
var audioEngineRevHigh : AudioClip;
var audioEngineRevAbove : AudioClip;

var behaviorIsOn : boolean = false;
var behaviorIsInWater : boolean = false;
var behaviorIsRevving : boolean = false;
var behaviorIsRevvingHigh : boolean = false;

private var audioObjectA : AudioSource;
private var audioObjectB : AudioSource;
private var useClip : AudioClip;
private var currentClip : AudioClip;
private var engineRot : float = 90.0;
private var isOn : boolean = false;
private var onTime : float = 0.0;


function Awake () {
	
	audioObjectA = this.transform.Find("BoatAudioObjectA").GetComponent(AudioSource) as AudioSource;
	audioObjectB = this.transform.Find("BoatAudioObjectB").GetComponent(AudioSource) as AudioSource;
	
	engineObject = this.transform.Find("engine").gameObject;
	if (engineObject != null){
		propObject = engineObject.transform.Find("Propeller").gameObject;
	}
	
}



function Update () {
		
		//Handle Engine and Propeller
		if (engineObject != null){
			engineRotation = Mathf.Clamp(engineRotation,0.0,1.0);
			engineRot = Mathf.Lerp(30.0,150.0,engineRotation);
			engineObject.transform.localEulerAngles.y = engineRot;
		}
		
		if (propObject != null){
			propObject.transform.localEulerAngles.z += Time.deltaTime * propellerSpeed;
		}
		
		
		//Handle Audio
		if (audioObjectA != null && audioObjectB != null){
		
			//setup audio systems
			var fadeSpeed = 1.0;
			//audioObjectA.loop = true;
			//audioObjectB.loop = true;
			audioObjectA.minDistance = 10.0;
			audioObjectA.maxDistance = 30.0;
			audioObjectB.minDistance = 10.0;
			audioObjectB.maxDistance = 30.0;
			
			
			//HANDLE AUDIO CLIPS
			if (behaviorIsOn){
				
				//Select Clips based on behavior
				audioObjectA.loop = true;
				audioObjectB.loop = true;
				
				if (isOn){
					
					useClip = audioEngineIdle;
					
					if (behaviorIsRevving){
						
						fadeSpeed = 10.0;
						if (currentClip == audioEngineRevAbove) fadeSpeed = 10.0;
						if (currentClip == audioEngineRevHigh) fadeSpeed = 10.0;
						useClip = audioEngineRev;
						
						if (behaviorIsRevvingHigh){
							fadeSpeed = 10.0;
							useClip = audioEngineRevHigh;
						}
						
						if (!behaviorIsInWater){
							fadeSpeed = 10.0;
							useClip = audioEngineRevAbove;
						}
					
					}
				}
				if (!isOn){
				
					//handle turn on sequence
					onTime += Time.deltaTime;
					if (onTime >= 1.0) isOn = true;
					
					fadeSpeed = 10.0;
					useClip = audioEngineStart;
				}
				
			} else {
			
				//handle turn off sequence
				audioObjectA.loop = false;
				audioObjectB.loop = false;
				if (isOn){
					
					onTime -= Time.deltaTime;
					if (onTime <= -0.5) isOn = false;
					
					fadeSpeed = 10.0;
					useClip = audioEngineStop;
				} else {
					onTime = 0.0;
					isOn = false;
					if (audioObjectA.isPlaying) audioObjectA.Stop();
					if (audioObjectB.isPlaying) audioObjectB.Stop();
				}
				
			

			}

			//switch clips clip
			if (currentClip != useClip){
				audioObjectA.Stop();
				audioObjectA.clip = useClip;
				audioObjectA.volume = 0.0;
				audioObjectB.Stop();
				audioObjectB.clip = currentClip;
				audioObjectB.volume = 1.0;
				currentClip = useClip;
			}
			
			//fade clips
			audioObjectA.volume = Mathf.Lerp(audioObjectA.volume,1.0,Time.deltaTime * fadeSpeed);
			audioObjectB.volume = Mathf.Lerp(audioObjectB.volume,0.0,Time.deltaTime * fadeSpeed);
			
			//play clips
			if (behaviorIsOn || isOn){
				if (!audioObjectA.isPlaying) audioObjectA.Play();
				if (!audioObjectB.isPlaying) audioObjectB.Play();
			}
		}
		
	
}