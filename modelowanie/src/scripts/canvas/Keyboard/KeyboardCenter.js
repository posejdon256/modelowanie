import { MoveToFront, MoveToLeft, MoveToRight, StopMovingLeft, StopMovingRight, MoveToTop, MoveToBack, StopMovingTop, StopMovingDown, MoveToDown, StopMovingFront, StopMovingBack } from "../Move/Move";
import { MoveToFrontCursor, MoveToLeftCursor, MoveToTopCursor, MoveToDownCursor, MoveToRightCursor, StopMovingLeftCursor, StopMovingDownCursor, StopMovingRightCursor, StopMovingTopCursor, MoveToBackCursor, StopMovingFrontCursor, StopMovingBackCursor, RemoveCatchPoint, CatchPoint } from '../Move/MoveCursor';
import { addPoint } from "../Points/Points";
export default function KeyboardCenter(event, refresh) {
    if(event.type === 'keydown') {
        KeyDown(event);
    } else if(event.type === 'keyup') {
        KeyUp(event);
        refresh();
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
        case 80: //P
            MoveToTopCursor()
            break;
        case 76: //L
            MoveToLeftCursor();
            break;
        case 186: //;
            MoveToDownCursor();
            break;
        case 222: //'
            MoveToRightCursor()
            break;
        case 32: //space
            addPoint();
            event.preventDefault();
            break;
        case 38: //up
            MoveToFrontCursor();
            event.preventDefault();
            break;
        case 40: //down
            MoveToBackCursor();
            event.preventDefault();
            break;
        case 72: //H
            CatchPoint();
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
        case 80: //P
            StopMovingTopCursor();
            break;
        case 76: //L
            StopMovingLeftCursor();
            break;
        case 186: //;
            StopMovingDownCursor();
            break;
        case 222: //'
            StopMovingRightCursor();
            break;
        case 38: //up
            StopMovingFrontCursor();
            event.preventDefault();
            break;
        case 40: //down
            StopMovingBackCursor();
            event.preventDefault();
            break;
        case 72: //H
            RemoveCatchPoint();
            break;
        default:
            break;
    }
}