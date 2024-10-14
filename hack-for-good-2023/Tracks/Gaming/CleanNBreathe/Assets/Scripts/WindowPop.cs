using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WindowPop : MonoBehaviour
{
    AnimationCurve popCurve;
    float factor;
    public float poptime = 0.25f;
    private void Awake()
    {
        transform.localScale = Vector3.zero;
        popCurve = AnimationCurve.EaseInOut(0, 0, 1, 1);
        popCurve.AddKey(0.9f, 1.1f);
    }

    void Start()
    {
       
    }

    private void OnEnable()
    {
        transform.localScale = Vector3.zero;
        factor = 0;
    }

    void Update()
    {
        factor += Time.unscaledDeltaTime;
        transform.localScale = Vector3.one * popCurve.Evaluate(factor / poptime);
    }
}
