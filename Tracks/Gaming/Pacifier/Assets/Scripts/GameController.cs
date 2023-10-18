using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class GameController : MonoBehaviour
{
    public TextMeshProUGUI calendarText;
    private bool isToggled = false;

    [Header("Buttons Functionality")]
    public GameObject securityButton;
    public GameObject politicalButton;
    public GameObject constructionButton;


    [SerializeField] GameObject actionGO;

    [Header("Security Functionality")]
    public GameObject securityContainer;
    public GameObject securityToggled_ico;
    public GameObject securityUntoggled_ico;
    public GameObject sternContainer;


    [Header("Political Functionality")]
    public GameObject politicalContainer;
    public GameObject politicalToggled_ico;
    public GameObject politicalUntoggled_ico;

    [Header("Construction Functionality")]
    public GameObject constructionContainer;
    public GameObject constructionToggled;
    public GameObject constructionUntoggled;

    [Header("Objectives Functionality")]
    public GameObject objectiveContainer;




    // Start is called before the first frame update
    void Start()
    {
        DateSetter(calendarText);

    }

    private void Update()
    {

    }

    // Update is called once per frame
    void DateSetter(TextMeshProUGUI dateText)
    {
        DateTime currentDate = DateTime.Now;
        string dateFormat = currentDate.ToString($"MMMM dd, yyyy");
        dateText.text = dateFormat;
    }

    public void ActionToggle()
    {
        if (!isToggled)
            DisplayAction();
        else
            DisableAction();
    }

    private void DisplayAction()
    {
        isToggled = true;
        actionGO.SetActive(true);
        DisplayProperties();
        DisableObjectives();

    }

    public void DisableAction()
    {
        isToggled = false;
        actionGO.SetActive(false);
        DisableProperties();

    }

    void DisplayProperties()
    {
        securityButton.SetActive(true);
        politicalButton.SetActive(true);
        constructionButton.SetActive(true);

        securityContainer.SetActive(false);
        securityToggled_ico.SetActive(true);
        securityUntoggled_ico.SetActive(false);

        politicalContainer.SetActive(false);
        politicalToggled_ico.SetActive(true);
        politicalUntoggled_ico.SetActive(false);

        constructionContainer.SetActive(false);
        constructionToggled.SetActive(true);
        constructionUntoggled.SetActive(false);

        isSecurityToggled = false;
        isPoliticalToggled = false;
        isConstructionToggle = false;

        SternMeasures();
    }

    void DisableProperties()
    {
        securityContainer.SetActive(false);
        politicalContainer.SetActive(false);
        constructionContainer.SetActive(false);

        isSecurityToggled = false;
        isPoliticalToggled = false;
        isConstructionToggle = false;

        SternMeasures();

    }

    // ===== Security System ========
    #region Security System
    private bool isSecurityToggled = false;

    public void SecurityToggle()
    {
        if (isSecurityToggled == false)
        {

            politicalButton.SetActive(false);
            securityContainer.SetActive(true);
            securityToggled_ico.SetActive(false);
            securityUntoggled_ico.SetActive(true);
            isSecurityToggled = true;

            //for stern measures buttons
            SternMeasures();

            //Deactivate Politcical Objects
            DisablePolitical();

            //Deactivate Construction Objects
            DisableConstruction();

        }
        else
        {
            constructionButton.SetActive(true);
            politicalButton.SetActive(true);

            securityContainer.SetActive(false);
            securityToggled_ico.SetActive(true);
            securityUntoggled_ico.SetActive(false);
            isSecurityToggled = false;

            //for stern measures buttons
            SternMeasures();


        }

    }

    private bool isSternMeasure = false;

    public void SternMeasures()
    {


        if (isSternMeasure == false)
        {
            sternContainer.SetActive(true);
            isSternMeasure = true;
        }
        else
        {
            sternContainer.SetActive(false);
            isSternMeasure = false;
        }
    }


    #endregion

    //==== Political System ====
    #region Political System

    private bool isPoliticalToggled = false;
    public void PoliticalToggle()
    {
        if (isPoliticalToggled == false)
        {
            politicalToggled_ico.SetActive(false);
            politicalUntoggled_ico.SetActive(true);
            politicalContainer.SetActive(true);

            isPoliticalToggled = true;

            isConstructionToggle = false;
            constructionButton.SetActive(false);
            constructionContainer.SetActive(false);
        }
        else
        {
            politicalToggled_ico.SetActive(true);
            politicalUntoggled_ico.SetActive(false);
            politicalContainer.SetActive(false);

            constructionButton.SetActive(true);
            constructionToggled.SetActive(true);
            constructionUntoggled.SetActive(false);


            isPoliticalToggled = false;
        }

    }

    void DisablePolitical()
    {
        //Deactivate Politcical Objects
        isPoliticalToggled = false;
        politicalContainer.SetActive(false);
        politicalToggled_ico.SetActive(true);
        politicalUntoggled_ico.SetActive(false);
    }
    #endregion

    // ==== Construction System =====
    #region Construction System

    private bool isConstructionToggle = false;
    public void ConstructionToggle()
    {
        if (isConstructionToggle == false)
        {
            constructionContainer.SetActive(true);
            constructionToggled.SetActive(false);
            constructionUntoggled.SetActive(true);
            isConstructionToggle = true;

            //Deactivate Political Objects
            DisablePolitical();

        }
        else
        {
            constructionContainer.SetActive(false);
            constructionToggled.SetActive(true);
            constructionUntoggled.SetActive(false);
            isConstructionToggle = false;
        }
    }

    void DisableConstruction()
    {
        isConstructionToggle = false;
        constructionButton.SetActive(false);
        constructionToggled.SetActive(true);
        constructionUntoggled.SetActive(false);
        constructionContainer.SetActive(false);
    }

    #endregion


    #region Objective System

    private bool isObjectiveToggled = false;

    public void Objectives()
    {
        if (isObjectiveToggled == false)
        {
            EnableObjectives();
        }
        else
        {
            DisableObjectives();
        }
    }

    void EnableObjectives()
    {
        DisableAction();
        objectiveContainer.SetActive(true);
        isObjectiveToggled = true;
    }

    void DisableObjectives()
    {
        objectiveContainer.SetActive(false);
        isObjectiveToggled = false;
    }
    #endregion

}