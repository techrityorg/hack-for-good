using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class PauseSystem : MonoBehaviour
{

    public static bool isPaused = false;
    public GameObject pausePanel, pauseButton, TaskController, actionButton, ObjectiveButton;

    public GameController gameController;

    private void Start()
    {
        gameController = GameObject.FindObjectOfType<GameController>();
    }
    // Update is called once per frame
    void Update()
    {
        if (isPaused == false)
            Resume();

        else
            Pause();
    }

    public void Pause()
    {
        isPaused = true;
        Time.timeScale = 0f;
        pausePanel.SetActive(true);
        pauseButton.SetActive(false);
        actionButton.SetActive(false);
        ObjectiveButton.SetActive(false);
        gameController.DisableAction();
        TaskController.SetActive(false);

    }
    public void Resume()
    {
        isPaused = false;
        Time.timeScale = 1f;
        pausePanel.SetActive(!true);
        pauseButton.SetActive(!false);
        actionButton.SetActive(!false);
        ObjectiveButton.SetActive(!false);
        TaskController.SetActive(!false);

    }

    public void MainMenu()
    {
        SceneManager.LoadScene("Menu");
    }
}
