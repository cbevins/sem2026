
//------------------------------------------------------------------------------
/*! \brief Calculates the probability of a firebrand starting a fire.
 *
 *  \param fuelTemperature  Dead surface fuel temperature (oF).
 *  \param fuelMoisture     Dead surface fuel moisture content (lb/lb).
 *
 *  \return Probability of a firebrand starting a fire [0..1].
 */

double FBL_SurfaceFireFirebrandIgnitionProbability( double fuelTemperature,
                double fuelMoisture )
{
    double fuelTemp = ( fuelTemperature - 32. ) * 5. / 9.;
    double qign = 144.51
                - 0.26600 * fuelTemp
                - 0.00058 * fuelTemp * fuelTemp
                - fuelTemp * fuelMoisture
                + 18.5400 * ( 1. - exp( -15.1 * fuelMoisture ) )
                + 640.000 * fuelMoisture;
    if ( qign > 400.0 )
    {
        qign = 400.;
    }

    double x = 0.1 * ( 400. - qign );
    double prob = ( 0.000048 * pow( x, 4.3 ) ) / 50.;
    if ( prob > 1.0 )
    {
        prob = 1.0;
    }
    else if ( prob < 0. )
    {
        prob = 0.0;
    }
    return( prob );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the probability of a lightning strike starting a fire.
 *
 *  \param fuelType Ignition fuel bed type:
 *                      0 == Ponderosa Pine Litter
 *                      1 == Punky wood, rotten, chunky
 *                      2 == Punky wood powder, deep (4.8 cm)
 *                      3 == Punk wood powder, shallow (2.4 cm)
 *                      4 == Lodgepole pine duff
 *                      5 == Douglas-fir duff
 *                      6 == High altitude mixed (mainly Engelmann spruce)
 *                      7 == Peat moss (commercial)
 *  \param depth    Ignition fuel bed depth (inches).
 *  \param moisture Ignition fuel moisture content (lb/lb).
 *  \param charge   Lightning charge:
 *                      0 == negative,
 *                      1 == positive,
 *                      2 == unknown
 *
 *  \note  The following assumptions are made by Latham:
 *      - 20% of negative flashes have continuing current
 *      - 90% of positive flashes have continuing current
 *      - Latham and Schlieter found a relative frequency of
 *          0.723 negative and 0.277 positive strikes
 *      - Unknown strikes are therefore p = 0.1446 neg + 0.2493 pos
 *
 *  \return Probability of the lightning strike starting a fire [0..1].
 */

double FBL_SurfaceFireLightningIgnitionProbability( int fuelType, double depth,
            double moisture, int charge )
{
    // Probability of continuing current by charge type (Latham)
    static const double ccNeg = 0.2;
    static const double ccPos = 0.9;

    // Relative frequency by charge type (Latham and Schlieter)
    static const double freqNeg = 0.723;
    static const double freqPos = 0.277;

    // Convert duff depth to cm and restrict to maximum of 10 cm.
    depth *= 2.54;
    if ( depth > 10. )
    {
        depth = 10.;
    }
    // Convert duff moisture to percent and restrict to maximum of 40%.
    moisture *= 100.;
    if ( moisture > 40. )
    {
        moisture = 40.;
    }
    // Ponderosa Pine Litter
    double pPos = 0.;
    double pNeg = 0.;
    double prob = 0.;
    if ( fuelType == 0 )
    {
        pPos = 0.92 * exp( -0.087 * moisture );
        pNeg = 1.04 * exp( -0.054 * moisture );
    }
    // Punky wood, rotten, chunky
    else if ( fuelType == 1 )
    {
        pPos = 0.44 * exp( -0.110 * moisture );
        pNeg = 0.59 * exp( -0.094 * moisture );
    }
    // Punky wood powder, deep (4.8 cm)
    else if ( fuelType == 2 )
    {
        pPos = 0.86 * exp( -0.060 * moisture );
        pNeg = 0.90 * exp( -0.056 * moisture );
    }
    // Punk wood powder, shallow (2.4 cm)
    else if ( fuelType == 3 )
    {
        pPos = 0.60 - ( 0.011 * moisture );
        pNeg = 0.73 - ( 0.011 * moisture );
    }
    // Lodgepole pine duff
    else if ( fuelType == 4 )
    {
        pPos = 1. / ( 1. + exp( 5.13 - 0.68 * depth ) );
        pNeg = 1. / ( 1. + exp( 3.84 - 0.60 * depth ) );
    }
    // Douglas-fir duff
    else if ( fuelType == 5 )
    {
        pPos = 1. / ( 1. + exp( 6.69 - 1.39 * depth ) );
        pNeg = 1. / ( 1. + exp( 5.48 - 1.28 * depth ) );
    }
    // High altitude mixed (mainly Engelmann spruce)
    else if ( fuelType == 6 )
    {
        pPos = 0.62 * exp( -0.050 * moisture );
        pNeg = 0.80 - ( 0.014 * moisture );
    }
    // Peat moss (commercial)
    else if ( fuelType == 7 )
    {
        pPos = 0.71 * exp( -0.070 * moisture );
        pNeg = 0.84 * exp( -0.060 * moisture );
    }
    // Return requested result
    static const int negative = 0, positive = 1, unknown = 2;
    if ( charge == negative )
    {
        prob = ccNeg * pNeg;
    }
    else if ( charge == positive )
    {
        prob = ccPos * pPos;
    }
    else if ( charge == unknown )
    {
        prob = freqPos * ccPos * pPos
             + freqNeg * ccNeg * pNeg;
    }
    // Constrain result
    if ( prob < 0. )
    {
        prob = 0.;
    }
    if ( prob > 1.0 )
    {
        prob = 1.0;
    }
    return( prob );
}
