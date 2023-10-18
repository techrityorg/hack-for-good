using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FactScreen : MonoBehaviour
{
    [SerializeField] MilestonePrompt prompt;
    private void OnEnable()
    {
       prompt.Fact.text = FactsLoader.GetRandomFact;
        Time.timeScale = 0;
    }

    private void OnDisable()
    {
        Time.timeScale = 1;
    }

    void Start()
    {
        
    }

    void Update()
    {
        
    }
}
