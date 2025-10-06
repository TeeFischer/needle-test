import { Behaviour, serializable, GameObject, Time, Mathf } from "@needle-tools/engine";
import { Vector3 } from "three";

export class Montagespiel extends Behaviour {
    
    @serializable(GameObject)
    vorzeigeModell!: GameObject;   // Das animierte Original

    @serializable(GameObject)
    bauteilPrefab!: GameObject;    // Das kopierbare Bauteil

    private zielPositionen: Map<GameObject, Vector3> = new Map();

    onPointerClick() {
        this.startSpiel();
    }

    public startSpiel() {
        // 1. Vorzeigemodell ausblenden
        this.vorzeigeModell.activeSelf = false;

        // 2. Kopie des Bauteils erzeugen
        this.bauteilPrefab.activeSelf = true;

        for (const child of this.bauteilPrefab.children) {
            // Ausgabe in Konsole
            console.log(`Child '${child.name}' wurde verschoben auf`, child.position);

            const go = child as GameObject;
            const zielPos = child.position.clone();
            this.zielPositionen.set(go, zielPos);

            // Zufällige Verschiebung
            const randomOffset = new Vector3(
                Mathf.random(-1, 1),
                Mathf.random(0.5, 1.5),
                Mathf.random(-1, 1)
            );
            child.position.add(randomOffset);

            // Klick-Listener hinzufügen
            go.addEventListener("pointerdown", () => this.handleClick(go));
        }
    }

    private handleClick(obj: GameObject) {
        const ziel = this.zielPositionen.get(obj);
        if (!ziel) return;

        // Sanft zur Zielposition bewegen
        this.animateToPosition(obj, ziel);
    }

    private animateToPosition(obj: GameObject, ziel: Vector3) {
        const duration = 0.5;
        const start = obj.position.clone();
        const startTime = Time.time;

        const update = () => {
            const t = (Time.time - startTime) / duration;
            if (t >= 1) {
                obj.position.copy(ziel);
                return;
            }

            const lerped = start.clone().lerp(ziel, t);
            obj.position.copy(lerped);
            requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    }
}
