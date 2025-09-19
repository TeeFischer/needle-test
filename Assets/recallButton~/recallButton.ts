import { Behaviour, serializable, Camera, GameObject } from "@needle-tools/engine";

export class recallButton extends Behaviour {
    
    @serializable(Camera)
    cam?: Camera;

    @serializable(Number)
    maxDistance: number = 5;

    private recallButton: HTMLButtonElement | null = null;
    private isTooFar: boolean = false;

    private cameraPosition = { x: 0, y: 0, z: 0 };

    start() {
        // Kamera finden, falls nicht gesetzt
        if (!this.cam) {
            const cam = GameObject.findObjectOfType(Camera);
            if (cam) this.cameraPosition = cam.worldPosition;
        }

        // Button finden
        this.recallButton = document.getElementById("recall-btn") as HTMLButtonElement;
        if (this.recallButton) {
            this.recallButton.style.display = "none";
            this.recallButton.addEventListener("click", () => this.recallObject());
        }
    }

    update() {
        if (!this.cameraPosition) {
            console.log(`Keine Kamera-Position verfügbar.`);
            return;
        }

        const distance = this.gameObject.position.distanceTo(this.cameraPosition);
        console.log(`Aktuelle Distanz zur Kamera: ${distance.toFixed(2)} Meter`);

        // Button-Text aktualisieren
        if (this.recallButton) {
            this.recallButton.textContent = `Recall (${distance.toFixed(2)}m)`;
        }

        if (distance > this.maxDistance && !this.isTooFar) {
            this.isTooFar = true;
            this.showRecallButton(true);
        } else if (distance <= this.maxDistance && this.isTooFar) {
            this.isTooFar = false;
            this.showRecallButton(false);
        }
    }

    private showRecallButton(show: boolean) {
        if (this.recallButton) {
            this.recallButton.style.display = show ? "block" : "none";
        }
    }

    private recallObject() {
        if (!this.cam) return;

        const cameraForward = this.cam.forward.clone();
        const newPosition = this.cam.worldPosition.clone().add(cameraForward.multiplyScalar(1.5));
        this.gameObject.position.copy(newPosition);

        this.showRecallButton(false);
        this.isTooFar = false;
    }
}
