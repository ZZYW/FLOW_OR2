Shader "Suimono2/water_basic2_dx11" {


Properties {
	_Tess ("Tessellation", Float) = 4.0
    _minDist ("TessMin", Range(-180.0, 0.0)) = 10.0
    _maxDist ("TessMax", Range(20.0, 500.0)) = 25.0
    _Displacement ("Displacement", Range(0, 8.0)) = 0.3
    _MaskAmt ("Mask Strength", Range(1, 8.0)) = 1.0

    _WaveLargeTex ("Wave Large", 2D) = "white" {}
   	_WaveHeight ("Wave Height", Range(0, 20.0)) = 0.0
   	_DetailHeight ("Detail Height", Range(0, 20.0)) = 0.0
   	_WaveShoreHeight ("Wave Shore Height", Range(0, 8.0)) = 0.0
   	_WaveScale ("Wave Scale", Range(0, 1.0)) = 0.25
	
	_CenterHeight ("Center Height", Float) = 0.0
	_MaxVariance ("Maximum Variance", Float) = 3.0

	_HighColor ("High Color", Color) = (1.0, 0.0, 0.0, 1.0)
	_LowColor ("Low Color", Color) = (0.0, 1.0, 0.0, 0.1)
		
	_Surface1 ("Surface Distortion 1", 2D) = "white" {}
	_Surface2 ("Surface Distortion 2", 2D) = "white" {}
	_WaveRamp ("Wave Ramp", 2D) = "white" {}
	
	_RefrStrength ("Refraction Strength (0.0 - 25.0)", Float) = 25.0
    _RefrSpeed ("Refraction Speed (0.0 - 0.5)", Float) = 0.5
    _RefrScale ("Refraction Scale", Float) = 0.5
	
	_SpecScatterWidth ("Specular Width", Range(1.0,10.0)) = 2.0
	_SpecScatterAmt ("Specular Scatter", Range(0.0,0.05)) = 0.02
	_SpecColorH ("Hot Specular Color", Color) = (0.5, 0.5, 0.5, 1)
	_SpecColorL ("Reflect Specular Color", Color) = (0.5, 0.5, 0.5, 1)
	
	_DynReflColor ("Reflection Dynamic", Color) = (1.0, 1.0, 1.0, 0.5)
	_ReflDist ("Reflection Distance", Float) = 1000.0
	_ReflBlend ("Reflection Blend", Range(0.002,0.1)) = 0.01
	_ReflBlur ("Reflection Blur", Range (0.0, 0.125)) = 0.01
	_ReflectionTex ("Reflection", 2D) = "white" {}

	_DepthAmt ("Depth Amount", Float) = 0.1
	
	_DepthColor ("Depth Over Tint", Color) = (0.25,0.25,0.5,1.0)
	_DepthColorR ("Depth Color 1(r)", Color) = (0.25,0.25,0.5,1.0)
	_DepthColorG ("Depth Color 2(g)", Color) = (0.25,0.25,0.5,1.0)
	_DepthColorB ("Depth Color 3(b)", Color) = (0.25,0.25,0.5,1.0)
	_DepthRamp ("Depth Color Ramp", 2D) = "white" {}
	
	_BlurSpread ("Blur Spread", Range (0.0, 0.125)) = 0.01
	_BlurRamp ("Blur Ramp", 2D) = "white" {}
	
	_FoamHeight ("Foam Height", Float) = 5.0
	_HeightFoamAmount ("Height Foam Amount", Range (0.0, 1.0)) = 1.0
	_HeightFoamSpread ("Height Foam Spread", Float) = 2.0
	
	_FoamSpread ("Foam Spread", Range (0.0, 1.0)) = 0.5
	_FoamColor ("Foam Color", Color) = (1,1,1,1)
	_FoamRamp ("Foam Ramp", 2D) = "white" {}
	_FoamTex ("Foam Texture (RGB)", 2D) = "white" {}

	_EdgeBlend ("Edge Spread", Range (0.04,5.0)) = 10.0
	_EdgeSpread ("Edge Spread", Range (0.04,5.0)) = 10.0
	_EdgeColor ("Edge Color", Color) = (1,1,1,1)
	
	_BumpStrength ("Normal Strength", Float) = 0.9
	_ReflectStrength ("Reflection Strength", Float) = 1.0
		
	_CubeTex ("Cubemap reflections", CUBE) = "white" {}
	_CubeBDRF ("Cubemap BDRF", CUBE) = "white" {}
    
	_MasterScale ("Master Scale", Float) = 1.0
	_UnderReflDist ("Under Reflection", Float) = 1.0
	_UnderColor ("Underwater Color", Color) = (0.25,0.25,0.5,1.0)
	
	_WaveTex ("_WaveTex", 2D) = "white" {}
	_FlowMap ("_FlowMap", 2D) = "white" {}
	_FlowScale ("Flowmap Scale", Range(0.1,10.0)) = 0.0

	_TideColor ("Tide Color", Color) = (0.0,0.0,0.2,1.0)
	_TideAmount ("Tide Amount", Range(0.0,1.0)) = 1.0
	_TideSpread ("Tide Amount", Range(0.02,1.0)) = 0.4

	_WaveMap ("_WaveMap", 2D) = "white" {}
	
	_Ramp2D ("_BRDF Ramp", 2D) = "white" {}
	_RimPower ("RimPower", Range(0.0,10.0)) = 1.0

	_castshadowEnabled ("shadow Enabled", Float) = 1.0
	_castshadowStrength ("shadow Strength", Float) = 1.0
	_castshadowFade ("shadow Fade", Float) = 1.0
	_castshadowColor ("Shadow Color", Color) = (0,0,0,1)

	_suimono_uvx ("uvx", Float) = 1.0
	_suimono_uvy ("uvy", Float) = 1.0

	_suimono_DeepWaveHeight ("Deep Wave Height", Float) = 1.0
	_suimono_DetailHeight ("Detail Wave Height", Float) = 1.0
	_suimono_detScale ("Detail Scale", Float) = 1.0

	_useDynamicReflections ("Use DynamicReflections", Float) = 1.0
		
	
}



Subshader 
{ 










// -------------------------------------
//   GET SCREEN INFO 
// -------------------------------------
GrabPass {
	Name "BlurGrab"
}




// ---------------------------------
//   WATER DEPTH RENDERING
// ---------------------------------
Tags {"RenderType"="Opaque" "Queue"= "Transparent-101"} //overlay+1
Blend SrcAlpha OneMinusSrcAlpha
Cull Back
ZWrite On

 


CGPROGRAM


struct appdata {
	float4 vertex : POSITION;
	float4 tangent : TANGENT;
	float3 normal : NORMAL;
	float2 texcoord : TEXCOORD0;
};


#pragma target 5.0
#include "UnityCG.cginc"
#include "SuimonoFunctionsDX11.cginc"
#pragma surface surf SuimonoDepth addshadow vertex:vertexSuimonoDisplaceDX11 tessellate:tessDistance nolightmap noambient
#include "Tessellation.cginc"



//float _CenterHeight;
//float _MaxVariance;
float4 _HighColor;
float4 _LowColor;
float4 _DepthColor;
float4 _DepthColorR;
float4 _DepthColorG;
float4 _DepthColorB;
float4 _DynReflColor;
float4 _FoamColor;
float _SpecScatterWidth;
float _SpecScatterAmt;
float _RimPower;
sampler2D _Ramp2D;
sampler2D _ReflectionTex;
float _OverallTrans;
float _OverallBright;

float _ReflectStrength;
float _ReflDist;
float _ReflBlend;

float4 origBGColor;
float4 depthColor;
float4 reflectColor;

float4 reflectCubeColor;
float _RefrStrength;
float _RefrShift;
float4 refractColor;
float edgeFactor;
float foamFactor;
float _FoamSpread;
float4 _SpecColorH;
float4 _SpecColorL;
float _blurSamples;
float _BlurSpread;
float _HeightFoamAmount;
float _HeightFoamSpread;
float _FoamHeight;
float _ShadowAmt;
float highcolorFac;
float backcolorFac;

float _useDynamicReflections;

float4 reflectCUBE;
float4 reflectBDRF;

//tenkoku variables
float4 _Tenkoku_SkyColor;
float4 _Tenkoku_HorizonColor;
float4 _Tenkoku_GlowColor;
float _Tenkoku_Ambient;

//shadow variables
float _castshadowEnabled;
float _castshadowStrength;
float _castshadowFade;
float4 _castshadowColor;

float mask;
float mask1;
float mask2;
float mask3;
float maskcastshadow;

inline fixed4 LightingSuimonoDepth (SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten)
{

	//calculate final color
	fixed4 c;
	fixed NdotView = dot(s.Normal, viewDir);
	fixed NdotLight = dot(s.Normal, lightDir);
	half lightFac = NdotLight + (lerp(0.3,1.0,NdotView)*_LightColor0.a);

	//half dielectricRamp = saturate(lerp(0.75,-1.0,dot(s.Normal,viewDir)));
	half dielectricRamp = saturate(lerp(-1,2,lightFac)) * saturate(lerp(0.75,-1.0,dot(s.Normal,viewDir)));
	//half backscatterRamp = saturate(lerp(0.75,-0.5,dot(s.Normal,viewDir)));
	
	half3 distRamp =  lerp(1.0,0.0,mask*_DynReflColor.a);
	
	NdotLight *= (1.0-dielectricRamp*NdotLight);
	NdotLight = saturate(lerp(1.0-_ShadowAmt,1.0,NdotLight));
	
	//calculate shadow
	half3 shadowCol = saturate(lerp(1.0-_castshadowStrength-(NdotLight*0.1),1.0,(1.0-origBGColor.a)+(maskcastshadow)));

	//add cast shadow TURN OFF TEMP
	//depthColor.rgb = lerp(lerp(depthColor.rgb*_castshadowColor.rgb*_LightColor0.rgb,_castshadowColor.rgb,_castshadowColor.a),depthColor.rgb,shadowCol.r);
	
	//compute refraction color
	fixed3 refractCol = refractColor;
	//refractCol = lerp(refractCol.rgb,depthColor.rgb*_LightColor0.rgb,depthColor.a); //blend depth color
	refractCol = lerp(refractCol.rgb,depthColor.rgb*_LightColor0.a,depthColor.a); //blend depth color
	refractCol.rgb = lerp(refractCol.rgb,refractCol.rgb*_DepthColor.rgb*2.0,_DepthColor.a); //blend background color
	refractCol.rgb = lerp(refractCol.rgb,_LowColor.rgb*_LightColor0.rgb,_LowColor.a); //overlay color
	refractCol.rgb = lerp(refractCol.rgb,_HighColor.rgb*_LightColor0.rgb,highcolorFac*_HighColor.a); //height color



	half backLightFac = saturate(lerp(-2.0,1.0,saturate(lightDir.r-lightDir.b-lightDir.g)));
	backLightFac *= saturate(lerp(0.5,-1,dot(lightDir,viewDir)));
	backLightFac *= saturate(lerp(0,1,dot(s.Normal,viewDir))) * _LightColor0.a;
	refractCol.rgb = lerp(refractCol.rgb,_SpecColorL.rgb,backcolorFac*_SpecColorL.a * backLightFac); //back blend color
	
	//final reflection RGB
	c.rgb = fixed3(0,0,0); //default color

	//blend refraction overlay
	c.rgb = lerp(refractCol*0.5,refractCol,NdotLight);
	c.rgb = lerp(c.rgb,_LightColor0.rgb,NdotLight*dielectricRamp*0.25);

	c.rgb *= _LightColor0.rgb;

	//mix edge blend
	c.rgb = lerp(c.rgb,refractCol.rgb * 1.0,edgeFactor);// * _LightColor0.rgb;
	
	//linear conversion
	//half linearFac = lerp(1.0,0.4545,_SuimonoIsLinear);
	//c.a = pow(c.a,linearFac);
	//c.rgb *= linearFac;
	
	
	//mix final overlay
	c.rgb = lerp(origBGColor.rgb,c.rgb,_OverallTrans);
	
	c.rgb *= atten;

	//final alpha
	c.a = _OverallTrans;

	
	return c;
}



float4 tessDistance (appdata v0, appdata v1, appdata v2) {
	return UnityDistanceBasedTess(v0.vertex, v1.vertex, v2.vertex, _minDist, _maxDist, (_Tess));
}

struct Input {
	float4 screenPos;	
	float2 uv_Surface1;
	float2 uv_FoamTex;
	float2 uv_WaveLargeTex;
	float2 uv_FlowMap;
	float3 worldPos;
	float3 worldRefl;
    INTERNAL_DATA
};


float _EdgeBlend;
samplerCUBE _CubeTex;
samplerCUBE _CubeBDRF;
//sampler2D _CameraDepthTexture;
//sampler2D _CameraNormalsTexture;
sampler2D _GrabTexture;
//sampler2D _DepthRamp;
sampler2D _FoamTex;
float _isForward;
float _UVReversal;
float suimonoHeight;
float _ShallowFoamAmt;

void surf (Input IN, inout SurfaceOutput o) {


	//Calculate Normal
	half3 waveFac;
	half3 wfa;
	half3 wfb;
	half wfMult = 0.15;
	float2 waveSpd = float2(_suimono_uvx*0.4,_suimono_uvy*0.4);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_Surface1.x*wfMult+waveSpd.x,IN.uv_Surface1.y*wfMult+waveSpd.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_Surface1.x*wfMult-waveSpd.x-0.5,IN.uv_Surface1.y*wfMult-waveSpd.y-0.5))));
	waveFac = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_Surface1.x*wfMult-waveSpd.x-0.25,IN.uv_Surface1.y*wfMult))));
	waveFac = normalize(float3(waveFac.xy + wfb.xy, waveFac.z*wfb.z)); //blend function
	
	
	half3 waveFac1;
	float2 waveSpd1 = float2(_suimono_uvx,_suimono_uvy);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x+waveSpd1.x,IN.uv_WaveLargeTex.y+waveSpd1.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x-waveSpd1.x-0.5,IN.uv_WaveLargeTex.y-waveSpd1.y-0.5))));
	waveFac1 = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x-waveSpd1.x-0.25,IN.uv_WaveLargeTex.y))));
	waveFac1 = normalize(float3(waveFac1.xy + wfb.xy, waveFac1.z*wfb.z)); //blend function
	
	
	half3 waveFac2;
	half wf2Mult = 5.0;
	float2 waveSpd2 = float2(_suimono_uvx,_suimono_uvy);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf2Mult+waveSpd2.x,IN.uv_WaveLargeTex.y*wf2Mult+waveSpd2.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf2Mult-waveSpd2.x-0.5,IN.uv_WaveLargeTex.y*wf2Mult-waveSpd2.y-0.5))));
	waveFac2 = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf2Mult-waveSpd2.x-0.25,IN.uv_WaveLargeTex.y*wf2Mult))));
	waveFac2 = normalize(float3(waveFac2.xy + wfb.xy, waveFac2.z*wfb.z)); //blend function
	
	half3 waveFac3;
	half wf3Mult = 10.0;
	float2 waveSpd3 = float2(_suimono_uvx,_suimono_uvy);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf3Mult+waveSpd3.x,IN.uv_WaveLargeTex.y*wf3Mult+waveSpd3.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf3Mult-waveSpd3.x-0.5,IN.uv_WaveLargeTex.y*wf3Mult-waveSpd3.y-0.5))));
	waveFac3 = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf3Mult-waveSpd3.x-0.25,IN.uv_WaveLargeTex.y*wf3Mult))));
	waveFac3 = normalize(float3(waveFac3.xy + wfb.xy, waveFac3.z*wfb.z)); //blend function
	
	half3 waveFac4;
	half wf4Mult = 12.0;
	float2 waveSpd4 = float2(_suimono_uvx*4.0,_suimono_uvy*4.0);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf4Mult+waveSpd4.x,IN.uv_WaveLargeTex.y*wf4Mult+waveSpd4.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf4Mult-waveSpd4.x-0.5,IN.uv_WaveLargeTex.y*wf4Mult-waveSpd4.y-0.5))));
	waveFac4 = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf4Mult-waveSpd4.x-0.25,IN.uv_WaveLargeTex.y*wf4Mult))));
	waveFac4 = normalize(float3(waveFac4.xy + wfb.xy, waveFac4.z*wfb.z)); //blend function
	
	//wrap normal to shore normalization
	half3 flow = tex2D(_FlowMap, IN.uv_FlowMap).rgb;
	
	half3 norm1 = waveFac;
	norm1 = lerp(half3(0,0,1),norm1,_suimono_DeepWaveHeight/10.0);
	norm1 = lerp(norm1,half3(0,0,1),flow.r*normalShore);

	half3 norm2 = waveFac1;
	wfb = lerp(half3(0,0,1),waveFac2,_BumpStrength);
	norm2 = normalize(float3(norm2.xy + wfb.xy, norm2.z*wfb.z)); //blend function
	wfb = lerp(half3(0,0,1),waveFac3,_BumpStrength);
	norm2 = normalize(float3(norm2.xy + wfb.xy, norm2.z*wfb.z)); //blend function
	norm2 = lerp(half3(0,0,1),norm2,_suimono_DetailHeight/3.0); //fade out with height setting
	

	norm1 = normalize(norm1);
	norm2 = normalize(norm2);
 	o.Normal = normalize(float3(norm1.xy + norm2.xy, norm1.z*norm2.z)); //blend function
 	o.Normal = lerp(o.Normal,half3(0,0,1),mask1); //fade out in distance
	o.Normal = lerp(o.Normal,half3(0,0,1),edgeFactor); //fade out edge
 	
	//wrap normal to shore calculations
	float4 getflowmap = tex2D(_FlowMap, IN.uv_FlowMap);
 	float2 flowmap = float2(saturate(getflowmap.r + getflowmap.g),getflowmap.b) * 2.0 - 1.0;
	flowmap.x = lerp(0.0,flowmap.x,_FlowShoreScale);
	flowmap.y = lerp(0.0,flowmap.y,_FlowShoreScale);
	half4 waveTex = tex2D(_WaveTex, float2((IN.uv_FlowMap.x*shoreWaveScale)+flowOffX+flowmap.x,(IN.uv_FlowMap.y*shoreWaveScale)+flowOffY+flowmap.y));
	o.Normal = lerp(o.Normal,half3(0,0,1),waveTex.g * _WaveShoreHeight * flow.g);
	
	
	
	//set UVs
	float4 uv0 = IN.screenPos; uv0.xy;
	uv0.x -= (0.05*_RefrStrength*o.Normal.x)*(1.0-edgeFactor);
	uv0.z -= (0.05*_RefrStrength*o.Normal.z)*(1.0-edgeFactor);
	uv0.y += (0.2*_RefrStrength*o.Normal.y)*(1.0-edgeFactor);
	
	//calculate distance mask
	mask = saturate((uv0.w - lerp(60.0,20.0,(_ReflDist/50.0)))*_ReflBlend);
	mask1 = saturate((uv0.w - lerp(160.0,20.0,(5.0/25.0)))*0.002);
	mask2 = saturate((uv0.w - lerp(0.0,20.0,(5.0/25.0)))*0.01);
	mask3 = saturate((uv0.w - lerp(-150.0,60.0,(10.0/25.0)))*0.01);
	maskcastshadow = saturate((uv0.w - lerp(0.0,60.0,(_castshadowFade/100.0)))*0.01);

	//calculate foam
	half foamSpread = 0.0;// = saturate(1.0-saturate(_FoamSpread * (depth3-IN.screenPos.w)));

	//mix foam texture
	half4 foamTex = tex2D(_FoamTex, IN.uv_FoamTex);
	foamTex *= tex2D(_FoamTex, IN.uv_FoamTex*0.1).r;
	foamFactor = foamTex.g * saturate(lerp(0.0,1.0,foamSpread));
	foamFactor = lerp(foamFactor,foamTex.r,saturate(lerp(-1.0,1.0,foamSpread)));
	foamFactor = lerp(foamFactor,foamTex.b,saturate(lerp(-3.0,0.75,foamSpread)));

	
	//calculate height color factor
	highcolorFac = saturate(IN.worldPos.y-(suimonoHeight+((_suimono_DeepWaveHeight+_suimono_DetailHeight)*0.15)));
	backcolorFac = saturate(IN.worldPos.y-(suimonoHeight+((_suimono_DeepWaveHeight+_suimono_DetailHeight+5)*0.15)));
	
	//calculate depth colors and alpha
	half4 depthRamp = 1.0;
	half depthAlpha = _DepthColorB.a;
	depthAlpha = lerp(depthAlpha,_DepthColorG.a*1.8,depthRamp.g);
	depthAlpha = lerp(depthAlpha,_DepthColorR.a*2.8,depthRamp.r);
	depthColor.rgb = _DepthColorB.rgb;
	depthColor.rgb = lerp(depthColor.rgb,_DepthColorB.rgb,depthRamp.b);
	depthColor.rgb = lerp(depthColor.rgb,_DepthColorG*1.8,depthRamp.g);
	depthColor.rgb = lerp(depthColor.rgb,_DepthColorR*1.8,depthRamp.r);
	
	//distance depth color
	depthColor.rgb = lerp(depthColor.rgb,_DepthColorB.rgb,mask1);
	//depth alpha
	depthColor.a = depthAlpha;
	
	//increase opacity for shore waves
	depthColor.a = lerp(depthColor.a,1.0,saturate(waveTex.g)*flow.r);
	

	//calculate UVs
	float4 uvs = IN.screenPos;
	if (_isForward == 1.0){
		uvs.y = uvs.w - uvs.y;
	}
	if (_UVReversal == 1.0){
		if (_isForward == 1.0){
			uvs.y = IN.screenPos.y;
		} else {
			uvs.y = uvs.w - IN.screenPos.y;
		}
	}
	
	
	//blend normal texture and blur texture
	half useAlpha = 1.0;
	half3 useAlbedo = _DepthColorB.rgb;//half3(0,0,0);//lerp(oCol.rgb,xCol.rgb,_BlurSpread);

	//final refract / blur
	refractColor.rgb = useAlbedo;//*1.4;
	
	if (_castshadowEnabled == 1.0){
		refractColor.rgb *= 0.48;
	}
	
	
	//add final detail normal (preferred blend function)
	float3 AddNDet = lerp(lerp(waveFac4*2.0,half3(0,0,1),1.0-_BumpStrength),half3(0,0,1),mask3);
 	o.Normal = normalize(float3(o.Normal.xy + AddNDet.xy, o.Normal.z*AddNDet.z)); //whiteout function


}

