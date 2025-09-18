import { Behaviour, serializable, GameObject } from "@needle-tools/engine";

export class VisibilityLenkkopflager extends Behaviour {

    @serializable()
    tagToControl: string = "HideLenkkopflager";

    /**
     * Setzt alle Objekte mit dem gegebenen Tag sichtbar oder unsichtbar.
     * @param visible True = sichtbar, False = unsichtbar
     */
    public setVisible(visible: boolean) {
        // Alle Objekte mit dem gewünschten Tag finden
        const targets = GameObject.findWithTag(this.tagToControl);
        for (const obj of targets) {
            obj.activeSelf = visible;
        }
    }
}
