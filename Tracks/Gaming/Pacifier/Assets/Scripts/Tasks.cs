using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Tasks : MonoBehaviour
{
    public static Tasks instance;
    public bool AddressPoliceBrutality;
    public bool addressPeace;

    public float timer = 30f;

    private void Awake()
    {
        if (instance != null && instance != this)
        {
            Destroy(this.gameObject);
            return;
        }
        instance = this;
        DontDestroyOnLoad(this.gameObject);

        // Start the coroutine when the object is created
        StartCoroutine(PoliceBrutality());
         StartCoroutine(AddressPeace());
    }

    IEnumerator PoliceBrutality()
    {
        while (true)
        {
            // Set AddressPoliceBrutality to true
            AddressPoliceBrutality = true;
            
            // Wait for the specified time
            yield return new WaitForSeconds(timer);

            // Set AddressPoliceBrutality back to false
            AddressPoliceBrutality = false;

            // Wait for the same amount of time
            yield return new WaitForSeconds(timer);
        }
    }

     IEnumerator AddressPeace()
    {
        while (true)
        {
            
            addressPeace = false;
            
            // Wait for the specified time
            yield return new WaitForSeconds(timer);

            // Set AddressPoliceBrutality back to false
            addressPeace = true;

            // Wait for the same amount of time
            yield return new WaitForSeconds(timer);
        }
    }
}