ENDCG













// ---------------------------------
//   WATER SURFACE RENDERING
// ---------------------------------
Tags {"RenderType"="Opaque" "Queue"= "Transparent-101"} //overlay+1
Cull Back
ZWrite On

Blend SrcAlpha OneMinusSrcAlpha
 

CGPROGRAM



struct appdata {
	float4 vertex : POSITION;
	float4 tangent : TANGENT;
	float3 normal : NORMAL;
	float2 texcoord : TEXCOORD0;
};


#pragma target 5.0
#include "UnityCG.cginc"
#include "SuimonoFunctionsDX11.cginc"
#pragma surface surf SuimonoDepth addshadow vertex:vertexSuimonoDisplaceDX11 tessellate:tessDistance nolightmap noambient
#include "Tessellation.cginc"



//float _CenterHeight;
//float _MaxVariance;
float4 _HighColor;
float4 _LowColor;
float4 _DepthColor;
float4 _DepthColorR;
float4 _DepthColorG;
float4 _DepthColorB;
float4 _DynReflColor;
float4 _FoamColor;
float _SpecScatterWidth;
float _SpecScatterAmt;
float _RimPower;
sampler2D _Ramp2D;
sampler2D _ReflectionTex;
float _OverallTrans;
float _OverallBright;

float _ReflectStrength;
float _ReflDist;
float _ReflBlend;

