using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.InputSystem;
using TMPro;
using Cinemachine;

public class MainController : MonoBehaviour
{
    IAction action;
    //Gamelogic
    public bool gameBegan;
    public bool gameOver;
    bool canTrash;
    ushort trashDumped;
    ushort trashCollected;
    ushort maxCollectible;
    float breath;
    int streak;
    float DashOmeter;
    public AudioSource source;
    //Gamelogic

    [SerializeField] Transform headLevel;
    [SerializeField] ParticleSystem bubbles;

    [Space]
    [SerializeField] Transform directionIndicator;
    [SerializeField] float directionIndicatorDistance;
    [SerializeField] GameObject cam;
    [SerializeField] float camFollowSpeed;

    [SerializeField] Transform girlTransform;
    float yrot;

    Vector2 input;

    public float moveVel;
    public float dashVel;
    Vector3 Velocity3d;

    Rigidbody2D rb;

    [Header("Trash")]
    [SerializeField] GameObject TrashButton;
    [SerializeField] TextMeshPro trashText;
    [SerializeField] Text collectedtrashtext;
    [SerializeField] Image collectedtrashring;

    [Space]
    [SerializeField] GameObject[] trash;
    List<GameObject> allTrash;
    [SerializeField] GameObject[] corals;
    [SerializeField] GameObject trashBag;

    [Space]
    [Header("Timer")]
    [SerializeField] Text TimerText;
    [SerializeField] float Ftimer;

    [Space]
    [Header("Girl IK")]
    [SerializeField] Animator animator;
    Vector3 rightHandPos;
    Vector3 leftHandPos;

    [Space]
    [Header("Health")]
    [SerializeField] GameObject heartHolder;
    [SerializeField] Image bloodsplat;
    float postBreathTimer;
    float splatAlpha;
    int hearts = 3;

    [Space]
    [Header("UI")]
    [SerializeField] GameObject collected;
    [SerializeField] GameObject TimeUpScreen;
    [SerializeField] GameObject DeadScreen;
    [SerializeField] GameObject GameScreen;
    [SerializeField] Text Score;
    [SerializeField] Text ScoreB;
    [SerializeField] Text HighScore;
    [SerializeField] Image DashMeter;
    [SerializeField] Image breathSlider;
    [SerializeField] Slider DepthSlider;

    [SerializeField] Transform DeadlyZone;

    [Header("Dash Circle")]
    [SerializeField] Image DashCircle;
    [SerializeField] float DashRate;

    [Space]
    [Header("Cams")]
    [SerializeField] CinemachineVirtualCamera GamePlayCam;
    [SerializeField] CinemachineVirtualCamera GameOverCam;

    [Space]
    [Header("Fish")]
    [SerializeField] GameObject[] fishes;
    float fishTimer;
    float fishwait;

    [Space]
    [Header("Sounds")]

    [SerializeField] AudioClip next, prev, pickup, breathfx, dump;


    bool isPressed = false;
    private void Awake()
    {
        QualitySettings.vSyncCount = 0;
        Application.targetFrameRate = 45;

        gameBegan = false;
        gameOver = false;
    }
    void Start()
    {
        action = new IAction();
        action.Enable();

        HighScore.text = "HIGH SCORE\n" + PlayerPrefs.GetInt("HS", 0).ToString();

        source = GetComponent<AudioSource>();
        fishwait = 1;

        maxCollectible = 30;

        SpawnTrash();
        SpawnCorals();

        breath = 100;
        rb = GetComponent<Rigidbody2D>();

        Ftimer = 240;
        hearts = 3;

        GamePlayCam.gameObject.SetActive(true);
        GameOverCam.gameObject.SetActive(false);

        Time.timeScale = 1;
    }

