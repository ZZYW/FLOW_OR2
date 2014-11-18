#ifndef CUSTOM_LIGHTING_INCLUDED
#define CUSTOM_LIGHTING_INCLUDED


		
float _Tess;
float _minDist;
float _maxDist;

sampler2D _WaveMaskTex;
sampler2D _Surface1;
sampler2D _Surface2;
sampler2D _WaveLargeTex;
float _Displacement;
float _BumpStrength;
float _dScaleX;
float _dScaleY;
float _Phase;
float _WaveHeight;
float _WaveShoreHeight;
float _WaveScale;
float _WaveShoreScale;
float _MaskAmt;
float _ShoreAmt;
float _TimeX;
float _TimeY;
float _DTimeX;
float _DTimeY;
float _DTimeX2;
float _DTimeY2;
float _DetailHeight;
float _suimono_DeepWaveHeight;
float _suimono_DetailHeight;

float _SuimonoIsLinear;

sampler2D _WaveMap;
sampler2D _WaveTex;
sampler2D _FlowMap;
float _MasterScale;
float _FlowScale;
float _FlowShoreScale;
float halfCycle;
float flowMapOffset0;
float flowMapOffset1;
float flowOffX;
float flowOffY;
float shoreOffX;
float shoreOffY;
float shoreWaveOffX;
float shoreWaveOffY;
float detailScale;
float waveScale;
float normalShore;
float shoreWaveScale;
float _suimono_uvx;
float _suimono_uvy;
float _DepthAmt;