float4 origBGColor;
float4 depthColor;
float4 reflectColor;
float4 reflectCUBE;
float4 reflectBDRF;
float4 reflectCubeColor;
float _RefrStrength;
float _RefrShift;
float4 refractColor;
float edgeFactor;
float foamFactor;
float _FoamSpread;
float4 _SpecColorH;
float4 _SpecColorL;
float _blurSamples;
float _BlurSpread;
float _HeightFoamAmount;
float _HeightFoamSpread;
float _FoamHeight;
float _ShadowAmt;
float highcolorFac;

float _useDynamicReflections;

//tenkoku variables
float4 _Tenkoku_SkyColor;
float4 _Tenkoku_HorizonColor;
float4 _Tenkoku_GlowColor;
float _Tenkoku_Ambient;

//shadow variables
float _castshadowEnabled;
float _castshadowStrength;
float _castshadowFade;
float4 _castshadowColor;

float mask;
float mask1;
float mask2;
float mask3;
float maskcastshadow;

inline fixed4 LightingSuimonoDepth (SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten)
{

	fixed4 c;

	//calculate dot products
	//half3 h = normalize (lightDir + viewDir);
	half3 hview = normalize (lightDir + (viewDir*0.9));
	half3 hview2 = normalize (half3(lightDir.x,lightDir.y,1.0-lightDir.z) + (viewDir*0.9));
	fixed NdotView = dot(s.Normal, viewDir);
	//fixed NdotHView = dot(s.Normal*5.0, viewDir*0.2);
	fixed NdotLight = dot(s.Normal, lightDir);
	//fixed NdotSky = dot(s.Normal, half3(0,0,1));
	half lightFac = NdotLight + (lerp(0.3,1.0,NdotView)*_LightColor0.a);

	//calculate shadow
	half3 shadowCol = saturate(lerp(1.0-_castshadowStrength-(NdotLight*0.1),1.0,(1.0-origBGColor.a)+(maskcastshadow)));

	//calculate specular
	float nh = saturate(dot(s.Normal, hview2));
	float spec = (pow(nh, _SpecScatterWidth*2.0)*(atten));
	spec += (pow(nh, _SpecScatterWidth*128.0)*10.0*(mask2)*_SpecColorH.a*(atten));
	spec += (pow(nh, _SpecScatterWidth*4.0*128.0)*850.0*(mask2)*_SpecColorH.a*(atten));
	spec *= saturate(lerp(1.0,-5.0,NdotView));

	//calculate colors
	fixed3 hcol = lerp(fixed3(2,0,0),fixed3(1,1,1),saturate(dot(half3(0,1,0),lightDir)));
	fixed3 skyCol = _Tenkoku_SkyColor;//lerp(_Tenkoku_SkyColor*0.0,_Tenkoku_SkyColor*0.0,saturate(lerp(0.0,6.0,hview.b))*_Tenkoku_Ambient*1.0);
	skyCol = lerp(skyCol,hcol,saturate(lerp(-1.0,6.0,hview.b*(1.0-_Tenkoku_Ambient)))*_Tenkoku_Ambient*1.0);
	skyCol = lerp(skyCol,_LightColor0*4.0,saturate(lerp(-1.0,2.0,hview.b*(1.0-_Tenkoku_Ambient)))*_Tenkoku_Ambient*2.0);

	//final reflection RGB
	c.rgb = fixed3(0,0,0);
	half dielectricRamp = saturate(lerp(-1,2,lightFac)) * saturate(lerp(1.0,-1.0,dot(s.Normal,viewDir)))*NdotLight;
	//half3 distRamp =  lerp(1.0,0.0,mask*_DynReflColor.a);

	//calculate reflection
	c.rgb = saturate(reflectCUBE.rgb * _DynReflColor.rgb * _LightColor0.rgb * atten * 1.0);
	//c.rgb = lerp(c.rgb,saturate(reflectColor.rgb * _DynReflColor.rgb * _LightColor0.rgb * atten * 1.0),_useDynamicReflections);
	
	//add specular
	c.rgb += (spec*(c.rgb*1.0)*_SpecColorH.rgb);

	//mix foam
	//c.rgb = lerp(c.rgb,(lerp(_FoamColor.rgb*1.4,_LightColor0.rgb,0.3)+saturate(lerp(1.0,-0.5,NdotView)*foamFactor))*(_LightColor0.a*0.5),foamFactor*_FoamColor.a);
	
	//linear conversion
	//half linearFac = lerp(1.0,0.4545,_SuimonoIsLinear);
	//c.a = pow(c.a,linearFac);
	//c.rgb *= linearFac;

	//FINAL ALPHA
	c.a = saturate(lerp(-1,2,lightFac)) * saturate(lerp(1.0,-2.0,dot(s.Normal,viewDir))*mask*_DynReflColor.a);

	//linear conversion
	//half linearFac = lerp(1.0,0.4545,_SuimonoIsLinear);
	//c.a = pow(c.a,linearFac);
	//c.rgb *= linearFac;
	
	return c;
}



