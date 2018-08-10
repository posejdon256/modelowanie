export  function updateUVAfterNewton(confObject) {
    const { ob, u, v, uNew, vNew, backed } = confObject;
    
    let backThisTime = false;
    let crossed = false;
    let end = false;

    const eps = 0.002;
    const epsWrap = 0.001;

    let _uNew = u - (uNew * eps);
    let _vNew = v - (vNew * eps);

    if(_uNew < 0) {
       if(ob.WrappedU) {
           _uNew = ob.Height - epsWrap;
       } else {
           if(backed) {
               _uNew = 0;
               end = true;
           } else {
                backThisTime = true;      
           }
       }
       crossed = true;
    }
    if(_uNew >= ob.Height) {
       if(ob.WrappedU) {
           _uNew = 0 + epsWrap;
       } else {
           if(backed) {
               _uNew = ob.Height - epsWrap;
               end = true;
           } else {
                backThisTime = true; 
           }
       }
       crossed = true;
    }
    if(_vNew >= ob.Width) {
       if(ob.WrappedV) {
           _vNew = 0 + epsWrap;
       } else {
           if(backed) {
               _vNew = ob.Width - epsWrap;
               end = true;
           } else {
                backThisTime = true; 
           }
       }
       crossed = true;
    }
    if(_vNew < 0) {
       if(ob.WrappedV) {
           _vNew = ob.Width - epsWrap;
       } else {
           if(backed) {
                _vNew = 0;
               end = true;
           } else {
                backThisTime = true; 
           }
       }
       crossed = true;
    }
    return {u: _uNew, v: _vNew, end: end, backThisTime: backThisTime, crossed: crossed};
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