using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MilestonePrompt : MonoBehaviour
{
    public Text Fact;
    public Button Cancel;

    private void OnEnable()
    {
        Time.timeScale = 0;
        Fact.text = FactsLoader.GetRandomFact;

        Cancel.onClick.AddListener(delegate
        {
            gameObject.SetActive(false);
        });
    }

    void Start()
    {
        //if (Fact)
        //{
        //    Fact.text = FactsLoader.GetRandomFact;
        //}
    }

    void Update()
    {

    }

    private void OnDisable()
    {
        Time.timeScale = 1;
    }
}