float4 tessDistance (appdata v0, appdata v1, appdata v2) {
	return UnityDistanceBasedTess(v0.vertex, v1.vertex, v2.vertex, _minDist, _maxDist, (_Tess));
}

struct Input {
	float4 screenPos;	
	float2 uv_Surface1;
	//float2 uv_FoamTex;
	float2 uv_WaveLargeTex;
	//float2 uv_FlowMap;
	float3 worldPos;
	float3 worldRefl;
    INTERNAL_DATA
};


float _EdgeBlend;
samplerCUBE _CubeTex;
samplerCUBE _CubeBDRF;
//sampler2D _CameraDepthTexture;
//sampler2D _GrabTexture;
//sampler2D _DepthRamp;
//sampler2D _FoamTex;
float _isForward;
float _UVReversal;
float suimonoHeight;
float _ShallowFoamAmt;

void surf (Input IN, inout SurfaceOutput o) {


	//Calculate Normal
	half3 waveFac;
	half3 wfa;
	half3 wfb;
	half wfMult = 0.15;
	float2 waveSpd = float2(_suimono_uvx*0.4,_suimono_uvy*0.4);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_Surface1.x*wfMult+waveSpd.x,IN.uv_Surface1.y*wfMult+waveSpd.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_Surface1.x*wfMult-waveSpd.x-0.5,IN.uv_Surface1.y*wfMult-waveSpd.y-0.5))));
	waveFac = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_Surface1.x*wfMult-waveSpd.x-0.25,IN.uv_Surface1.y*wfMult))));
	waveFac = normalize(float3(waveFac.xy + wfb.xy, waveFac.z*wfb.z)); //blend function
	
	
	half3 waveFac1;
	float2 waveSpd1 = float2(_suimono_uvx,_suimono_uvy);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x+waveSpd1.x,IN.uv_WaveLargeTex.y+waveSpd1.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x-waveSpd1.x-0.5,IN.uv_WaveLargeTex.y-waveSpd1.y-0.5))));
	waveFac1 = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x-waveSpd1.x-0.25,IN.uv_WaveLargeTex.y))));
	waveFac1 = normalize(float3(waveFac1.xy + wfb.xy, waveFac1.z*wfb.z)); //blend function
	
	
	half3 waveFac2;
	half wf2Mult = 5.0;
	float2 waveSpd2 = float2(_suimono_uvx,_suimono_uvy);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf2Mult+waveSpd2.x,IN.uv_WaveLargeTex.y*wf2Mult+waveSpd2.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf2Mult-waveSpd2.x-0.5,IN.uv_WaveLargeTex.y*wf2Mult-waveSpd2.y-0.5))));
	waveFac2 = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf2Mult-waveSpd2.x-0.25,IN.uv_WaveLargeTex.y*wf2Mult))));
	waveFac2 = normalize(float3(waveFac2.xy + wfb.xy, waveFac2.z*wfb.z)); //blend function
	
	half3 waveFac3;
	half wf3Mult = 10.0;
	float2 waveSpd3 = float2(_suimono_uvx,_suimono_uvy);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf3Mult+waveSpd3.x,IN.uv_WaveLargeTex.y*wf3Mult+waveSpd3.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf3Mult-waveSpd3.x-0.5,IN.uv_WaveLargeTex.y*wf3Mult-waveSpd3.y-0.5))));
	waveFac3 = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf3Mult-waveSpd3.x-0.25,IN.uv_WaveLargeTex.y*wf3Mult))));
	waveFac3 = normalize(float3(waveFac3.xy + wfb.xy, waveFac3.z*wfb.z)); //blend function
	
	half3 waveFac4;
	half wf4Mult = 12.0;
	float2 waveSpd4 = float2(_suimono_uvx*4.0,_suimono_uvy*4.0);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf4Mult+waveSpd4.x,IN.uv_WaveLargeTex.y*wf4Mult+waveSpd4.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf4Mult-waveSpd4.x-0.5,IN.uv_WaveLargeTex.y*wf4Mult-waveSpd4.y-0.5))));
	waveFac4 = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf4Mult-waveSpd4.x-0.25,IN.uv_WaveLargeTex.y*wf4Mult))));
	waveFac4 = normalize(float3(waveFac4.xy + wfb.xy, waveFac4.z*wfb.z)); //blend function
	
	//wrap normal to shore normalization
	//half3 flow = tex2D(_FlowMap, IN.uv_FlowMap).rgb;
	
	half3 norm1 = waveFac;
	norm1 = lerp(half3(0,0,1),norm1,_suimono_DeepWaveHeight/10.0);
	//norm1 = lerp(norm1,half3(0,0,1),flow.r*normalShore);

	half3 norm2 = waveFac1;
	wfb = lerp(half3(0,0,1),waveFac2,_BumpStrength);
	norm2 = normalize(float3(norm2.xy + wfb.xy, norm2.z*wfb.z)); //blend function
	wfb = lerp(half3(0,0,1),waveFac3,_BumpStrength);
	norm2 = normalize(float3(norm2.xy + wfb.xy, norm2.z*wfb.z)); //blend function
	norm2 = lerp(half3(0,0,1),norm2,_suimono_DetailHeight/3.0); //fade out with height setting
	

	norm1 = normalize(norm1);
	norm2 = normalize(norm2);
 	o.Normal = normalize(float3(norm1.xy + norm2.xy, norm1.z*norm2.z)); //blend function
 	o.Normal = lerp(o.Normal,half3(0,0,1),mask1); //fade out in distance
	o.Normal = lerp(o.Normal,half3(0,0,1),edgeFactor); //fade out edge



	//set UVs
	float4 uv0 = IN.screenPos; uv0.xy;
	uv0.x -= (0.05*_RefrStrength*o.Normal.x)*(1.0-edgeFactor);
	uv0.z -= (0.05*_RefrStrength*o.Normal.z)*(1.0-edgeFactor);
	uv0.y += (0.2*_RefrStrength*o.Normal.y)*(1.0-edgeFactor);
	
	//calculate distance mask
	mask = saturate((uv0.w - lerp(60.0,20.0,(_ReflDist/50.0)))*_ReflBlend);
	mask1 = saturate((uv0.w - lerp(160.0,20.0,(5.0/25.0)))*0.002);
	mask2 = saturate((uv0.w - lerp(0.0,20.0,(5.0/25.0)))*0.01);
	mask3 = saturate((uv0.w - lerp(-150.0,60.0,(10.0/25.0)))*0.01);
	maskcastshadow = saturate((uv0.w - lerp(0.0,60.0,(_castshadowFade/100.0)))*0.01);
	
	o.Normal = lerp(o.Normal,lerp(o.Normal,half3(0,0,1),0.7),mask1);

	
	//calculate height color factor
	highcolorFac = saturate(IN.worldPos.y-(suimonoHeight+((_suimono_DeepWaveHeight+_suimono_DetailHeight)*0.15)));

	// decode dynamic reflection
	//float4 uv1 = IN.screenPos; uv1.xy;
	//uv1.y += (1.0*_ReflectStrength)*o.Normal.y;
	//reflectColor = tex2Dproj( _ReflectionTex, UNITY_PROJ_COORD(uv1));


	// decode cube / mobile reflection
	half3 cubeRef = texCUBE(_CubeTex, WorldReflectionVector(IN, o.Normal)).rgb;
	reflectCUBE.rgb = cubeRef.rgb;
	half3 cubeBDRF = texCUBE(_CubeBDRF, WorldReflectionVector(IN, o.Normal)).rgb;
	reflectBDRF.rgb = cubeBDRF.rgb;


	//add final detail normal (preferred blend function)
	float3 AddNDet = lerp(lerp(waveFac4*2.0,half3(0,0,1),1.0-_BumpStrength),half3(0,0,1),mask3);
 	o.Normal = normalize(float3(o.Normal.xy + AddNDet.xy, o.Normal.z*AddNDet.z)); //whiteout function

	
}

