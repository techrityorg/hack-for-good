using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class HeadlineItem : MonoBehaviour
{
    float tickerWidth;
    float pixelsPerSecond;
    public RectTransform rt;

    public float GetXPosition { get { return rt.anchoredPosition.x; } }
    public float GetWidth { get { return rt.rect.width; } }

    // Start is called before the first frame update
    public void Initialize(float tickerWidth, float pixelsPerSecond, string message)
    {
        this.tickerWidth = tickerWidth;
        this.pixelsPerSecond = pixelsPerSecond;
        rt = GetComponent<RectTransform>();
        GetComponent<Text>().text = message + " ... ";

    }

    // Update is called once per frame
    void Update()
    {
        rt.position += Vector3.left * pixelsPerSecond * Time.deltaTime;
        if (GetXPosition <= 0 - tickerWidth - GetWidth)
        {
            Destroy(gameObject);
        }
    }
}
