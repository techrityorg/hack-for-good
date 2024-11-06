using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Heli : MonoBehaviour
{
    public float ropestrength;
    public float ropedamp;

    public float ropelength;
    Rigidbody2D rb;
    LineRenderer line;

    float length, lastlength;

    public Transform heli;
    public Transform Player;
    public static float vel;
    float fallVell;

    public float HoverHeight = 5;
    public float XPos;

    TrashCan tCan;

    void Start()
    {
        vel = 0;
        Player = GameObject.FindGameObjectWithTag("Player").transform;
        heli = transform.parent;

        XPos = heli.position.x;
    }

    void Update()
    {
        fallVell = Mathf.Lerp(fallVell, vel, 2 * Time.deltaTime);
    }

    float Add_X;

    private void FixedUpdate()
    {
        if (!rb)
        {
            Collider2D col = Physics2D.OverlapCircle(transform.position, 1.5f);
            if (col)
            {
                attach(col.GetComponent<Rigidbody2D>());
                tCan = col.GetComponent<TrashCan>();
            }
        }

        Vector3 pos = heli.position;

        if (rb)
        {
            pos.y = Mathf.Lerp(pos.y, HoverHeight, 2 * Time.fixedDeltaTime);

            if (Mathf.Abs((Player.position.x - Add_X) - pos.x) > 2.5)
            {
                pos.x += Mathf.Clamp((Player.position.x + Add_X) - pos.x, -2f, 2f) * (2 + Add_X * 0.5f) * Time.fixedDeltaTime;
            }
        }
        heli.position = pos;

        if (!rb) return;
        rb.simulated = true;

        lastlength = length;
        length = Vector3.Distance(rb.transform.position, transform.position);

        float speed = (lastlength - length) / Time.fixedDeltaTime;

        Vector3 dir = transform.position - rb.transform.position;

        Vector3 force = dir * ropestrength * (ropelength - length);
        Vector3 damp = dir * ropedamp * speed;

        rb.AddForce(force + damp);

        line.SetPosition(0, transform.position);
        line.SetPosition(1, rb.transform.position);

        if (tCan.IsFull())
        {
            //HoverHeight = 70;
            Add_X = 10;
            StartCoroutine(Reset());
            tCan.Empty();
        }
    }

    public void attach(Rigidbody2D _rb)
    {
        line = FindObjectOfType<LineRenderer>();
        rb = _rb;
    }

    public IEnumerator Reset()
    {
        yield return new WaitUntil(() => Mathf.Abs(heli.position.x - Player.position.x) >= Add_X * 0.95f);

        heli.position = Player.position + Vector3.up * HoverHeight + Vector3.left * Add_X;
        tCan.transform.position = heli.position + Vector3.down * length / 5;
        Add_X = 0;
        //HoverHeight = 3.5f;
        tCan.IncreaseCapacity();
    }
}
