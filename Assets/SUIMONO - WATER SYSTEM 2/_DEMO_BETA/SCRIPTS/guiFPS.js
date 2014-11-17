#pragma strict


private var updateInterval = 0.3;
private var GuiMsg : String = "---";
private var accum : float = 0.0; // FPS accumulated over the interval
private var frames : float  = 0; // Frames drawn over the interval
private var timeleft : float; // Left time for current interval



function Start () {

}




function Update () {


// CALCULATE FPS
    timeleft -= Time.deltaTime;
    accum += Time.timeScale/Time.deltaTime;
    ++frames;
   
    // Interval ended - update GUI text and start new interval
    if( timeleft <= 0.0 )
    {
        // display two fractional digits (f2 format)
        GuiMsg = "FPS:"+(accum/frames).ToString("f0");
        timeleft = updateInterval;
        accum = 0.0;
        frames = 0;
    }



}



function OnGUI(){

	GUI.color = Color(1,0.2,0.0,1.0);
	GUI.Label (Rect (10, 10, 100, 20), GuiMsg);

}
