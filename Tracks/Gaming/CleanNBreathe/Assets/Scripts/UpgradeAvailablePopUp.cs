using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UpgradeAvailablePopUp : MonoBehaviour
{
    public float speed;

    IEnumerator Start()
    {
        yield return new WaitForSeconds(4);
        Destroy(gameObject);
    }

    void Update()
    {
        transform.position += Vector3.up * speed * Time.deltaTime;
    }
}
