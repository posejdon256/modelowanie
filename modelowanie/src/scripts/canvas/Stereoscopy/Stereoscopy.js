import { setStereoscopyTranslation } from "../Translation/TranslationCenter/TranslationCenter";

let stereoscopy = false;
export function setStereoscopy(_stereoscopy) {
    setStereoscopyTranslation(_stereoscopy);
    stereoscopy = _stereoscopy;
}
export function getStereoscopy() {
    return stereoscopy;
}