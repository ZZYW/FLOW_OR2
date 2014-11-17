#pragma strict

var isUnderwater : boolean = false;
var ambientWorldClip : AudioClip;
var ambientUnderwaterClip : AudioClip;

private var currentClip : AudioClip;
private var useClip : AudioClip;
private var audioObject : AudioSource;
private var moduleObject : SuimonoModule;


function Start () {

	audioObject = this.transform.GetComponent(AudioSource) as AudioSource;
	moduleObject = GameObject.Find("SUIMONO_Module").GetComponent(SuimonoModule) as SuimonoModule;
	
}


function Update () {

	isUnderwater = false;
	if (moduleObject.SuimonoGetHeight(this.transform.position,"object depth") > 0.0) isUnderwater = true;

	//Handle Audio
	if (audioObject != null){
	
		//setup audio systems
		audioObject.loop = true;
		audioObject.volume = 1.0;
		audioObject.minDistance = 5.0;
		audioObject.maxDistance = 10.0;

		
		//HANDLE AUDIO CLIPS
		if (isUnderwater){
			useClip = ambientUnderwaterClip;
		} else {
			useClip = ambientWorldClip;
		}

		//switch clips clip
		if (currentClip != useClip){
			audioObject.Stop();
			audioObject.clip = useClip;
			audioObject.volume = 0.0;
			currentClip = useClip;
		}
		
		//play clips
		if (!audioObject.isPlaying) audioObject.Play();

	}
		
		
		
		
		
		
	

}