using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;
using UnityEngine.InputSystem;

[System.Serializable]
public class ToDo
{
    public Menu Next;
    public UnityEvent Event;
}

public class Menu : MonoBehaviour
{

    IAction action;
    [SerializeField] Menu PrevMenu;

    [SerializeField] List<ToDo> NextMenu;

    [SerializeField] bool canPrev;

    [SerializeField] int nextIndex;

    List<MenuButton> menuButtons;

    [SerializeField] Button backButton;

    void Start()
    {
        action = new IAction();
        action.Enable();
        nextIndex = 0;

        menuButtons = new List<MenuButton>();
        menuButtons.AddRange(gameObject.GetComponentsInChildren<MenuButton>());

        try
        {
            if (canPrev)
            {
                backButton.onClick.AddListener(
                    delegate
                    {
                        returnMenu();
                    });
            }
        }
        catch(System.Exception e)
        {
            Debug.Log(e.Message);
        }
    }

    private void OnEnable()
    {
        if (PrevMenu)
        {
            PrevMenu.gameObject.SetActive(false);
        }

        nextIndex = 0;
        if (menuButtons != null)
        {
            foreach (var item in menuButtons)
            {
                item.transform.localScale = Vector3.one;
            }
        }
    }

    void Update()
    {
        if (action.Action.Dash.IsPressed())
        {
            returnMenu();
        }
        if (action.Action.Dump.IsPressed())
        {
            proceedMenu(nextIndex);
        }

        if (NextMenu.Count < 2) return;

        if (action.Action.Up.WasPressedThisFrame())
        {
            nextIndex--;
            if (nextIndex < 0) nextIndex = NextMenu.Count - 1;
            foreach (var item in menuButtons)
            {
                item.transform.localScale = Vector3.one;
            }
        }
        else if (action.Action.Down.WasPressedThisFrame())
        {
            nextIndex++;
            nextIndex %= NextMenu.Count;
            foreach (var item in menuButtons)
            {
                item.transform.localScale = Vector3.one;
            }
        }
        menuButtons[nextIndex].transform.localScale = Vector3.Lerp(menuButtons[nextIndex].transform.localScale, Vector3.one * 1.5f, 7f * Time.deltaTime);
    }

    public void setPrevMenu(Menu _prevMenu)
    {
        PrevMenu = _prevMenu;
        PrevMenu.gameObject.SetActive(false);
    }

    public void proceedMenu(int i)
    {
        if (NextMenu.Count == 0) return;
        if (i >= NextMenu.Count) return;

        NextMenu[i].Event.Invoke();
        if (NextMenu[i].Next.canPrev)
        {
            NextMenu[i].Next.PrevMenu = this;
        }
        NextMenu[i].Next.gameObject.SetActive(true);
        gameObject.SetActive(false);
    }

    public void returnMenu()
    {
        if (!PrevMenu) return;

        PrevMenu.gameObject.SetActive(true);
        gameObject.SetActive(false);
    }

    private void OnDrawGizmos()
    {

    }
}
