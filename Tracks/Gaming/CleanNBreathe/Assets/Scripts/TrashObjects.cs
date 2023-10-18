using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public enum TrashType
{
    CardBoard,
    Bottle,
    Can
}
public class TrashObjects : MonoBehaviour
{
    public TrashType trashType;
    void Start()
    {
        
    }

    void LateUpdate()
    {
        Vector3 pos = transform.position;
        if (pos.y > -0.1f)
        {
            pos.y = -0.1f;
        }
        transform.position = pos;
    }
}
