// https://gist.github.com/bert/1085538

void plot_circle (int xm, int ym, int r) {
   int x = -r, y = 0, err = 2-2*r; /* II. Quadrant */ 
    do {
        setPixel (xm-x, ym+y); /*   I. Quadrant */
        setPixel (xm-y, ym-x); /*  II. Quadrant */
        setPixel (xm+x, ym-y); /* III. Quadrant */
        setPixel (xm+y, ym+x); /*  IV. Quadrant */
        r = err;
        if (r >  x) err += ++x*2+1; /* e_xy+e_x > 0 */
        if (r <= y) err += ++y*2+1; /* e_xy+e_y < 0 */
    } while (x < 0);
}