import { setStereoscopyDraw } from "../Draw/Draw";
import { setStereoscopyTranslation } from "../Translation/TranslationCenter/TranslationCenter";

export function setStereoscopy(stereoscopy) {
    setStereoscopyDraw(stereoscopy);
    setStereoscopyTranslation(stereoscopy);
}