    void Update()
    {
        maxCollectible = (ushort)PlayerAttributes.Instance.GetTrashBagCapacity();

        //dashVel -= 1f / PlayerAttributes.Instance.GetDashDuration() * Time.deltaTime;
        dashVel = Mathf.Clamp(dashVel, 0, dashVel);

        splatAlpha -= Time.deltaTime * 2f;
        splatAlpha = Mathf.Clamp(splatAlpha, 0, splatAlpha);
        Color col = bloodsplat.color;
        col.a = splatAlpha;
        bloodsplat.color = col;

        if (gameBegan)
        {
            DashOmeter += DashRate * 33.333f * Time.deltaTime;
            DashOmeter = Mathf.Clamp(DashOmeter, 0, 100);
            //DashMeter.fillAmount = DashOmeter / 100f;

            //New Dash Circle
            DashCircle.fillAmount = DashOmeter / 100f;

            Vector2 _in = action.Action.Movement.ReadValue<Vector2>();
            input = Vector3.Lerp(input, _in, 15 * Time.deltaTime);

            if (canTrash)
            {
                if (action.Action.Dump.WasPressedThisFrame() && !GameState.GamePaused)
                {
                    trashDumped += trashCollected;
                    cardboardsDumped += cardboardsCollected;
                    bottlesDumped += bottlesCollected;
                    cansDumped += cansCollected;

                    trashText.text = trashDumped.ToString();

                    if (trashCollected > 0)
                    {
                        Trash trash = Instantiate(trashBag, transform.position + Vector3.up * 1.5f, Quaternion.Euler(0, 0, Random.Range(-180, 180))).GetComponent<Trash>();
                        trash.contentSize = trashCollected;
                    }

                    trashCollected = 0;
                    cardboardsCollected = 0;
                    bottlesCollected = 0;
                    cansCollected = 0;
                }
            }

            DashRate = 1;
            dashVel = 0;


            if (action.Action.Dash.WasPressedThisFrame() && !GameState.GamePaused)
            {
                if (DashOmeter > 99)
                {
                    isPressed = true;
                }
            }

            if (action.Action.Dash.IsPressed() && !GameState.GamePaused)
            {
                if (isPressed)
                {
                    dashVel = moveVel * PlayerAttributes.Instance.GetDashSpeed();
                    DashRate = -1 * 1 / PlayerAttributes.Instance.GetDashDuration();
                }
                //if (dashVel < 0.01f && DashOmeter > 99)
                //{
                //DashOmeter = 0;
                //}
            }

            if (action.Action.Dash.WasReleasedThisFrame() && !GameState.GamePaused)
            {
                isPressed = false;
            }

            fishTimer += Time.deltaTime;
            if (fishTimer >= fishwait)
            {
                spawnFish();
                fishTimer = 0;
            }
        }
        else
        {
            input = Vector2.zero;
        }

        if (input.x > 0)
        {
            yrot = Mathf.Lerp(yrot, 180, 5 * Time.deltaTime);
        }
        else if (input.x < 0)
        {
            yrot = Mathf.Lerp(yrot, 0, 5 * Time.deltaTime);
        }

        if (gameBegan)
        {
            if (headLevel.transform.position.y < -0.1f)
            {
                breath -= 1f / PlayerAttributes.Instance.GetLungCapacity() * Time.deltaTime;
                bubbles.Emit(1);
            }
            else
            {
                if (breath < 100)
                {
                    source.Play();
                }
                breath += 100 * Time.deltaTime;
            }
            breath = Mathf.Clamp(breath, 0, 100);
        }

        if (hearts > 0)
        {
            if (breath < 0.1f)
            {
                postBreathTimer += Time.deltaTime;
                if (postBreathTimer >= 1.5f)
                {
                    hearts--;
                    postBreathTimer = 0;
                    splatAlpha = 0.75f;
                    if (hearts == 0)
                    {
                        OnHeartExhausted();
                    }
                }
            }
            else
            {
                postBreathTimer = 0;
            }
        }

        if (transform.position.y < -PlayerAttributes.Instance.GetDiveSuit())
        {
            drownTimer += Time.deltaTime;
            if (drownTimer >= 0.75f)
            {
                GetHit();
                drownTimer = 0;
            }
        }
        else
        {
            drownTimer = 0;
        }

        DepthSlider.value = -transform.position.y;
        DepthSlider.maxValue = PlayerAttributes.Instance.GetDiveSuit();

        breathSlider.fillAmount = breath / 100f;

        TimerText.text = $"{((int)(Ftimer / 60)).ToString("00")}:{((int)(Ftimer % 60)).ToString("00")}";

        collectedtrashtext.text = trashCollected.ToString() + "/" + maxCollectible.ToString();
        collectedtrashring.fillAmount = (float)trashCollected / maxCollectible;
    }

