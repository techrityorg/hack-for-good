using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Shark : MonoBehaviour
{
    public float MoveSpeed = 5;
    public float TargetAngle;
    public float limits = 50;
    float angle;

    Vector3 moveDir;

    bool attacking;

    public Transform target;

    void Start()
    {
        transform.position += Vector3.right * Random.Range(-10f, 10f);
    }

    void Update()
    {

    }

    private void FixedUpdate()
    {
        if (!GameState.GameStarted)
        {
            return;
        }

        float vel = 0;
        angle = TargetAngle;

        moveDir.x = Mathf.Cos(TargetAngle * Mathf.Rad2Deg);
        moveDir.y = Mathf.Sin(TargetAngle * Mathf.Rad2Deg);

        transform.GetChild(0).localEulerAngles = new Vector3(transform.right.x >= 0 ? 0 : 180, 0, 0);

        float angularDeviation = angle - Vector2.SignedAngle(Vector3.right, transform.right);
        transform.Rotate(0, 0, angularDeviation);

        transform.position += transform.right * MoveSpeed * Time.deltaTime;

        if (transform.position.x >= limits)
        {
            transform.position += Vector3.left;
            TargetAngle = 180;
        }
        else if (transform.position.x <= -limits)
        {
            transform.position += Vector3.right;
            TargetAngle = 0;
        }

        Vector3 pos = transform.position;
        pos.y = Mathf.Clamp(pos.y, -30, -3);
        transform.position = pos;
    }

    private void OnCollisionEnter2D(Collision2D other)
    {
        if (other.transform.CompareTag("Player"))
        {
            MainController mainC = other.transform.GetComponent<MainController>();
            mainC.GetHit();
        }
    }
}