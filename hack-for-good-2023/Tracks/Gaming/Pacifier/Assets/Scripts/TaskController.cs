using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
public class TaskController : MonoBehaviour
{
    public ScoreSystem scoreSystem;



    #region Security Measure 

    public void AddCheckPoint()
    {
        Debug.Log("Checkpoint Added");

        UpdateScore(5);

    }

    public void RemoveCheckPoint()
    {
        Debug.Log("Checkpoint Removed");
        UpdateScore(-3);
    }

    public void SetupTaskForce()
    {
        Debug.Log("Task Force Setup");
        UpdateScore(2);
    }

    public void ArrestCultists()
    {
        Debug.Log("Cultists Arrested");
        UpdateScore(10);
    }
    public void SeizeArms()
    {
        Debug.Log("Arms are seized");
        UpdateScore(7);
    }
    public void AssassinateMilitant()
    {
        Debug.Log("Militant Assassinated !");
        UpdateScore(7);
    }

    #endregion

    #region Political Measure

    public void AddressTheState()
    {
        Debug.Log("State Is Addressed!");
        UpdateScore(1);
    }

    public void AddressTheYouth()
    {
        Debug.Log("Youth Is Addressed!");
       UpdateScore(3);
    }

    public void AddressCivilServant()
    {
        Debug.Log("Civil Servant Is Addressed!");
        UpdateScore(4);
    }

    public void AddressInstitution()
    {
        Debug.Log("Institution is Addressed");
        UpdateScore(2);
    }

    #endregion

    #region Construction Measures

    public void ConstructIndustry()
    {
        Debug.Log("Industry Constructed");
        UpdateScore(6);
    }

    public void ConstructAgriculture()
    {
        Debug.Log("Agriculture Constructed");
        UpdateScore(7);
    }

    public void ConstructRoads()
    {
        Debug.Log("Roads Constructed");
       UpdateScore(7);
    }

    public void ConstructPrison()
    {
        Debug.Log("Prison Constructed");
        UpdateScore(3);
    }

    public void ConstructPoliceStation()
    {
        Debug.Log("Police Station Constructed");
        UpdateScore(2);
    }

    public void ConstructPowerPlant()
    {
        Debug.Log("Power Plant Constructed");
        UpdateScore(5);
    }

    #endregion

    // Start is called before the first frame update
    void Start()
    {
        scoreSystem = GameObject.FindObjectOfType<ScoreSystem>();
    }

    public void UpdateScore(int score)
    {// Change the score by the desired amount
        scoreSystem.UpdateScore(score); // Update the score
    }

}