    float drownTimer = 0;

    private void OnHeartExhausted()
    {
        ScoreB.text = trashDumped.ToString();
        if (trashDumped > PlayerPrefs.GetInt("HS", 0))
        {
            PlayerPrefs.SetInt("HS", trashDumped);
        }
        gameBegan = false;
        gameOver = true;
        GameScreen.SetActive(false);
        DeadScreen.SetActive(true);
    }

    private void spawnFish()
    {
        float f = Mathf.Sign(Random.Range(-1, 1));

        float x = transform.position.x + f * (Random.Range(25, 40));
        float y = Random.Range(-1, -12);

        Fish fish = Instantiate(fishes[Random.Range(0, fishes.Length)], new Vector2(x, y), Quaternion.identity).GetComponent<Fish>();
        fish.xdir = -f;
    }

    private void FixedUpdate()
    {
        if (gameBegan)
        {
            //Ftimer -= Time.fixedDeltaTime;
            if (Ftimer < 0)
            {
                Heli.vel = 3;
                GameScreen.SetActive(false);
                TimeUpScreen.SetActive(true);
                gameBegan = false;
                gameOver = true;

                Score.text = trashDumped.ToString();
                if (trashDumped > PlayerPrefs.GetInt("HS", 0))
                {
                    PlayerPrefs.SetInt("HS", trashDumped);
                }

                GamePlayCam.gameObject.SetActive(false);
                GameOverCam.gameObject.SetActive(true);
            }
            Ftimer = Mathf.Clamp(Ftimer, 0, Ftimer);
        }

        Velocity3d = Vector3.Slerp(Velocity3d, input * moveVel, 5 * Time.deltaTime) + (Vector3)(input * dashVel);
        rb.velocity = Velocity3d;
        rb.angularVelocity = 0;
        ClampPos();
    }

    private void LateUpdate()
    {
        Vector3 swimdir = Vector3.Lerp(Vector3.up, input.normalized, input.magnitude);
        float angle = Vector2.SignedAngle(transform.up, swimdir);
        transform.rotation = Quaternion.Lerp(transform.rotation, Quaternion.AngleAxis(angle, Vector3.forward) * transform.rotation, 10 * Time.deltaTime);

        Vector3 rot = girlTransform.localEulerAngles;
        rot.y = yrot;
        girlTransform.localEulerAngles = rot;

        directionIndicator.position = transform.position + (Vector3)input * directionIndicatorDistance;
        angle = Vector2.SignedAngle(directionIndicator.right, swimdir);
        directionIndicator.rotation = Quaternion.Lerp(directionIndicator.rotation, Quaternion.AngleAxis(angle, Vector3.forward) * directionIndicator.rotation, 10 * Time.deltaTime);

        collected.transform.position = transform.position;
        int i = 0;
        foreach (Transform t in heartHolder.transform)
        {
            t.gameObject.SetActive(false);
            if (i < hearts)
            {
                t.gameObject.SetActive(true);
            }
            i++;
        }

        DeadlyZone.position = new Vector3(0, -PlayerAttributes.Instance.GetDiveSuit(), 0);

        CamFollow();
        DOIK();
    }

    private int cardboardsCollected;
    private int bottlesCollected;
    private int cansCollected;

