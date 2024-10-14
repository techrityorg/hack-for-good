using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.IO;
using System;

public class FactsLoader : MonoBehaviour
{
    static List<string> facts;

    public static string DiscoveredFacts;

    void Awake()
    {
        TextAsset textAsset = Resources.Load<TextAsset>("facts");

        facts = new List<string>(textAsset.text.Split('\n'));

        foreach (string fact in facts)
        {
            Debug.Log(fact);
        }

        DiscoveredFacts = PlayerPrefs.GetString("Discovered", "");
        Debug.Log(DiscoveredFacts);
    }


    void Update()
    {

    }


    public static String GetRandomFact
    {
        get
        {
            int index = UnityEngine.Random.Range(0, facts.Count);
            var text = facts[index];

            string[] v = text.Split(new string[] { ". " }, StringSplitOptions.None);

            if (!DiscoveredFacts.Contains(v[1]))
            {
                DiscoveredFacts += "::" + v[1];

                PlayerPrefs.SetString("Discovered", DiscoveredFacts);
                PlayerPrefs.Save();

                return v[1];
            }
            else
            {
                return GetRandomFact;
            }
        }
    }
}
