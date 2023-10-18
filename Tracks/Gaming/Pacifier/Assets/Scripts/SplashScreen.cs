using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class SplashScreen : MonoBehaviour
{
    public float splashScreenDuration = 3.0f;
    public string nextSceneName = "Menu";

    public Image splashImage;
    private float timer;
    private bool isFadingOut;
    private float fadeDuration = 1.0f;

    void Start()
    {
        // splashImage = GetComponent<Image>();
        splashImage.canvasRenderer.SetAlpha(0);
        timer = 0.0f;
        isFadingOut = false;
    }

    void Update()
    {
        timer += Time.deltaTime;

        if (timer < fadeDuration)
        {
            float alpha = Mathf.Lerp(0, 1, timer / fadeDuration);
            splashImage.CrossFadeAlpha(alpha, 0.1f, false);
        }

        if (timer >= splashScreenDuration - fadeDuration && !isFadingOut)
        {
            isFadingOut = true;
            StartCoroutine(FadeOut());
        }

        if (timer >= splashScreenDuration)
        {
            LoadNextScene();
        }
    }

    IEnumerator FadeOut()
    {
        float startTime = Time.time;
        float startAlpha = splashImage.canvasRenderer.GetAlpha();

        while (Time.time - startTime < fadeDuration)
        {
            float alpha = Mathf.Lerp(startAlpha, 0, (Time.time - startTime) / fadeDuration);
            splashImage.CrossFadeAlpha(alpha, 0.1f, false);
            yield return null;
        }
    }

    void LoadNextScene()
    {
        SceneManager.LoadScene(nextSceneName);
    }
}
