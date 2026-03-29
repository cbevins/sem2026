// https://gist.github.com/bert/1085538

// 'cx' and 'cy' denote the offset of the circle centre from the origin.
void circle (int cx, int cy, int radius) {
  int error = -radius;
  int x = radius;
  int y = 0;

  // The following while loop may altered to 'while (x > y)' for a
  // performance benefit, as long as a call to 'plot4points' follows
  // the body of the loop. This allows for the elimination of the
  // '(x != y') test in 'plot8points', providing a further benefit.
  //
  // For the sake of clarity, this is not shown here.
  while (x >= y) {
    plot8points (cx, cy, x, y);
    error += y;
    ++y;
    error += y;
    // The following test may be implemented in assembly language in
    // most machines by testing the carry flag after adding 'y' to
    // the value of 'error' in the previous step, since 'error'
    // nominally has a negative value.
    if (error >= 0) {
      --x;
      error -= x;
      error -= x;
    }
  }
}

// Plots a point in each of quadrants
void plot8points (int cx, int cy, int x, int y) {
  plot4points (cx, cy, x, y);
  if (x != y) plot4points (cx, cy, y, x);
}

// The '(x != 0 && y != 0)' test in the last line of this function
// may be omitted for a performance benefit if the radius of the
// circle is known to be non-zero.
void plot4points (int cx, int cy, int x, int y) {
  setPixel (cx + x, cy + y);
  if (x != 0) setPixel (cx - x, cy + y);
  if (y != 0) setPixel (cx + x, cy - y);
  if (x != 0 && y != 0) setPixel (cx - x, cy - y);
}
