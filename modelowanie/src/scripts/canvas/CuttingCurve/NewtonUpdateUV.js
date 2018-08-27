// crossed:
// left -1
// right 1
// top -2
// bottom 2
export  function updateUVAfterNewton(confObject) {
    const { ob, u, v, uNew, vNew, backed } = confObject;
    
    let backThisTime = false;
    let crossed = 0;
    let end = false;

    const eps = ob.type === "torus" ? 0.0009 : 0.0009;
    const epsWrap = 0.00001;

    let _uNew = u - (uNew * eps);
    let _vNew = v - (vNew * eps);
    let _uLast = u - (uNew * eps);
    let _vLast = v - (vNew * eps);

    if(_uNew < 0) {
       if(ob.WrappedU) {
           _uNew = ob.Height - epsWrap;
           _uLast = 0;
       } else {
            _uNew = 0;
           if(backed) {
               end = true;
           } else {
                backThisTime = true;      
           }
       }
       crossed = -1;
    }
    if(_uNew >= ob.Height) {
       if(ob.WrappedU) {
           _uNew = 0 + epsWrap;
           _uLast = ob.Height - epsWrap;
       } else {
            _uNew = ob.Height - epsWrap;
           if(backed) {
               end = true;
           } else {
                backThisTime = true; 
           }
       }
       crossed = 1;
    }
    if(_vNew >= ob.Width) {
       if(ob.WrappedV) {
           _vNew = 0 + epsWrap;
           _vLast = ob.Width - epsWrap;
       } else {
            _vNew = ob.Width - epsWrap;
           if(backed) {
               end = true;
           } else {
                backThisTime = true; 
           }
       }
       crossed = 2;
    }
    if(_vNew < 0) {
       if(ob.WrappedV) {
           _vNew = ob.Width - epsWrap;
           _vLast = 0;
       } else {
            _vNew = 0;
           if(backed) {
               end = true;
           } else {
                backThisTime = true; 
           }
       }
       crossed = -2;
    }
    return {u: _uNew, v: _vNew, end: end, backThisTime: backThisTime, crossed: crossed, uLast: _uLast, vLast: _vLast};
}
export function backNewton(pointsList, uStarts, vStarts, us, vs, uPrevs, vPrevs, alpha) {

    us[0] = uStarts[0];
    us[1] = uStarts[1];

    vs[0] = vStarts[0];
    vs[1] = vStarts[1];

    uPrevs[0] = uStarts[0];
    uPrevs[1] = uStarts[1];

    vPrevs[0] = vStarts[0];
    vPrevs[1] = vStarts[1];

    return {
        pointsList: pointsList.reverse(),
        alpha: -alpha
    }
}