import { Behaviour, serializable, GameObject, Time, Mathf } from "@needle-tools/engine";
import { Vector3 } from "three";
import { Text } from "@needle-tools/engine"; // Standard-UI-Text-Komponente

export class Montagespiel extends Behaviour {
    
    @serializable(GameObject)
    vorzeigeModell!: GameObject;   // Das animierte Original

    @serializable(GameObject)
    bauteilPrefab!: GameObject;    // Das kopierbare Bauteil

    @serializable(GameObject)
    ergebnisCanvas!: GameObject;

    @serializable(GameObject)
    ergebnisText!: GameObject;

    private zielPositionen: Map<GameObject, Vector3> = new Map();

    private currentIndex: number = 1; // Start bei "1"
    private totalParts: number = 0;   // Gesamtanzahl der zu bewegenden Objekte
    private errors: number = 0;       // Fehlerzähler (optional)

    private gameStart = 0; // Startzeitpunkt in Sekunden
    private gameEnd = 0;   // End-Zeitpunkt in Sekunden
    private gameTime = 0; 

    myTime = new Time();

    onPointerClick() {
        this.startSpiel();
    }

    public startSpiel() {
        // 1. Vorzeigemodell ausblenden
        this.vorzeigeModell.activeSelf = false;

        // 2. Kopie des Bauteils erzeugen
        this.bauteilPrefab.activeSelf = true;

        // 3. Kinder des Bauteils verschieben
        for (const child of this.bauteilPrefab.children) {
            // Nur Kinder mit Namen, die mit Zahl beginnen
            //if (!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].some(d => child.name.startsWith(d))) continue; 
            if (!["1", "2", "3", "4", "5", "6", "7", "8", "9"].some(d => child.name.startsWith(d))) continue;

            // Ausgabe in Konsole
            console.log(`Child '${child.name}' wurde verschoben auf`, child.position);
            this.totalParts++;

            const go = child as GameObject;
            const zielPos = child.position.clone();
            this.zielPositionen.set(go, zielPos);

            // Zufällige Verschiebung
            const randomOffset = new Vector3(
                Mathf.random(0, 0.2),
                Mathf.random(0.1, 0.5),
                Mathf.random(-0.2, -1)
            );  // Richtungen -/+ (rein/raus, hoch/runter, links/rechts)
            child.position.add(randomOffset);

            // Klick-Action hinzufügen
            const clickHandler = go.addComponent(ClickHandler);
            clickHandler.onClick = () => this.handleClick(go);
        }

        // Whiteboard und UI anzeigen
        this.ergebnisCanvas.activeSelf = true;
        const textComponent = this.ergebnisText.getComponent(Text);
        if (textComponent) {
            textComponent.text = `Fortschritt: 0 %\nFehler: ${this.errors}`;
        }
        // Startzeuit bestimmen
        this.gameStart = performance.now();
    }

    /// Diese Funktion wird aufgerufen wenn eins der Bauteile angeklickt wird.
    private handleClick(obj: GameObject) {
        if (this.gameEnd != 0) {
            // Spiel ist zuende
            return;
        }

        // Extrahiere führende Zahl aus dem Namen (z.B. "3_Schraube")
        const match = obj.name.match(/^(\d+)/);
        if (!match) {
            console.log(`Ungültiger Name: '${obj.name}'`);
            return;
        }

        const nummer = parseInt(match[1]);

        // Nur das aktuell erlaubte Objekt darf geklickt werden
        if (nummer !== this.currentIndex) {
            console.log(`Falsches Teil! Erwartet: ${this.currentIndex}, aber geklickt: ${nummer}`);
            this.errors++;
            // Zwischenstand Anzeigen
            const fortschritt = (this.currentIndex -1 )*100 /this.totalParts;

            const textComponent = this.ergebnisText.getComponent(Text);
            if (textComponent) {
                textComponent.text = `Fortschritt: ${fortschritt.toFixed(0)} %\nFehler: ${this.errors}`;
            }
            return;
        }

        // Teste ob das Objekt ein Ziel hat
        const ziel = this.zielPositionen.get(obj);
        if (!ziel) {
            console.log(`Child '${obj}' hat kein Ziel`);
            return;
        }

        // Objekt zur Zielposition bewegen
        obj.position.copy(ziel);
        console.log(`Bewege N°${this.currentIndex} of ${this.totalParts} '${obj}' zum Ziel`, ziel, );

        this.currentIndex++;

        // Spielende
        if (this.currentIndex > this.totalParts) {
            this.gameEnd = performance.now();

            this.gameTime = (this.gameEnd - this.gameStart) /1000;
            console.log("🎉 Alle Teile korrekt platziert! Spielzeit:", this.gameTime);

            // Text setzen
            const textComponent = this.ergebnisText.getComponent(Text);
            if (textComponent) {
                textComponent.text = `Spielzeit: ${this.gameTime.toFixed(2)} Sekunden\nFehler: ${this.errors}`;
            }
        } else{
            // Zwischenstand Anzeigen
            const fortschritt = (this.currentIndex -1 )*100 /this.totalParts;

            const textComponent = this.ergebnisText.getComponent(Text);
            if (textComponent) {
                textComponent.text = `Fortschritt: ${fortschritt.toFixed(0)} %\nFehler: ${this.errors}`;
            }
        }
    }
}

class ClickHandler extends Behaviour {
    onClick?: () => void;

    onPointerDown() {
        if (this.onClick) this.onClick();
    }
}