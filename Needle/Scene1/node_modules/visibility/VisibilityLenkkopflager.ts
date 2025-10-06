import { Behaviour, serializable, GameObject } from "@needle-tools/engine";


export class SetVisibilityByTagOnClick extends Behaviour {
    @serializable(GameObject)
    objectsToControl: GameObject[] = [];

    @serializable()
    toggleOnClick: boolean = true;

    @serializable()
    targetState: boolean = false;

    onPointerClick(): void {
        for (const obj of this.objectsToControl) {
            obj.visible = this.toggleOnClick ? !obj.visible : this.targetState;
        }
    }
}
