using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class IK
{
    public static IK instance;
    void IkPosition(Transform t, Vector3 p, int chainlength = 3, float weight = 1, float offset = 0.2f)
    {
        Transform[] bones = new Transform[chainlength];
        Vector3[] pos = new Vector3[chainlength];
        float[] lengths = new float[chainlength - 1];

        bones[0] = t;
        for (int i = 1; i < chainlength; i++)
        {
            bones[i] = bones[i - 1].parent;
        }

        for (int i = 0; i < chainlength; i++)
        {
            pos[i] = bones[i].position;

            if (i > 0 && i < chainlength - 1)
            {
                pos[i] = bones[i].position - bones[i].up * offset;
            }
        }

        for (int i = 0; i < chainlength - 1; i++)
        {
            lengths[i] = (bones[i].position - bones[i + 1].position).magnitude;
        }

        Vector3 start = bones[chainlength - 1].position;

        for (int i = 0; i < 10; i++)
        {
            pos[0] = Vector3.Lerp(pos[0], p, weight);
            for (int j = 1; j < chainlength; j++)
            {
                pos[j] = pos[j - 1] + (pos[j] - pos[j - 1]).normalized * lengths[j - 1];
            }

            pos[chainlength - 1] = start;
            for (int j = chainlength - 2; j >= 0; j--)
            {
                pos[j] = pos[j + 1] + (pos[j] - pos[j + 1]).normalized * lengths[j];
            }
        }
        for (int i = chainlength - 1; i > 0; i--)
        {
            Quaternion rot = Quaternion.FromToRotation(bones[i].up, pos[i - 1] - bones[i].position);
            bones[i].rotation = rot * bones[i].rotation;
        }
    }
    void BonePosition(Transform t, Vector3 p, float weight = 1)
    {
        t.position = Vector3.Lerp(t.position, p, weight);
    }

    void BoneRotation(Transform t, Quaternion r, float weight = 1)
    {
        t.rotation = Quaternion.Lerp(t.rotation, r, weight);
    }

    public static void SetIKPosition(Transform t, Vector3 p, int chainlength = 3, float weight = 1, float offset = 0.2f)
    {
        if (instance == null) instance = new IK();
        instance.IkPosition(t, p, chainlength, weight, offset);
    }

    public static void SetBonePosition(Transform t, Vector3 p, float weight = 1)
    {
        if (instance == null) instance = new IK();
        instance.BonePosition(t, p, weight);
    }

    public static void SetBoneRotation(Transform t, Quaternion r, float weight = 1)
    {
        if (instance == null) instance = new IK();
        instance.BoneRotation(t, r, weight);
    }
}
