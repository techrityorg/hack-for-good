using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviour
{
    public GameObject TopContainer, BottomContainer, PlayContainer;

    private const string MAINSCENE = "MAIN 1";
    private void Start()
    {
        Time.timeScale = 1f;
    }
    public void Play()
    {
        TopContainer.SetActive(false);
        BottomContainer.SetActive(false);
        PlayContainer.SetActive(true);

    }

    public void Back()
    {
        TopContainer.SetActive(true);
        BottomContainer.SetActive(true);
        PlayContainer.SetActive(false);

    }

    public void NewGame()
    {
        SceneManager.LoadScene(MAINSCENE);
        PlayerPrefs.DeleteAll();
    }

    public void LoadGame()
    {
        SceneManager.LoadScene(MAINSCENE);
    }


}
