using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Fish : MonoBehaviour
{
    public float xdir;
    float speed;
    void Start()
    {
        speed = (Random.Range(1f, 3f));
    }

    void Update()
    {
        transform.Translate(Vector3.right * xdir * speed * Time.deltaTime);
        transform.localScale = new Vector3(-xdir, 1, 1);
        
        if(Mathf.Abs(transform.position.x) > 45)
        {
            Destroy(gameObject);
        }
    }
}