ENDCG















// ---------------------------------
//   FOAM RENDERING
// ---------------------------------
Tags {"RenderType"="Opaque" "Queue"= "Transparent-101"} //overlay+1
Cull Back
ZWrite On

Blend SrcAlpha OneMinusSrcAlpha
 

CGPROGRAM



struct appdata {
	float4 vertex : POSITION;
	float4 tangent : TANGENT;
	float3 normal : NORMAL;
	float2 texcoord : TEXCOORD0;
};


#pragma target 5.0
#include "UnityCG.cginc"
#include "SuimonoFunctionsDX11.cginc"
#pragma surface surf SuimonoDepth addshadow vertex:vertexSuimonoDisplaceDX11 tessellate:tessDistance nolightmap noambient
#include "Tessellation.cginc"



//float _CenterHeight;
//float _MaxVariance;
float4 _HighColor;
float4 _LowColor;
float4 _DepthColor;
float4 _DepthColorR;
float4 _DepthColorG;
float4 _DepthColorB;
float4 _DynReflColor;
float4 _FoamColor;
float _SpecScatterWidth;
float _SpecScatterAmt;
float _RimPower;
sampler2D _Ramp2D;
sampler2D _ReflectionTex;
float _OverallTrans;
float _OverallBright;

float _ReflectStrength;
float _ReflDist;
float _ReflBlend;

