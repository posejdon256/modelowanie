import { MoveToFront, MoveToLeft, MoveToRight, StopMovingLeft, StopMovingRight, MoveToTop, MoveToBack, StopMovingTop, StopMovingDown, MoveToDown, StopMovingFront, StopMovingBack } from "../Move/Move";

export default function KeyboardCenter(event) {
    if(event.type === 'keydown') {
        KeyDown(event);
    } else if(event.type === 'keyup') {
        KeyUp(event);
    }
}
function KeyDown(event) {
    switch(event.keyCode) {
        case 87: //W
            MoveToTop();
            break;
        case 83: //S
            MoveToDown();
            break;
        case 65: //A
            MoveToLeft();
            break;
        case 68: //D
            MoveToRight();
            break;
        case 70: //F
            MoveToFront();
            break;
        case 66: //B
            MoveToBack();
            break;
        default:
            break;
    }
}
function KeyUp(event) {
    switch(event.keyCode) {
        case 87: //W
            StopMovingTop();
            break;
        case 83: //S
            StopMovingDown();
            break;
        case 65: //A
            StopMovingLeft();
            break;
        case 68: //D
            StopMovingRight();
            break;
        case 70: //F
            StopMovingFront();
            break;
        case 66: //B
            StopMovingBack();
            break;
        default:
            break;
    }
}