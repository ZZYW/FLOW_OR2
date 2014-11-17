#pragma strict


var tempObject: GameObject;
var tempDeepBreath : float;

function Start () {
	tempObject = GameObject.Find("breathSensor");
}

function Update () {
	tempDeepBreath = tempObject.GetComponent(myReading).deepBreathCounter;
	print(tempDeepBreath + "from test.js script-----------");	
}