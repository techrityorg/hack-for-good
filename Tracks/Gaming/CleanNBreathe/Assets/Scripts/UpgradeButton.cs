using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UpgradeButton : MonoBehaviour
{
    float Timer = 0;
    [SerializeField] Image bar;

    private void OnEnable()
    {
        Timer = 4;
    }

    void Start()
    {
        
    }

    private void FixedUpdate()
    {

    }

    void Update()
    {
        Timer -= Time.unscaledDeltaTime;
        if (Timer <= 0)
        {
            //gameObject.SetActive(false);
        }

        bar.fillAmount = Timer / 4f;
    }
}