inline void vertexSuimonoDisplaceDX11 (inout appdata v){

	//calculate waves
	half2 tex = v.texcoord;
	half2 tex1 = v.texcoord * waveScale;
	half2 tex2 = v.texcoord * detailScale;
	half2 tex3 = v.texcoord * shoreWaveScale;
	
	half2 _offset = half2(_TimeX,_TimeY)*1.0;
	half2 _Doffset = half2(_DTimeX,_DTimeY)*1.0;
	half2 _Doffset2 = half2(_DTimeX2,_DTimeY2)*14.0;
	
	//calculate flowmap wvalues
	half2 _offsetFlow = half2(flowOffX,flowOffY);
	half2 _offsetShore = half2(shoreOffX,shoreOffY);
	
	float4 getflowmap = tex2Dlod(_FlowMap, float4(tex.x, tex.y,0.0,0.0));
 	float2 flowmap = float2(saturate(getflowmap.r + getflowmap.g),getflowmap.b) * 2.0f - 1.0f;
	flowmap.x = lerp(0.0,flowmap.x,_FlowShoreScale);
	flowmap.y = lerp(0.0,flowmap.y,_FlowShoreScale);

	
	//flowmap values
	float fr = tex2Dlod(_FlowMap, float4(tex.xy + _offsetShore,0.0,0.0)).r;
	//float fg = tex2Dlod(_FlowMap, float4(tex.xy + _offsetShore,0.0,0.0)).g;
	
	//offsetShoreWave
	half4 waveTex = tex2Dlod(_WaveTex, float4((tex3.xy+_offsetFlow+flowmap),0.0,0.0));


	// calculate maps
	float texwaveRedChannel = tex2Dlod(_WaveMap, float4(tex.x, tex.y,0,0)).r;
	float texwaveGreenChannel = tex2Dlod(_WaveMap, float4(tex.x, tex.y,0,0)).g;
	
	// Distance Mask
	//calculate the distance mask and apply later to fade the wave height
	float4 pos = mul(UNITY_MATRIX_MVP, v.vertex);
	float4 projpos = ComputeScreenPos(pos);
	float mask1 = saturate((projpos.w - lerp(60.0,20.0,(_DepthAmt/25.0)))*0.009);
	
	// calculate waves
	float texwaveFac;
	float twfMult = 0.15;
	fixed2 waveSpd = fixed2(_suimono_uvx*0.4,_suimono_uvy*0.4); 
	texwaveFac = tex2Dlod(_Surface1, float4(tex1.x*twfMult+waveSpd.x, tex1.y*twfMult+waveSpd.y,0,0)).r;
	texwaveFac += tex2Dlod(_Surface1, float4(tex1.x*twfMult-waveSpd.x-0.5, tex1.y*twfMult-waveSpd.y-0.5,0,0)).r;
	texwaveFac += tex2Dlod(_Surface1, float4(tex1.x*twfMult-waveSpd.x-0.25, tex1.y*twfMult,0,0)).r;
	
	float texwaveFac1;
	fixed2 waveSpd1 = fixed2(_suimono_uvx,_suimono_uvy); 
	texwaveFac1 = tex2Dlod(_Surface1, float4(tex2.x+waveSpd1.x, tex2.y+waveSpd1.y,0,0)).r;
	texwaveFac1 += tex2Dlod(_Surface1, float4(tex2.x-waveSpd1.x-0.5, tex2.y-waveSpd1.y-0.5,0,0)).r;
	texwaveFac1 += tex2Dlod(_Surface1, float4(tex2.x-waveSpd1.x-0.25, tex2.y,0,0)).r;

	float texwaveFac2;
	float twf2Mult = 8.0;
	fixed2 waveSpd2 = fixed2(_suimono_uvx,_suimono_uvy); 
	texwaveFac2 = tex2Dlod(_Surface1, float4(tex2.x*twf2Mult+waveSpd2.x, tex2.y*twf2Mult+waveSpd2.y,0,0)).r;
	texwaveFac2 += tex2Dlod(_Surface1, float4(tex2.x*twf2Mult-waveSpd2.x-0.5, tex2.y*twf2Mult-waveSpd2.y-0.5,0,0)).r;
	texwaveFac2 += tex2Dlod(_Surface1, float4(tex2.x*twf2Mult-waveSpd2.x-0.25, tex2.y*twf2Mult,0,0)).r;

	float texwaveFac3;
	float twf3Mult = 20.0;
	fixed2 waveSpd3 = fixed2(_suimono_uvx,_suimono_uvy); 
	texwaveFac3 = tex2Dlod(_Surface1, float4(tex2.x*twf3Mult+waveSpd3.x, tex2.y*twf3Mult+waveSpd3.y,0,0)).r;
	texwaveFac3 += tex2Dlod(_Surface1, float4(tex2.x*twf3Mult-waveSpd3.x-0.5, tex2.y*twf3Mult-waveSpd3.y-0.5,0,0)).r;
	texwaveFac3 += tex2Dlod(_Surface1, float4(tex2.x*twf3Mult-waveSpd3.x-0.25, tex2.y*twf3Mult,0,0)).r;

	//gamma conversion if needed
	_suimono_DeepWaveHeight *= lerp((0.4545),1.0,_SuimonoIsLinear);	
	_suimono_DetailHeight *= lerp((0.4545),1.0,_SuimonoIsLinear);
	_WaveShoreHeight *= lerp((0.4545),1.0,_SuimonoIsLinear);
		
	//SET VERTICES
	//vertical wave
	fixed origY = v.vertex.y; //save original vertex height
	float deepFac = texwaveFac;
	float waveFac = texwaveFac1 + (texwaveFac2*0.1);// + (texwaveFac3*0.02); //calculate wave height

	//v.vertex.y += lerp(0.0,_suimono_DeepWaveHeight,deepFac); //add deep wave height to vertex
	//v.vertex.y += lerp(0.0,_suimono_DetailHeight,waveFac); //add wave height to vertex

	v.vertex.xyz += (v.normal*lerp(0.0,_suimono_DeepWaveHeight,deepFac)); //add deep wave height to vertex
	v.vertex.xyz += (v.normal*lerp(0.0,_suimono_DetailHeight,waveFac)); //add wave height to vertex
	
	//v.vertex.y = lerp(v.vertex.y,0.0,mask1); //fade vertex height out in distance
	
	//detail texture
	//v.vertex.y += lerp(0.0,_DetailHeight, (texwaveFacDetail1 * (1.0-(z*0.25))));
	//v.vertex.y += lerp(0.0,_DetailHeight*0.25, (texwaveFacDetail2 * (1.0-(z*0.25))));
	
	//normalize shoreline
	v.vertex.y = lerp(v.vertex.y,origY, (fr) * normalShore);
	
	//raise and warp wavetex at shoreline
	v.vertex.y += (waveTex * _WaveShoreHeight) * (fr);// * (1.0-s);

	//update normal
	//v.normal.y = lerp(0.01,1.0,(v.vertex.y));
	//v.normal = normalize(v.vertex);

	

}

#endif