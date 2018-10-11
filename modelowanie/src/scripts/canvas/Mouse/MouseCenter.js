import { StartRotation, StopRoatation, TakeMouseMove } from "../Rotate/Rotate";
import { selectPoints } from "./SelectPoint";
import { getCanvas } from "../Draw/Draw";
import { getRectangleSelectionRectangle, setStartSelectionRectangle, selectPointsByRectangle } from "./RectangleSelect";

export default function MouseCenter(event, refresh) {
    if(event.type === 'mousedown') {
        MouseDown(event);
    } else if(event.type === 'mouseup') {
        MouseUp(event);
        refresh();
    } else if(event.type === 'mousemove') {
        MouseMove(event);
    }
}
function MouseDown(event) {
    switch(event.button) {
        case 0: //Left
            if(getRectangleSelectionRectangle()){
                const rect = getCanvas().getBoundingClientRect();
                setStartSelectionRectangle(event.clientX - rect.left, event.clientY - rect.top);
                break;
            }
            StartRotation(event.clientX, event.clientY);
            break;
        case 2: //Right
            StartRotation(event.clientX, event.clientY, true);
            break;
        default:
            break;
    }
}
function MouseMove(event) {
    TakeMouseMove(event.clientX, event.clientY);
}
function MouseUp(event) {
    StopRoatation();
    switch(event.button) {
        case 0: //Left
            const rect = getCanvas().getBoundingClientRect();
            if(getRectangleSelectionRectangle()){
                selectPointsByRectangle(event.clientX - rect.left, event.clientY - rect.top);
                break;
            }
            selectPoints(event.clientX - rect.left, event.clientY - rect.top);
            StopRoatation(false);
            break;
        case 2: //Right
            StopRoatation(true);
            break;
        default:
            break;
    }
}