// https://gist.github.com/bert/1085538
void plot_basic_bezier (int x0, int y0, int x1, int y1, int x2, int y2) {                            
    int sx = x0 < x2 ? 1 : -1;
    int sy = y0 < y2 ? 1 : -1; /* step direction */
    int cur = sx * sy *((x0 - x1) * (y2 - y1) - (x2 - x1) * (y0 - y1)); /* curvature */
    int x = x0 - 2 * x1 + x2, y = y0 - 2 * y1 +y2, xy = 2 * x * y * sx * sy;
    
    /* compute error increments of P0 */
    long dx = (1 - 2 * abs (x0 - x1)) * y * y + abs (y0 - y1) * xy - 2 * cur * abs (y0 - y2);
    long dy = (1 - 2 * abs (y0 - y1)) * x * x + abs (x0 - x1) * xy + 2 * cur * abs (x0 - x2);
    
    /* compute error increments of P2 */
    long ex = (1 - 2 * abs (x2 - x1)) * y * y + abs (y2 - y1) * xy + 2 * cur * abs (y0 - y2);
    long ey = (1 - 2 * abs (y2 - y1)) * x * x + abs (x2 - x1) * xy - 2 * cur * abs (x0 - x2);
    
    /* sign of gradient must not change */
    assert ((x0 - x1) * (x2 - x1) <= 0 && (y0 - y1) * (y2 - y1) <= 0); 
    
    /* straight line */
    if (cur == 0) {
        plotLine (x0, y0, x2, y2);
        return;
    }
    x *= 2 * x;
    y *= 2 * y;

    /* negated curvature */
    if (cur < 0) {
        x = -x;
        dx = -dx;
        ex = -ex;
        xy = -xy;
        y = -y;
        dy = -dy;
        ey = -ey;
    }
    /* algorithm fails for almost straight line, check error values */
    if (dx >= -y || dy <= -x || ex <= -y || ey >= -x) {        
        plotLine (x0, y0, x1, y1); /* simple approximation */
        plotLine (x1, y1, x2, y2);
        return;
    }
    dx -= xy;
    ex = dx + dy;
    dy -= xy; /* error of 1.step */

    /* plot curve */
    for (;;) {
        setPixel (x0, y0);
        ey = 2 * ex - dy; /* save value for test of y step */
        /* x step */
        if (2 * ex >= dx) {
            if (x0 == x2) break;
            x0 += sx;
            dy -= xy;
            ex += dx += y; 
            }
        /* y step */
        if (ey <= 0) {
            if (y0 == y2) break;
            y0 += sy;
            dx -= xy;
            ex += dy += x; 
        }
    }
}  
