using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class TrashCan : MonoBehaviour
{
    [SerializeField] Image bar;
    [SerializeField] int Capacity;
    int Content;

    [SerializeField] GameObject milestonePrompt;


    [SerializeField] GameObject UpgradeIcon;
    [SerializeField] Button UpgradeButton;
    [SerializeField] public static int UpgradePool;
    [SerializeField] Text UpgradePoolText;

    [SerializeField] Transform MainGameRect;
    [SerializeField] GameObject UpgradeAvailablePopUp;

    int filledTimes;
    void Start()
    {
        UpgradePool = 0;

        try
        {
            bar = GameObject.FindGameObjectWithTag("TrashCanBar").GetComponent<Image>();
        }
        catch (System.Exception e)
        {

        }

        //milestonePrompt = FindObjectOfType<MilestonePrompt>();
        //milestonePrompt.gameObject.SetActive(false);
    }

    void Update()
    {
        if (!bar)
        {
            bar = GameObject.FindGameObjectWithTag("TrashCanBar").GetComponent<Image>();
        }
        if (bar) bar.fillAmount = (float)Content / Capacity;

        UpgradeButton.interactable = UpgradePool > 0;
        UpgradeIcon.SetActive(UpgradePool > 0);
    }

    public void TakeTrash(int trashCount)
    {
        Content += trashCount;
        Content = Mathf.Clamp(Content, 0, Capacity);

        if (Content >= Capacity)
        {
            OnFillUpEvent();
            filledTimes++;

            if (filledTimes % 3 == 0 && filledTimes % 2 != 0)
            {
                milestonePrompt.gameObject.SetActive(true);
            }
            else if (filledTimes % 2 == 0 && filledTimes % 3 != 0)
            {
                UpgradeButton.interactable = true;
                UpgradePool++;
                PopUpUgrade();
                UpgradePoolText.text = UpgradePool.ToString();
                UpgradeIcon.SetActive(true);
            }
            else if (filledTimes % 3 == 0 && filledTimes % 2 == 0)
            {
                UpgradeButton.interactable = true;
                UpgradePool++;
                PopUpUgrade();
                UpgradePoolText.text = UpgradePool.ToString();
                UpgradeIcon.SetActive(true);
            }
        }
    }

    void PopUpUgrade()
    {
        Instantiate(UpgradeAvailablePopUp, MainGameRect);
    }

    void OnFillUpEvent()
    {
        //Content = 0;
        //Play power up sound
    }

    public void Empty()
    {
        Content = 0;
    }

    public void IncreaseCapacity()
    {
        Capacity += 3;
    }

    public bool IsFull()
    {
        return Content >= Capacity;
    }
}
