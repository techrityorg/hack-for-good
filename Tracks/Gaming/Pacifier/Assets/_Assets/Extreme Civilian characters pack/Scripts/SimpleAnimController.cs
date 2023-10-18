using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class SimpleAnimController : MonoBehaviour {
	private GameObject activeObject, activeObjectParent;
	private Animator anim;
	private Vector3 startPosition;
	private Quaternion startRotation;
	private float acceleration, speed;
	private bool controllingCharacter = true;
	
	public List<GameObject> targets = new List<GameObject>();
	public int currentTargetIdx = 0;
	public GameObject cameraAnchor;
	public GameObject thirdPersonController;

	private int totalVertexCount, totalTriangles, lodCount, meshCount;
	private int framesLeftUntillInitialized = 1; // otherwise we initialize before ThirdPersonCharacter is initialized

	// Use this for initialization
	void Start () {
		if(thirdPersonController == null) throw new System.ArgumentNullException("thirdPersonController");
	}
	
	// Update is called once per frame
	void Update () {
		if(framesLeftUntillInitialized > 0) {
			framesLeftUntillInitialized--;
			if(framesLeftUntillInitialized == 0) {
				UpdateTarget();
			}
		}
		/*
		// Control speed with keys
		if( Input.GetKeyDown(KeyCode.UpArrow) )
		{
			acceleration += 1f;
		}
		if( Input.GetKeyDown(KeyCode.DownArrow) )
		{
			 acceleration -= 1f;
		}
		if( Input.GetKeyUp(KeyCode.UpArrow) )
		{
			acceleration -= 1f;
		}
		if( Input.GetKeyUp(KeyCode.DownArrow) )
		{
			 acceleration += 1f;
		}
				
		speed = Mathf.Clamp(speed + (acceleration*Time.deltaTime),0f,1f);
		*/
		anim.SetFloat("speed", speed);
		anim.SetInteger("randomint", Random.Range(0,100));
		
		if( cameraAnchor != null )
			cameraAnchor.transform.position = Vector3.Lerp(cameraAnchor.transform.position, activeObject.transform.position, Time.deltaTime*5);
	}
	
	void OnGUI()
	{
		if(activeObject == null) {
			return;
		}

		float smallMargin = 0.0125f * Screen.height;

		bool controlButtonEnabled = false;

		float arrowButtonWidth = 50.0f;
		float controlButtonWidth = 100.0f;
		float totalButtonWidth = 2.0f * arrowButtonWidth + (controlButtonEnabled ? controlButtonWidth : 0.0f);

		if (GUI.Button(new Rect(Screen.width/2-totalButtonWidth/2, Screen.height-100, arrowButtonWidth, 50), "<<"))
			PreviousTarget();

		if(controlButtonEnabled) {
			Color guiColor = GUI.color;
			GUI.color = controllingCharacter ? Color.green : guiColor;
			if (GUI.Button(new Rect(Screen.width/2-totalButtonWidth/2+arrowButtonWidth, Screen.height-100, controlButtonWidth, 50), "Control")) {
				controllingCharacter = !controllingCharacter;
				if(controllingCharacter) {
					ControlTarget();
				} else {
					StopControllingTarget();
				}
			}
			GUI.color = guiColor;
		}

		if (GUI.Button(new Rect(Screen.width/2-totalButtonWidth/2+arrowButtonWidth+(controlButtonEnabled ? controlButtonWidth : 0.0f), Screen.height-100, arrowButtonWidth, 50), ">>"))
			NextTarget();

		if(!controllingCharacter) {
			speed = GUI.HorizontalSlider (new Rect (Screen.width/2-50, Screen.height-40, 100, 30), speed, 0.0f, 1.0f);
		}
		
		GUIStyle style = GUI.skin.label;
		style.alignment = TextAnchor.MiddleCenter;
		style.normal.textColor = Color.black;
		UpdateMeshInfo();
		
		float height = style.CalcHeight(new GUIContent("ABC"), Screen.width);
		Rect rect = new Rect(0.0f, 0.0f, Screen.width, height);
		style.fontStyle = FontStyle.Bold;
		GUI.Label(rect, new GUIContent(activeObject.name));
		style.fontStyle = FontStyle.Normal;
		rect.y = rect.yMax + smallMargin;
		GUI.Label(rect, new GUIContent("LOD Count: " + lodCount.ToString()));
		rect.y = rect.yMax + smallMargin;
		GUI.Label(rect, new GUIContent("Mesh Count (LOD 0): " + meshCount.ToString()));
		rect.y = rect.yMax + smallMargin;
		//GUI.Label(rect, new GUIContent("Total Vertex Count: " + totalVertexCount.ToString()));
		//rect.y = rect.yMax + smallMargin;
		GUI.Label(rect, new GUIContent("Total Tris: " + (totalTriangles / 3)));
	}
	
	void UpdateTarget()
	{
		if( !ValidateTargets() )
			return;
			
		activeObject = targets[currentTargetIdx];
		activeObjectParent = activeObject.transform.parent.gameObject;
		startPosition = activeObject.transform.position;
		startRotation = activeObject.transform.rotation;

		// reset parameters in case we already have an animator
		if( anim != null )
		{
			anim.SetFloat("speed", 0f);
			anim.SetInteger("randomint", 0);
		}
		
		anim = activeObject.GetComponent<Animator>();

		if(controllingCharacter) {
			ControlTarget();
		}
	}
	
	bool ValidateTargets()
	{
		if( targets.Count == 0 )
			return false;
		
		if( currentTargetIdx < 0 )
			currentTargetIdx = 0;
		if( currentTargetIdx >= targets.Count )
			currentTargetIdx = targets.Count - 1;
		
		return true;
	}
	
	void NextTarget()
	{
		StopControllingTarget ();
		currentTargetIdx++;
		if( currentTargetIdx >= targets.Count )
			currentTargetIdx = 0;
		
		UpdateTarget();
	}
	
	void PreviousTarget()
	{
		StopControllingTarget ();
		currentTargetIdx--;
		if( currentTargetIdx < 0 )
			currentTargetIdx = targets.Count-1;
		
		UpdateTarget();
	}
	
	void ControlTarget()
	{
		thirdPersonController.transform.position = activeObject.transform.position;
		thirdPersonController.transform.rotation = activeObject.transform.rotation;
		activeObject.transform.parent = thirdPersonController.transform;
		activeObject.transform.localPosition = Vector3.zero;
		activeObject.transform.localRotation = Quaternion.identity;
		thirdPersonController.GetComponent<Animator>().avatar = activeObject.GetComponent<Animator>().avatar;
		thirdPersonController.SetActive (true);
		anim.enabled = false;
	}

	void StopControllingTarget() {
		thirdPersonController.SetActive (false);
		activeObject.transform.parent = activeObjectParent.transform;
		activeObject.transform.position = startPosition;
		activeObject.transform.rotation = startRotation;
		anim.enabled = true;
	}
	
	void UpdateMeshInfo() {
		totalTriangles = 0;
		totalVertexCount = 0;
		meshCount = 0;

		if(activeObject == null) {
			return;
		}

		LODGroup lodGroup = activeObject.GetComponent<LODGroup>();
		lodCount = lodGroup != null ? lodGroup.lodCount : 1;		
		
		
		SkinnedMeshRenderer[] renderers = activeObject.GetComponentsInChildren<SkinnedMeshRenderer>();
		if( renderers.Length > 0 ) {
			foreach( SkinnedMeshRenderer mf in renderers) {				
				Mesh m = mf.sharedMesh;
				if( m != null && mf.GetComponent<Renderer>().isVisible ) {					
					totalVertexCount += m.vertexCount;
					totalTriangles += m.triangles.Length;
					meshCount += 1;
				}
			}
		}
	}
}
