import { clearCanvas, DrawPoints, DrawCursor, Draw } from "./Draw";
import { getPoints } from "../Points/Points";
import { getTorusVisibility, getTorusVertices } from "../Torus/Torus";
import Translate, { setTranslationPoints } from "../Translation/TranslationCenter/TranslationCenter";

export default function Redraw(){
    clearCanvas();

    if(getTorusVisibility()) {
        const torus = getTorusVertices();
        setTranslationPoints(torus);  
        Draw(Translate({}));
    }
    DrawCursor();
    DrawPoints(getPoints());
}