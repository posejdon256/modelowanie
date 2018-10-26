import { StartRotation, StopRoatation, TakeMouseMove } from '../Rotate/Rotate';

export default function MouseCenter(event) {
    if(event.type === 'mousedown') {
        MouseDown(event);
    } else if(event.type === 'mouseup') {
        MouseUp(event);
    } else if(event.type === 'mousemove') {
        MouseMove(event);
    }
}
function MouseDown(event) {
    switch(event.button) {
        case 0: //Left
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
            StopRoatation(false);
            break;
        case 2: //Right
            StopRoatation(true);
            break;
        default:
            break;
    }
}