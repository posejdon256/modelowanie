import { OpenGLDrawScene } from './OpenGL/DrawOpengl';


export default function Redraw(){

    OpenGLDrawScene(true);

}
export function RedrawWithoutChangingScene() {

    OpenGLDrawScene();
    
}