import { clearCanvas, DrawPoints, DrawCursor } from "./Draw";
import { getPoints } from "../Points/Points";

export default function Redraw(){
    clearCanvas();
    DrawCursor();
    DrawPoints(getPoints());
}