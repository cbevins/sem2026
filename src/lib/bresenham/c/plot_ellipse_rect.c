// https://gist.github.com/bert/1085538

void plot_ellipse_rect (int x0, int y0, int x1, int y1) {
   int a = abs (x1 - x0), b = abs (y1 - y0), b1 = b & 1; /* values of diameter */
   long dx = 4 * (1 - a) * b * b, dy = 4 * (b1 + 1) * a * a; /* error increment */
   long err = dx + dy + b1 * a * a, e2; /* error of 1.step */

   if (x0 > x1) { x0 = x1; x1 += a; } /* if called with swapped points */
   if (y0 > y1) y0 = y1; /* .. exchange them */
   y0 += (b + 1) / 2;
   y1 = y0-b1;   /* starting pixel */
   a *= 8 * a; b1 = 8 * b * b;
   do {
      setPixel (x1, y0); /*   I. Quadrant */
      setPixel (x0, y0); /*  II. Quadrant */
      setPixel (x0, y1); /* III. Quadrant */
      setPixel (x1, y1); /*  IV. Quadrant */
      e2 = 2 * err;
      if (e2 >= dx) {
         x0++;
         x1--;
         err += dx += b1;
      } /* x step */
      if (e2 <= dy) {
         y0++;
         y1--;
         err += dy += a;
      }  /* y step */ 
   } while (x0 <= x1);

   while (y0-y1 < b) {  /* too early stop of flat ellipses a=1 */
      setPixel (x0-1, y0); /* -> finish tip of ellipse */
      setPixel (x1+1, y0++); 
      setPixel (x0-1, y1);
      setPixel (x1+1, y1--); 
   }
}
