using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Trash : MonoBehaviour
{
    Rigidbody2D rb;
    public Transform target;

    float Xvel;
    float YVel;

    public int contentSize;
    void Start()
    {
        target = GameObject.FindGameObjectWithTag("TrashTarget").transform;
        rb = GetComponent<Rigidbody2D>();

        float hUP = 2.5f;
        float timeUP = Mathf.Sqrt((2 * hUP) / Mathf.Abs(Physics.gravity.y));

        float hDown = hUP + (transform.position.y - target.position.y);
        float timeDown = Mathf.Sqrt((2 * hDown) / Mathf.Abs(Physics.gravity.y));

        float time = timeUP + timeDown;

        YVel = Mathf.Sqrt(2 * Mathf.Abs(Physics.gravity.y) * hUP);

        float Xdist = target.position.x - transform.position.x;
        Xvel = Xdist / time;

        rb.velocity = new Vector2(Xvel, YVel);
    }

    void Update()
    {

    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.transform.CompareTag("TrashCan"))
        {
            TrashCan trashCan = collision.transform.GetComponent<TrashCan>();
            trashCan.TakeTrash(contentSize);

            FindObjectOfType<MainController>().PlayDump();
            gameObject.SetActive(false);
        }
    }
}
