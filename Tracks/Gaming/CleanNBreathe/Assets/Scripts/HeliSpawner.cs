using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HeliSpawner : MonoBehaviour
{
    [SerializeField] GameObject Heli;
    [SerializeField] GameObject TrashCan;

    [SerializeField] Transform HeliSpawnPoint;
    [SerializeField] Transform TCanSpawnPoint;

    public static HeliSpawner Instance;
    void Start()
    {
        if (Instance)
        {
            if (Instance != this)
            {
                Destroy(this.gameObject);
            }
        }
        else
        {
            Instance = this;
        }
    }

    void Update()
    {
        
    }

    public void Spawn()
    {
        GameObject heli = Instantiate(Heli, HeliSpawnPoint.position, Quaternion.identity);
        GameObject tCan = Instantiate(TrashCan, TCanSpawnPoint.position, Quaternion.identity);
    }
}
