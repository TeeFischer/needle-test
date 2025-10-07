import { Behaviour } from "@needle-tools/engine";

export class ReloadButton extends Behaviour {
    onPointerClick() {
        console.log("🔄 Seite wird neu geladen...");
        window.location.reload();
    }
}