float4 origBGColor;
float4 depthColor;
float4 reflectColor;
float4 reflectCUBE;
float4 reflectBDRF;
float4 reflectCubeColor;
float _RefrStrength;
float _RefrShift;
float4 refractColor;
float edgeFactor;
float foamFactor;
float _FoamSpread;
float4 _SpecColorH;
float4 _SpecColorL;
float _blurSamples;
float _BlurSpread;
float _HeightFoamAmount;
float _HeightFoamSpread;
float _FoamHeight;
float _ShadowAmt;
float highcolorFac;

float _useDynamicReflections;

//tenkoku variables
float4 _Tenkoku_SkyColor;
float4 _Tenkoku_HorizonColor;
float4 _Tenkoku_GlowColor;
float _Tenkoku_Ambient;

//shadow variables
float _castshadowEnabled;
float _castshadowStrength;
float _castshadowFade;
float4 _castshadowColor;

float mask;
float mask1;
float mask2;
float mask3;
float maskcastshadow;

inline fixed4 LightingSuimonoDepth (SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten)
{

	fixed4 c;

	//calculate dot products
	half3 hview = normalize (lightDir + (viewDir*0.9));
	half3 hview2 = normalize (half3(lightDir.x,lightDir.y,1.0-lightDir.z) + (viewDir*0.9));
	fixed NdotView = dot(s.Normal, viewDir);
	fixed NdotLight = dot(s.Normal, lightDir);
	half lightFac = NdotLight + (lerp(0.3,1.0,NdotView)*_LightColor0.a);

	//calculate shadow
	//half3 shadowCol = saturate(lerp(1.0-_castshadowStrength-(NdotLight*0.1),1.0,(1.0-origBGColor.a)+(maskcastshadow)));

	//final reflection RGB
	c.rgb = fixed3(0,0,0);
	//half dielectricRamp = saturate(lerp(-1,2,lightFac)) * saturate(lerp(1.0,-1.0,dot(s.Normal,viewDir)))*NdotLight;
	//half3 distRamp =  lerp(1.0,0.0,mask*_DynReflColor.a);


	half dielectricRamp = saturate(lerp(-1,2,lightFac)) * saturate(lerp(0.75,-1.0,dot(s.Normal,viewDir)));
	half3 distRamp =  lerp(1.0,0.0,mask*_DynReflColor.a);
	NdotLight *= (1.0-dielectricRamp*NdotLight);

	//mix foam
	c.rgb = lerp(_FoamColor.rgb*1.4,_LightColor0.rgb,0.3)+saturate(lerp(1.0,-0.5,NdotView))*(_LightColor0.a*0.5);
	c.rgb = _FoamColor.rgb * _LightColor0.rgb;
	c.rgb *= atten;

	//linear conversion
	//half linearFac = lerp(1.0,0.4545,_SuimonoIsLinear);
	//c.a = pow(c.a,linearFac);
	//c.rgb *= linearFac;

	//FINAL ALPHA
	c.a = saturate(lerp(0.0,1.5,foamFactor * _FoamColor.a));
	c.a = lerp(c.a*0.2,c.a,NdotLight);
	
	return c;
}



