using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;

public class GameState : MonoBehaviour
{
    IAction action;

    public static bool GamePaused;
    public static bool GameStarted;

    [SerializeField] Button PauseButton;
    [SerializeField] Button ResumeButton;

    [SerializeField] UnityEvent OnPauseEvent;
    [SerializeField] UnityEvent OnResumeEvent;

    [SerializeField] GameObject TutorialScreen;

    void Start()
    {
        action = new IAction();
        action.Enable();

        PauseButton.onClick.AddListener( delegate
        {
            PauseGame();
        });

        ResumeButton.onClick.AddListener(delegate
        {
            ResumeGame();
        });
    }

    void Update()
    {
        if (action.Action.Pause.WasPressedThisFrame())
        {
            if (GamePaused)
            {
                ResumeGame();
            }
            else
            {
                PauseGame();
            }
        }
    }

    public void StartGame()
    {
        GameStarted = true;
        FindObjectOfType<MainController>().gameBegan = true;

        TutorialScreen.SetActive(true);

        Debug.Log("Game started");
    }

    public void EndGame()
    {
        Application.LoadLevel(Application.loadedLevel);
        GameStarted = false;
    }
    public void PauseGame()
    {
        if (!GameStarted) return;

        Time.timeScale = 0;
        GamePaused = true;
        OnPauseEvent.Invoke();
    }

    public void ResumeGame()
    {
        if (!GameStarted) return;

        Time.timeScale = 1;
        GamePaused = false;
        OnResumeEvent.Invoke();
    }

    public void Quit()
    {
        Application.Quit();
    }
}
