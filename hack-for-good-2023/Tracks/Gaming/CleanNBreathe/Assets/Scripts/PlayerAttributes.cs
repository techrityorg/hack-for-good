using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerAttributes : MonoBehaviour
{
    public float LungCapacity = 1;
    public float TrashBagCapacity = 1;
    public float DashSpeed = 1;
    public float DashDuration = 1;
    public float DiveSuit = 1;

    private float _lungCapacity = 0.05f;

    private float _trashBagCapacity = 5;

    private float _dashSpeed = 0.1f;
    private float _dashDuration = 0.25f;

    private float _diveSuit = 2f;

    public static PlayerAttributes Instance;
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
        //DeSerializeUpgrades();
    }

    void Update()
    {
        
    }

    public float GetLungCapacity()
    {
        return LungCapacity * _lungCapacity;
    }

    public float GetDashSpeed()
    {
        return DashSpeed * _dashSpeed;
    }

    public float GetDashDuration()
    {
        return DashDuration * _dashDuration;
    }

    public float GetTrashBagCapacity()
    {
        return TrashBagCapacity * _trashBagCapacity;
    }

    public float GetDiveSuit()
    {
        return DiveSuit * _diveSuit;
    }

    public void UpgradeLungCapacity()
    {
        LungCapacity++;
        //SerializeUpgrades();
    }

    public void UpgradeTrashBagCapacity()
    {
        //TrashBagCapacity++;
        StartCoroutine(TrashBagUpgrade());
        //SerializeUpgrades();
    }

    public void UpgradeDashSpeed()
    {
        DashSpeed++;
        //SerializeUpgrades();
    }

    public void UpgradeDiveDuration()
    {
        DashDuration++;
        //SerializeUpgrades();
    }

    public void UpgradeDiveSuit()
    {
        //DiveSuit++;
        StartCoroutine(DiveSuitUpgrade());
        //SerializeUpgrades();
    }

    IEnumerator TrashBagUpgrade()
    {
        float tmp = TrashBagCapacity;
        while ((int)tmp == (int)TrashBagCapacity)
        {
            TrashBagCapacity = Mathf.MoveTowards(TrashBagCapacity, (int)TrashBagCapacity + 1, Time.unscaledDeltaTime);
            yield return null;
        }
    }

    IEnumerator DiveSuitUpgrade()
    {
        float tmp = DiveSuit;
        while ((int)tmp == (int)DiveSuit) {
            DiveSuit = Mathf.MoveTowards(DiveSuit, (int)DiveSuit + 1, 0.7f * Time.unscaledDeltaTime);
            yield return null;
        }
    }

    public void SerializeUpgrades()
    {
        PlayerPrefs.SetFloat("LC", LungCapacity);
        PlayerPrefs.SetFloat("TBC", TrashBagCapacity);
        PlayerPrefs.SetFloat("DS", DashSpeed);
        PlayerPrefs.SetFloat("DD", DashDuration);
        PlayerPrefs.SetFloat("DS", DiveSuit);
    }

    public void DeSerializeUpgrades()
    {
        LungCapacity = PlayerPrefs.GetInt("LC");
        TrashBagCapacity = PlayerPrefs.GetInt("TBC");
        DashSpeed = PlayerPrefs.GetInt("DS");
        DashDuration = PlayerPrefs.GetInt("DD");
        DiveSuit = PlayerPrefs.GetInt("DS");
    }
}
