/** This is the function from Desmos in WebGL */
export default `
  vec2 curlPlane(float x, float s, float r, float k, bool flip) {
    float v1 = flip ? s*k : s - s*k;
    float n1 = s > 0.0 ? 1.0 : -1.0;

    // threshold before going into the circle coords, because if r is 0, it
    // will return infinity, and causes a short flicker, so we prevent that
    // by setting a small non-noticable threshold
    float t1 = 0.01;

    // start and endpoints of the plane before or after the curl
    float e1 = flip ? n1*v1 : n1*x;
    float e2 = flip ? n1*x : n1*v1;
    
    // older gpus have troubles with "or operators" in the shader
    // so we split it in two conditions instead
    if (r <= t1) {
      return vec2(x, 0.0);
    }

    if (e1 <= e2) {
      return vec2(x, 0.0);
    }

    float r2 = abs(s) / r;
    float hp = 1.5707963;

    // Transform the point on the plane to the point
    // on the new arc connected to the plane
    return vec2(
      v1/r2 + cos(x/r2 - hp - v1/r2),
      -sin(x/r2 + hp - v1/r2) + 1.0
    ) * r2;
  }
`;
