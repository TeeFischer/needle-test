import { Behaviour, serializable, Camera, GameObject } from "@needle-tools/engine";

export class recallButton extends Behaviour {
    
    @serializable(Camera)
    cam?: Camera;

    @serializable(Number)
    maxDistance: number = 5;

    @serializable(GameObject)
    objectToTeleport?: GameObject;

    start() {
        // Kamera finden, falls nicht gesetzt
        if (!this.cam) {
            const cam = GameObject.findObjectOfType(Camera);
        }
    }

    public recallObject() {
        if (!this.cam || !this.objectToTeleport) return;

        // Kamera-Richtung (nach vorne) berechnen
        const cameraForward = this.cam.forward.clone();
        // Objekt 1 Meter vor der Kamera positionieren
        const newPosition = this.cam.worldPosition.clone().add(cameraForward.multiplyScalar(1));

        // Objekt an die neue Position teleportieren
        this.objectToTeleport.position.copy(newPosition);
    }
}
