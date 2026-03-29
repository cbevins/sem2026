// https://gist.github.com/bert/1085538
/*
So. When we compare sum of N odd numbers to this algorithm we have.
    ddF_y = -2 * radius     is connected to last member of sum of N odd numbers.
                            This member has index equal to value of radius (integral). 
                            Since odd number is 2*n + 1 there is 1 handled elsewhere
                            or it should be -2*radius - 1
    ddF_x = 0               should be 1. Because difference between two consecutive odd numbers is 2.
                            If so f += ddF_y + 1 is f+= ddF_y. Saving one operation.
    f = - radius + 1        Initial error equal to half of "bigger" step. 
                            In case of saving one addition it should be either -radius or -radius + 2.

In any case there should be addition of 1 driven out of outer loop. So...
    f += ddF_y              Adding odd numbers from Nth to 1st. 
    f += ddF_x              Adding odd numbers from 1st to Nth. 1 is missing because it can be moved outside of loop.
*/
void raster_circle (int x0, int y0, int radius) {
    int f = 1 - radius;
    int ddF_x = 1;
    int ddF_y = -2 * radius;
    int x = 0;
    int y = radius;

    setPixel (x0, y0 + radius);
    setPixel (x0, y0 - radius);
    setPixel (x0 + radius, y0);
    setPixel (x0 - radius, y0);
    while (x < y) {
        // ddF_x == 2 * x + 1;
        // ddF_y == -2 * y;
        // f == x*x + y*y - radius*radius + 2*x - y + 1;
        if (f >= 0) {
            y--;
            ddF_y += 2;
            f += ddF_y;
        }
        x++;
        ddF_x += 2;
        f += ddF_x;    
        setPixel (x0 + x, y0 + y);
        setPixel (x0 - x, y0 + y);
        setPixel (x0 + x, y0 - y);
        setPixel (x0 - x, y0 - y);
        setPixel (x0 + y, y0 + x);
        setPixel (x0 - y, y0 + x);
        setPixel (x0 + y, y0 - x);
        setPixel (x0 - y, y0 - x);
    }
}
