using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UpgradeScreen : MonoBehaviour
{
    [SerializeField] List<Button> buttons;
    [SerializeField] List<GameObject> hints;

    private void OnEnable()
    {
        Time.timeScale = 0;

        foreach (var item in buttons)
        {
            item.gameObject.SetActive(false);
        }

        foreach (var item in hints)
        {
            item.gameObject.SetActive(false);
        }

        int a = Random.Range(0, buttons.Count);
        while (a == 1)
        {
            a = Random.Range(0, buttons.Count);
        }

        int b = Random.Range(0, buttons.Count);
        while (b == a)
        {
            b = Random.Range(0, buttons.Count);
        }

        buttons[a].gameObject.SetActive(true);
        buttons[b].gameObject.SetActive(true);
        buttons[1].gameObject.SetActive(true);

        hints[a].SetActive(true);
        hints[b].SetActive(true);
        hints[1].SetActive(true);
    }

    private void OnDisable()
    {
        Time.timeScale = 1;
    }
    void Start()
    {
        foreach (var item in buttons)
        {
            item.onClick.AddListener(delegate
            {
                TrashCan.UpgradePool--;
                if (TrashCan.UpgradePool <= 0) gameObject.SetActive(false);
            });
        }
    }

    void Update()
    {

    }
}