float4 tessDistance (appdata v0, appdata v1, appdata v2) {
	return UnityDistanceBasedTess(v0.vertex, v1.vertex, v2.vertex, _minDist, _maxDist, (_Tess));
}

struct Input {
	float4 screenPos;	
	float2 uv_Surface1;
	float2 uv_FoamTex;
	float2 uv_WaveLargeTex;
	float2 uv_FlowMap;
	float3 worldPos;
    INTERNAL_DATA
};


float _EdgeBlend;
//sampler2D _CameraDepthTexture;
//sampler2D _GrabTexture;
//sampler2D _DepthRamp;
sampler2D _FoamTex;
float _isForward;
float _UVReversal;
float suimonoHeight;
float _ShallowFoamAmt;

void surf (Input IN, inout SurfaceOutput o) {

	//Calculate Normal
	half3 waveFac;
	half3 wfa;
	half3 wfb;
	half wfMult = 0.15;
	float2 waveSpd = float2(_suimono_uvx*0.4,_suimono_uvy*0.4);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_Surface1.x*wfMult+waveSpd.x,IN.uv_Surface1.y*wfMult+waveSpd.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_Surface1.x*wfMult-waveSpd.x-0.5,IN.uv_Surface1.y*wfMult-waveSpd.y-0.5))));
	waveFac = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_Surface1.x*wfMult-waveSpd.x-0.25,IN.uv_Surface1.y*wfMult))));
	waveFac = normalize(float3(waveFac.xy + wfb.xy, waveFac.z*wfb.z)); //blend function
	
	half3 waveFac1;
	float2 waveSpd1 = float2(_suimono_uvx,_suimono_uvy);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x+waveSpd1.x,IN.uv_WaveLargeTex.y+waveSpd1.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x-waveSpd1.x-0.5,IN.uv_WaveLargeTex.y-waveSpd1.y-0.5))));
	waveFac1 = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x-waveSpd1.x-0.25,IN.uv_WaveLargeTex.y))));
	waveFac1 = normalize(float3(waveFac1.xy + wfb.xy, waveFac1.z*wfb.z)); //blend function
	
	half3 waveFac2;
	half wf2Mult = 5.0;
	float2 waveSpd2 = float2(_suimono_uvx,_suimono_uvy);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf2Mult+waveSpd2.x,IN.uv_WaveLargeTex.y*wf2Mult+waveSpd2.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf2Mult-waveSpd2.x-0.5,IN.uv_WaveLargeTex.y*wf2Mult-waveSpd2.y-0.5))));
	waveFac2 = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf2Mult-waveSpd2.x-0.25,IN.uv_WaveLargeTex.y*wf2Mult))));
	waveFac2 = normalize(float3(waveFac2.xy + wfb.xy, waveFac2.z*wfb.z)); //blend function
	
	half3 waveFac3;
	half wf3Mult = 10.0;
	float2 waveSpd3 = float2(_suimono_uvx,_suimono_uvy);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf3Mult+waveSpd3.x,IN.uv_WaveLargeTex.y*wf3Mult+waveSpd3.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf3Mult-waveSpd3.x-0.5,IN.uv_WaveLargeTex.y*wf3Mult-waveSpd3.y-0.5))));
	waveFac3 = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf3Mult-waveSpd3.x-0.25,IN.uv_WaveLargeTex.y*wf3Mult))));
	waveFac3 = normalize(float3(waveFac3.xy + wfb.xy, waveFac3.z*wfb.z)); //blend function
	
	half3 waveFac4;
	half wf4Mult = 12.0;
	float2 waveSpd4 = float2(_suimono_uvx*4.0,_suimono_uvy*4.0);
	wfa = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf4Mult+waveSpd4.x,IN.uv_WaveLargeTex.y*wf4Mult+waveSpd4.y))));
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf4Mult-waveSpd4.x-0.5,IN.uv_WaveLargeTex.y*wf4Mult-waveSpd4.y-0.5))));
	waveFac4 = normalize(float3(wfa.xy + wfb.xy, wfa.z*wfb.z)); //blend function
	wfb = normalize(UnpackNormal(tex2D(_WaveLargeTex,float2(IN.uv_WaveLargeTex.x*wf4Mult-waveSpd4.x-0.25,IN.uv_WaveLargeTex.y*wf4Mult))));
	waveFac4 = normalize(float3(waveFac4.xy + wfb.xy, waveFac4.z*wfb.z)); //blend function
	
	//wrap normal to shore normalization
	half3 flow = tex2D(_FlowMap, IN.uv_FlowMap).rgb;
	
	half3 norm1 = waveFac;
	norm1 = lerp(half3(0,0,1),norm1,_suimono_DeepWaveHeight/10.0);
	norm1 = lerp(norm1,half3(0,0,1),flow.r*normalShore);

	half3 norm2 = waveFac1;
	wfb = lerp(half3(0,0,1),waveFac2,_BumpStrength);
	norm2 = normalize(float3(norm2.xy + wfb.xy, norm2.z*wfb.z)); //blend function
	wfb = lerp(half3(0,0,1),waveFac3,_BumpStrength);
	norm2 = normalize(float3(norm2.xy + wfb.xy, norm2.z*wfb.z)); //blend function
	norm2 = lerp(half3(0,0,1),norm2,_suimono_DetailHeight/3.0); //fade out with height setting
	
	norm1 = normalize(norm1);
	norm2 = normalize(norm2);
 	o.Normal = normalize(float3(norm1.xy + norm2.xy, norm1.z*norm2.z)); //blend function
 	o.Normal = lerp(o.Normal,half3(0,0,1),mask1); //fade out in distance
	o.Normal = lerp(o.Normal,half3(0,0,1),edgeFactor); //fade out edge
 	
	//wrap normal to shore calculations
	float4 getflowmap = tex2D(_FlowMap, IN.uv_FlowMap);
 	float2 flowmap = float2(saturate(getflowmap.r + getflowmap.g),getflowmap.b) * 2.0 - 1.0;
	flowmap.x = lerp(0.0,flowmap.x,_FlowShoreScale);
	flowmap.y = lerp(0.0,flowmap.y,_FlowShoreScale);
	half4 waveTex = tex2D(_WaveTex, float2((IN.uv_FlowMap.x*shoreWaveScale)+flowOffX+flowmap.x,(IN.uv_FlowMap.y*shoreWaveScale)+flowOffY+flowmap.y));
	o.Normal = lerp(o.Normal,half3(0,0,1),waveTex.g * _WaveShoreHeight * flow.g);
	
	
	//set UVs
	float4 uv0 = IN.screenPos; uv0.xy;
	uv0.x -= (0.05*_RefrStrength*o.Normal.x)*(1.0-edgeFactor);
	uv0.z -= (0.05*_RefrStrength*o.Normal.z)*(1.0-edgeFactor);
	uv0.y += (0.2*_RefrStrength*o.Normal.y)*(1.0-edgeFactor);
	
	//calculate distance mask
	mask = saturate((uv0.w - lerp(60.0,20.0,(_ReflDist/50.0)))*_ReflBlend);
	mask1 = saturate((uv0.w - lerp(160.0,20.0,(5.0/25.0)))*0.002);
	mask2 = saturate((uv0.w - lerp(0.0,20.0,(5.0/25.0)))*0.01);
	mask3 = saturate((uv0.w - lerp(-150.0,60.0,(10.0/25.0)))*0.01);
	maskcastshadow = saturate((uv0.w - lerp(0.0,60.0,(_castshadowFade/100.0)))*0.01);
	
	o.Normal = lerp(o.Normal,lerp(o.Normal,half3(0,0,1),0.7),mask1);
	
	//calculate foam
	//half depth3 = UNITY_SAMPLE_DEPTH(tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(IN.screenPos)));
	//depth3 = LinearEyeDepth(depth3); 
	half foamSpread = 0.0;//saturate(1.0-saturate(_FoamSpread * (depth3-IN.screenPos.w)));
	
	//add height wave foam
	half baseHeight = tex2D(_FoamTex, IN.uv_FoamTex*0.3).a;
	baseHeight *= lerp(0.4545,1.0,_SuimonoIsLinear);
	foamSpread += saturate(((IN.worldPos.y-(suimonoHeight+_HeightFoamAmount))*_HeightFoamSpread)*_FoamHeight * (1.0-mask1)*baseHeight);//(o.Normal.y * 5.0);
	
	//add shoreline height to foam
	foamSpread += lerp(0.0,1.0,saturate(waveTex.g * flow.r * _ShallowFoamAmt));

	//mix foam texture
	half4 foamTex = tex2D(_FoamTex, IN.uv_FoamTex);
	//foamTex *= tex2D(_FoamTex, IN.uv_FoamTex*0.1).r;
	
	foamTex += (tex2D(_FoamTex, IN.uv_FoamTex) * tex2D(_FoamTex, IN.uv_FoamTex*0.1).r);

	
	foamFactor = foamTex.g * saturate(lerp(0.0,1.0,foamSpread));
	foamFactor = lerp(foamFactor,foamTex.r,saturate(lerp(-1.0,1.0,foamSpread)));
	foamFactor = lerp(foamFactor,foamTex.b,saturate(lerp(-3.0,0.75,foamSpread)));

	//add final detail normal (preferred blend function)
	float3 AddNDet = lerp(lerp(waveFac4*2.0,half3(0,0,1),1.0-_BumpStrength),half3(0,0,1),mask3);
 	o.Normal = normalize(float3(o.Normal.xy + AddNDet.xy, o.Normal.z*AddNDet.z)); //whiteout function

	
}

ENDCG












}
//FallBack "Diffuse"
}



