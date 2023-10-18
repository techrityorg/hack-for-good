using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TutorialCheck : MonoBehaviour
{
    private void OnEnable()
    {
        Time.timeScale = 0;

        if (PlayerPrefs.GetInt("Tutorial", 0) > 0)
        {
            gameObject.SetActive(false);
        }
    }

    private void OnDisable()
    {
        PlayerPrefs.SetInt("Tutorial", 1);
        PlayerPrefs.Save();

        Time.timeScale = 1;
    }

    void Start()
    {

    }

    void Update()
    {

    }
}
