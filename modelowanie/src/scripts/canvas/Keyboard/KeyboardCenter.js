import { MoveToFront, MoveToLeft, MoveToRight, StopMovingLeft, StopMovingRight, MoveToTop, MoveToBack, StopMovingTop, StopMovingDown, MoveToDown, StopMovingFront, StopMovingBack } from "../Move/Move";
import { MoveToFrontMill, MoveToBackMill, MoveToDownMill, MoveToLeftMill, MoveToRightMill, MoveToTopMill, StopMovingDownMill, StopMovingBackMill, StopMovingFrontMill, StopMovingTopCursor, StopMovingLeftMill, StopMovingRightMill, StopMovingTopMill} from '../Move/MoveMill';
import { addPointWithRedraw } from "../Points/Points";
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
        case 80: //P
            MoveToTopMill()
            break;
        case 76: //L
            MoveToLeftMill();
            break;
        case 186: //;
            MoveToDownMill();
            break;
        case 222: //'
            MoveToRightMill()
            break;
        case 32: //space
            //createSurface("C0");
            addPointWithRedraw();
            event.preventDefault();
            break;
        case 38: //up
            MoveToFrontMill();
            event.preventDefault();
            break;
        case 40: //down
            MoveToBackMill();
            event.preventDefault();
            break;
        default:
            break;
    }
}
function KeyUp(event) {
    switch(event.keyCode) {
        case 87: //W
            StopMovingTop();
            event.preventDefault();
            break;
        case 83: //S
            StopMovingDown();
            event.preventDefault();
            break;
        case 65: //A
            StopMovingLeft();
            event.preventDefault();
            break;
        case 68: //D
            StopMovingRight();
            event.preventDefault();
            break;
        case 70: //F
            StopMovingFront();
            event.preventDefault();
            break;
        case 66: //B
            StopMovingBack();
            event.preventDefault();
            break;
        case 80: //P
            StopMovingTopMill();
            event.preventDefault();
            break;
        case 76: //L
            StopMovingLeftMill();
            event.preventDefault();
            break;
        case 186: //;
            StopMovingDownMill();
            event.preventDefault();
            break;
        case 222: //'
            StopMovingRightMill();
            event.preventDefault();
            break;
        case 38: //up
            StopMovingFrontMill();
            event.preventDefault();
            break;
        case 40: //down
            StopMovingBackMill();
            event.preventDefault();
            break;
        default:
            break;
    }
}