    int cardboardsDumped;
    int bottlesDumped;
    int cansDumped;

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.transform.CompareTag("Trash"))
        {
            if (trashCollected < maxCollectible)
            {
                TrashType trashType = collision.transform.GetComponent<TrashObjects>().trashType;
                switch (trashType)
                {
                    case TrashType.CardBoard:
                        cardboardsCollected++;
                        break;
                    case TrashType.Bottle:
                        bottlesCollected++;
                        break;
                    case TrashType.Can:
                        cansCollected++;
                        break;
                    default:
                        break;
                }

                collision.gameObject.SetActive(false);
                trashCollected++;
                source.PlayOneShot(pickup, 0.2f);
                Debug.Log("Just Hit Trash");
            }
        }
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.transform.CompareTag("TrashTrigger") && GameState.GameStarted)
        {
            TrashButton.SetActive(true);
            canTrash = true;
            Debug.Log("Just Enetered Trash Trigger");
        }
    }

    private void OnTriggerExit2D(Collider2D collision)
    {
        if (collision.transform.CompareTag("TrashTrigger"))
        {
            TrashButton.SetActive(false);
            canTrash = false;
            Debug.Log("Just Exited Trash Trigger");
        }
    }

    private void DOIK()
    {
        rightHandPos = animator.GetBoneTransform(HumanBodyBones.RightHand).position;
        leftHandPos = animator.GetBoneTransform(HumanBodyBones.LeftHand).position;
        Vector3 headpos = animator.GetBoneTransform(HumanBodyBones.Head).position;

        if (rightHandPos.y > -0.1f)
        {
            float fac = rightHandPos.z - headpos.z;

            rightHandPos.y = -0.1f;
            rightHandPos.z += Mathf.Sign(fac) * 0.1f;
        }
        if (leftHandPos.y > -0.1f)
        {
            float fac = leftHandPos.z - headpos.z;

            leftHandPos.y = -0.1f;
            leftHandPos.z += Mathf.Sign(fac) * 0.1f;
        }

        IK.SetIKPosition(animator.GetBoneTransform(HumanBodyBones.RightHand), rightHandPos);
        IK.SetIKPosition(animator.GetBoneTransform(HumanBodyBones.LeftHand), leftHandPos);
    }

    void ClampPos()
    {
        Vector3 pos = transform.position;

        if (pos.y > 0) pos.y = 0;
        if (pos.y < -14) pos.y = -14;

        if (pos.x > 35) pos.x = 35;
        if (pos.x < -35) pos.x = -35;

        transform.position = pos;
    }

    void CamFollow()
    {
        cam.transform.position = Vector3.Lerp(cam.transform.position, transform.position + Vector3.forward * -10 + Vector3.up * 0.2f, camFollowSpeed * Time.deltaTime);
    }

    void SpawnTrash()
    {
        allTrash = new List<GameObject>();
        int trashNumber = Random.Range(800, 1000);
        for (int i = 0; i < trashNumber; i++)
        {
            allTrash.Add(Instantiate(trash[Random.Range(0, trash.Length)], new Vector3(Random.Range(-34f, 34f), Random.Range(-0.8f, -9.5f), 0), Quaternion.Euler(0, 0, Random.Range(-90f, 90f))));
            Rigidbody2D _rb = allTrash[i].GetComponent<Rigidbody2D>();
            _rb.mass = Random.Range(0.27f, 0.3f);
            _rb.transform.localScale = Vector3.one * Random.Range(0.75f, 1);
        }
    }

    void SpawnCorals()
    {
        List<GameObject> allcorals = new List<GameObject>();
        int coralnumber = 300;
        for (int i = 0; i < coralnumber; i++)
        {
            allcorals.Add(Instantiate(corals[Random.Range(0, corals.Length)], new Vector3(Random.Range(-45f, 45f), Random.Range(-12f, -14f), 0), Quaternion.identity));
        }
    }

    public void ToMenu()
    {
        Application.LoadLevel(Application.loadedLevel);
    }

    public void GetHit()
    {
        if (hearts <= 0) return;
        splatAlpha = 1;
        hearts--;
        if (hearts == 0)
        {
            OnHeartExhausted();
        }
    }

    public void PlayNext()
    {
        source.PlayOneShot(next);
    }

    public void PlayPrev()
    {
        source.PlayOneShot(prev);
    }

    public void PlayDump()
    {
        source.PlayOneShot(dump);
    }
}
