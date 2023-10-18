using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class PP
{
    public Transform Placer;
    public RectTransform Placee;
}

public class UIPlacement : MonoBehaviour
{
    public PP[] PPs;
    void Start()
    {

    }

    void LateUpdate()
    {
        foreach (var test in PPs)
        {
            Vector3 screenpos = Camera.main.WorldToScreenPoint(test.Placer.transform.position);
            test.Placee.position = screenpos;
        }
    }
}
