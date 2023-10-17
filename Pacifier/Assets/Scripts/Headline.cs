using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Headline : MonoBehaviour
{
    public HeadlineItem headlineItemPrefab;
    [Range(1f, 10f )]
    public float duration = 3.0f;
    public string[] fillerItems;

    float width;
    float pixelsPerSecond;
    HeadlineItem currentHeadline;


    // Start is called before the first frame update
    void Start()
    {
        width = GetComponent<RectTransform>().rect.width;
        pixelsPerSecond = width / duration;
        AddHeadlineItem(fillerItems[0]);
    }

    // Update is called once per frame
    void Update()
    {
        if(currentHeadline.GetXPosition <= - currentHeadline.GetWidth)
        {
            AddHeadlineItem(fillerItems[Random.Range(0, fillerItems.Length)]);
        }
        
    }

    void AddHeadlineItem(string message)
    {
        currentHeadline = Instantiate(headlineItemPrefab, transform);
        currentHeadline.Initialize(width, pixelsPerSecond, message);
    }






}