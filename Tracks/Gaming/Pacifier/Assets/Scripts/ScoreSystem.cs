using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class ScoreSystem : MonoBehaviour
{
    public int score;
    public TextMeshProUGUI scoreText;

    const string SAVED_SCORE = "SavedScore";
    private int totalScore;

    // Start is called before the first frame update
    void Start()
    {
        // PlayerPrefs.DeleteAll();
        totalScore = PlayerPrefs.GetInt(SAVED_SCORE);
        UpdateScoreText(); // Call this to initialize the score text.
    }

    // Function to update the score text
    void UpdateScoreText()
    {
        scoreText.text = $"{totalScore} / 1000";
    }

    // Function to update the score based on an action
    public void UpdateScore(int changeAmount)
    {
        totalScore += changeAmount;
        PlayerPrefs.SetInt(SAVED_SCORE, totalScore);
        UpdateScoreText(); // Update the score text after changing the score.
    }
}
