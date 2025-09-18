using UnityEngine;
using UnityEngine.UI;

public class RecallIfTooFar : MonoBehaviour
{
    public Transform cameraTransform;     // Zuweisung der Kamera (z. B. AR-Kamera)
    public float maxDistance = 5f;        // Maximale Entfernung bevor der Button erscheint
    public Button recallButton;           // UI-Button im Canvas

    private bool isTooFar = false;

    void Start()
    {
        if (cameraTransform == null)
            cameraTransform = Camera.main.transform;

        if (recallButton != null)
        {
            recallButton.gameObject.SetActive(false);
            recallButton.onClick.AddListener(RecallObject);
        }
    }

    void Update()
    {
        float distance = Vector3.Distance(transform.position, cameraTransform.position);

        if (distance > maxDistance && !isTooFar)
        {
            isTooFar = true;
            ShowRecallButton(true);
        }
        else if (distance <= maxDistance && isTooFar)
        {
            isTooFar = false;
            ShowRecallButton(false);
        }
    }

    void ShowRecallButton(bool show)
    {
        if (recallButton != null)
            recallButton.gameObject.SetActive(show);
    }

    void RecallObject()
    {
        Vector3 newPosition = cameraTransform.position + cameraTransform.forward * 1.5f;
        transform.position = newPosition;

        // Optional: Rotation anpassen
        transform.rotation = Quaternion.LookRotation(transform.position - cameraTransform.position);

        ShowRecallButton(false);
        isTooFar = false;
    }
}
