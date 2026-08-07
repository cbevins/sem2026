
//------------------------------------------------------------------------------
/*! \brief Calculates the crown fire active ratio (ratio of Ractive to R'active])
 *
 * The Active Ratio == 1 when Ractive==R'active, which occurs when the open
 * wind speed O'active (the Crowning Index) is achieved, resulting in a
 * theoretical surface fire spread rate of R'sa
 *
 *  \param crownFireSpreadRate Crown fire spread rate (ft/min) [Ractive].
 *
 *  \param criticalActiveCrownFireSpreadRate Critical crown fire spread rate
 *	for sustaining a fully active crown fire (ft/min) [R'active].
 *
 *  \return Crown fire active ratio.
 */

double FBL_CrownFireActiveRatio( double crownFireSpreadRate,
        double criticalActiveCrownFireSpreadRate )
{
    return( ( criticalActiveCrownFireSpreadRate < SMIDGEN )
          ? ( 0.00 )
          : ( crownFireSpreadRate / criticalActiveCrownFireSpreadRate ) );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the Scott & Reinhardt 'Crowning Index', which is also the
 *	"O'active", the critical open wind speed for sustaining a fully active crown fire.
 *
 *	The 'Crowning Index' and O'active is the open wind speed at which Ractive==R'active,
 *	where:
 *	- Ractive is the Rothermel crown fire spread rate
 *		(3.34 times the Fuel Model 10 spread rate), and
 *  - R'active is the critical crown fire spread rate for sustaining an active crown fire
 *		(a function of the canopy fuel bulk density)
 *	This is the 20-ft wind speed at which the crown canopy becomes fully available
 *	for active fire spread and:
 *	- the crown fraction burned approaches 1,
 *	- Ractive == R'active, and
 *	- the surface fire spread rate would equal R'sa.
 *
 *  See Scott & Reinhardt (2001) equantion 20 on page 19.
 *
 *	\param canopyBulkDensity Crown canopy bulk density (btu/ft3)
 *	\param reactionIntensity Crown fire (fuel model 10) reaction intensity (btu/ft2/min)
 *	\param heatSink Crown fire (fuel model 10) heat sink (btu/ft3)
 *	\param slopeFactor
 *
 *  \return Crowing index, aka O'active (ft/min).
*/
double FBL_CrownFireActiveWindSpeed(
		double canopyBulkDensity,
		double reactionIntensity,
		double heatSink,
		double slopeFactor )
{
	double rhob = 0.5520;							// Fuel model 10 bulk density (lb/ft3)
	double cbd = 16.0185 * canopyBulkDensity;		// Convert from lb/ft3 to kg/m3
	double rxInt = 0.189422 * reactionIntensity;	// Convert from Btu/ft2/min to kW/m2
	// Determine the epsilon * Qig product from the fuel bed rbQig heat sink
	double epsQig = heatSink / rhob;				// Product of eff htg num and heat of preignition
	epsQig *= 2.32779;								// Convert from Btu/lb to kJ/kg
	double numerator = ( 164.8 * epsQig / ( rxInt * cbd ) ) - slopeFactor - 1.;
	double term = numerator / 0.001612;
	// Scott & Reinhardt Eq 20 to derive wind speed at 20-ft that sustains a fully active crown fire
	double oActive = 0.0457 * pow( term, 0.7 );		// m/min
	double fpm = 3.2808 * oActive;					// Convert from m/min to ft/min
	return fpm;
}

//------------------------------------------------------------------------------
/*! \brief Calculates the crown fire area from its forward spread distance and
 *  elliptical length-to-width ratio using the assumptions and equations as per
 *  Rothermel (1991) equation 11 on page 16 (which ignores backing distance).
 *
 *  \param spreadDistance Fire forward spread distance (ft).
 *  \param lwRatio Crown fire length-to-width ratio (ft/ft).
 *
 *  \return Fire area (ft2).
 */

double FBL_CrownFireArea( double spreadDistance, double lwRatio )
{
    return( M_PI * spreadDistance * spreadDistance / ( 4. * lwRatio ) );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the crown fraction burned as per Scott & Reinhardt.
 *
 *	See Scott & Reinhardt (2001) equation 28 on page 41.
 *
 *  \param Rsurface Actual surface fire spread rate (ft/min) [Rsurface].
 *	\param Rinitiation Surface fire spread rate required to initiate
 *		passive/torching/crowning (ft/min) [R'intiation].
 *	\param Rsa Surface fire spread rate required to reach CI or O'active [R'sa]
 *
 *  \return Crown fraction burned (dl).
 */
double FBL_CrownFireCanopyFractionBurned(
		double Rsurface,
		double Rinitiation,
		double Rsa )
{
	// If surface ROS is less than crown fire initiation ROS, then no canopy is burned
	double num = Rsurface - Rinitiation;
	if ( num <= 0. )
	{
		return 0.;
	}
	// If surface ROS is greater than surface Rsa, then 100% of the canopy is burned
	if ( Rsurface >= Rsa )
	{
		return 1.;
	}
	// Otherwise actual ROS is between passive and active crowning critical threshholds
	double den = Rsa - Rinitiation;
	den = ( den < 0. ) ? 0. : den;
	double cfb = ( den > SMIDGEN ) ? ( num / den ) : 0.;
	cfb = ( cfb > 1. ) ? 1. : cfb;
	cfb = ( cfb < 0. ) ? 0. : cfb;
	return cfb;
}

//------------------------------------------------------------------------------
/*! \brief Calculates the critical crown fire spread rate [R'active] for
 *	sustaining an active crown fire.
 *
 *	See Scott & Reinhardt (2001) equation 14 on page 14.
 *
 *  \param canopyBulkDensity Canopy crown bulk density (lb/ft3).
 *
 *  \return Critical crown fire spread rate (ft/min).
 */

double FBL_CrownFireCriticalCrownFireSpreadRate( double canopyBulkDensity )
{
    double cbd = 16.0185 * canopyBulkDensity;       // Convert to Kg/m3
    double ros = ( cbd < SMIDGEN ) ? 0.00 : ( 3.0 / cbd );
    return( 3.28084 * ros );                        // Convert to ft/min
}

//------------------------------------------------------------------------------
/*! \brief Reverse calculates the critical surface fire intensity [I'initiation]
 *  for a surface fire to transition to a crown fire given the critical flame length.
 *
 *  \param criticalFlameLength Critical surface fire flame length (ft).
 *
 *  \return Critical surface fire intensity (Btu/ft/s).
 */

double FBL_CrownFireCriticalSurfaceFireIntensity( double criticalFlameLength )
{
    return( FBL_SurfaceFireFirelineIntensity( criticalFlameLength ) );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the critical surface fire intensity [I'initiation] for a
 *	surface fire to transition to a passsive or active crown fire.
 *
 *	See Scott & Reinhardt (2001) equation 11 on page 12.
 *
 *  \param foliarMoisture   Tree foliar moisture content (lb water/lb foliage).
 *  \param crownBaseHt      Tree crown base height (ft).
 *
 *  \return Critical surface fire intensity (Btu/ft/s).
 */

double FBL_CrownFireCriticalSurfaceFireIntensity(
		double foliarMoisture,
		double crownBaseHt )
{
    // Convert foliar moisture content to percent and constrain lower limit
    double fmc = 100. * foliarMoisture;
    fmc = ( fmc < 30.0 ) ? 30. : fmc;
    // Convert crown base ht to meters and constrain lower limit
    double cbh = 0.3048 * crownBaseHt;
    cbh = ( cbh < 0.1 ) ? 0.1 : cbh;
    // Critical surface fireline intensity (kW/m)
    double csfi = pow( (0.010 * cbh * ( 460. + 25.9 * fmc ) ), 1.5 );
    // Return as Btu/ft/s
    return ( 0.288672 * csfi );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the critical surface fire flame length for a surface fire
 *  to transition to a crown fire given the critical fireline intensity.
 *
 *  \param criticalFireInt Critical surface fireline intensity (Btu/ft/s).
 *
 *  \return Critical surface fire flame length (ft).
 */

double FBL_CrownFireCriticalSurfaceFlameLength( double criticalFireInt )
{
    return( FBL_SurfaceFireFlameLength( criticalFireInt ) );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the Scott & Reinhardt (2001) critical surface fire spread
 *	rate [R'initiation] sufficient to initiate a passive or active crown fire.
 *
 *	See Scott & Reinhardt (2001) equation 12 on page 13.
 *
 *	\param criticalSurfaceFireIntensity Critical surface fireline intensity
 *		(btu/ft/s) [I'initiation]
 *  \param surfaceFireHpua Surface fire heat per unit area (Btu/ft2)
 *
 *	\return Critical surface fire spread rate (ft/min)
 */

double FBL_CrownFireCriticalSurfaceFireSpreadRate(
		double criticalSurfaceFireIntensity,
		double surfaceFireHpua )
{
	double ros = 99999.;
	if ( surfaceFireHpua > 0. )
	{
		ros = (60. * criticalSurfaceFireIntensity) / surfaceFireHpua;
	}
	return ros;
}

//------------------------------------------------------------------------------
/*! \brief Calculates the total (surface and canopy) crown fire fireline intensity
 *  given the surface fire and crown fire heats per unit area
 *  and the crown fire spread rate.
 *
 *  \param crownFireHpua Crown fire (surface + canopy) heat per unit area (Btu/ft2).
 *  \param crownFireSpreadRate Crown fire rate of spread (ft/min).
 *
 *  \return Crown fire fireline intensity (Btu/ft/s).
 */

double FBL_CrownFireFirelineIntensity(
		double crownFireHpua,
		double crownFireSpreadRate )
{
    return( (crownFireSpreadRate / 60.) * crownFireHpua );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the crown fireline intensity given the crown fire flame length.
 *
 *	Based on Thomas (1963), which differs from Byram (1959).
 *
 *  \param Crown fire flame length (ft).
 *
 *  \return crownFirelineIntensity Crown fireline intensity (Btu/ft/s).
 */

double FBL_CrownFireFirelineIntensityFromFlameLength( double crownFireFlameLength )
{
    return( pow( ( 5. * crownFireFlameLength ), 1.5 ) );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the crown fire flame length given the crown fireline intensity.
 *
 *	Based on Thomas (1963), which differs from Byram (1959).
 *
 *  \param crownFirelineIntensity Crown fireline intensity (Btu/ft/s).
 *
 *  \return Crown fire flame length (ft).
 */

double FBL_CrownFireFlameLength( double crownFirelineIntensity )
{
    return( 0.2 * pow( crownFirelineIntensity, (2./3.) ) );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the total crown fire heat per unit area
 *  given the surface HPUA and canopy HPUA contributions.
 *
 *  \param surfaceHpua Surface fire heat per unit area (Btu/ft2)
 *  \param canopyHpua Crwon canopy heat per unit area (Btu/ft2)
 *
 *  \return Total crown fire (surface plus canopy) heat per unit area (Btu/ft2).
 */

double FBL_CrownFireHeatPerUnitArea(
		double surfaceHpua,
		double canopyHpua )
{
    return( surfaceHpua + canopyHpua );
}
//------------------------------------------------------------------------------
/*! \brief Calculates the canopy portion of the crown fire heat per unit area
 *  given the crown fire fuel load and low heat of combustion.
 *
 *  \param crownFireFuelLoad Crown fire fuel load (lb/ft2).
 *  \param lowHeatOfCombustion Low heat of combustion (Btu/lb)
 *
 *  \return Crown fire canopy heat per unit area (Btu/ft2).
 */

double FBL_CrownFireHeatPerUnitAreaCanopy(
		double crownFuelLoad,
		double lowHeatOfCombustion )
{
    return( crownFuelLoad * lowHeatOfCombustion );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the crown fire length-to-width ratio given the 20-ft
 *  wind speed.
 *
 *  Rothermel (1991) equation 10 on page 16.
 *
 *  \param windSpeedAt20ft Wind speed at 20-ft (mi/h).
 *
 *  \return Crown fire length-to-width ratio (ft/ft).
 */

double FBL_CrownFireLengthToWidthRatio( double windSpeedAt20ft )
{
    return( ( windSpeedAt20ft > SMIDGEN )
          ? ( 1. + 0.125 * windSpeedAt20ft )
          : ( 1. ) );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the Scott & Reinhardt 'final' crown fire spread rate (ft/min).
 *
 *	Scott & Reinhardt (2001) equation 21 on page 19.
 *
 *  \param Rsurface Surface fire spread rate at head (ft/min)
 *	\param Ractive Active crown fire spread rate (ft/min)
 *	\param cfb Fraction of the crown canopy that is burned
 *
 *  \return Rfinal Passive crown fire spread rate (ft/min).
 */

double FBL_CrownFirePassiveSpreadRate(
            double Rsurface,
			double Ractive,
            double cfb )
{
	double Rdiff = ( Ractive < Rsurface ) ? 0. : Ractive - Rsurface;
	double Rfinal = Rsurface + cfb * Rdiff;
	return Rfinal;
}

//------------------------------------------------------------------------------
/*! \brief Estimates crown fire perimeter from spread distance and length-to-
 *  width ratio as per Rothermel (1991) equation 13 on page 16.
 *
 *  \param fireLength   Fire ellipse length (ft).
 *  \param fireWidth    Fire ellipse width (ft).
 *
 *  \return Fire perimeter (ft).
 */

double FBL_CrownFirePerimeter( double spreadDistance, double lwRatio )
{
    return( 0.5 * M_PI * spreadDistance * (1. + 1. / lwRatio ) );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the crown fire 'power of the fire'
 *  given the crown fireline intensity.
 *
 *	See Rothermel (1991) equation 6 on page 14.
 *
 *  \param crownFirelineIntensity Crown fireline intensity (Btu/ft/s).
 *
 *  \return Crown fire 'power of the fire' (ft-lb/s/ft2).
 */

double FBL_CrownFirePowerOfFire( double crownFirelineIntensity )
{
    return( crownFirelineIntensity / 129. );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the crown fire 'power of the wind'
 *  given the 20-ft wind speed and crown fire spread rate.
 *
 *	See Rothermel (1991) equation 7 on page 14.
 *
 *  \param windSpeedAt20Ft Wind speed at 20ft (ft/min).
 *  \param crownFireSPreadRate Crown fire spread rate (ft/min).
 *
 *  \return Crown fire 'power of the wind' (ft-lb/s/ft2).
 */

double FBL_CrownFirePowerOfWind(
		double windSpeedAt20Ft,
		double crownFireSpreadRate )
{
    double diff = ( windSpeedAt20Ft - crownFireSpreadRate ) / 60.;
    diff = ( diff < SMIDGEN ) ? SMIDGEN : diff;
    return( 0.00106 * diff * diff * diff );
}


//------------------------------------------------------------------------------
/*! \brief Calculates the crown fire 'power-of-fire to power-of-wind' ratio.
 *
 *  \param firePower Power of the fire (ft-lb/s/ft2).
 *  \param windPower Power of the wind (ft-lb/s/ft2).
 *
 *  \return Ratio of the crown fire 'power-of-the-fire' to 'power-of-the-wind).
 */

double FBL_CrownFirePowerRatio(
		double firePower,
		double windPower )
{
    return( ( windPower > SMIDGEN ) ? ( firePower / windPower ) : 0.0 );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the crown fire spread rate.
 *
 *  This uses Rothermel's 1991 crown fire correlation.
 *
 *  \param windAt20Ft   Wind speed at 20 ft above the canopy (mi/h).
 *  \param mc1          Dead 1-h fuel moisture content (lb water/lb fuel).
 *  \param mc10         Dead 10-h fuel moisture content (lb water/lb fuel).
 *  \param mc100        Dead 100-h fuel moisture content (lb water/lb fuel).
 *  \param mcWood       Live wood fuel moisture content (lb water/lb fuel).
 *
 *  \return Crown fire average spread rate (ft/min).
 */
double FBL_CrownFireSpreadRate(
		double windAt20Ft,
		double mc1,
		double mc10,
        double mc100,
		double mcWood )
{
    double mois[4];
    mois[0] = mc1;
    mois[1] = mc10;
    mois[2] = mc100;
    mois[3] = mcWood;

	Bp6CrownFire cf;
	cf.setMoisture( mois );
	cf.setWindSpeedAt20FtFpm( 88. * windAt20Ft );
	double crownRos = cf.getActiveCrownFireRos();
    return crownRos;
}

//------------------------------------------------------------------------------
/*! \brief Calculates the crown fire transition ratio.
 *
 *  \param surfaceFireInt   Surface fireline intensity (Btu/ft/s) [Isurface].
 *  \param criticalFireInt  Critical crown fire fireline intensity (Btu/ft/s) [I'initition].
 *
 *  \return Transition ratio.
 */

double FBL_CrownFireTransitionRatio(
		double surfaceFireInt,
        double criticalFireInt )
{
    return( ( criticalFireInt < SMIDGEN )
          ? ( 0.00 )
          : ( surfaceFireInt / criticalFireInt ) );
}

//------------------------------------------------------------------------------
/*! \brief Calculates crown fire maximum width from its length and
 *  length-to-width ratio.
 *
 *  \param fireLength       Fire length (ft).
 *  \param lengthWidthRatio Fire length-to-width ratio (ft/ft).
 *
 *  \return Maximum fire width (ft).
 */

double FBL_CrownFireWidth(
		double fireLength,
		double lengthWidthRatio )
{
    return( ( lengthWidthRatio < SMIDGEN )
          ? ( 0.0 )
          : ( fireLength / lengthWidthRatio ) );
}
//------------------------------------------------------------------------------
/*! \brief Calculates the crown fire fuel load
 *  given the canopy bulk density and canopy height.
 *
 *  \param canopyBulkDensity Canopy bulk density (lb/ft3).
 *  \param canopyHt Canopy height (ft)
 *	\param baseHt Canopy base height (ft)
 *
 *  \return Crown fire fuel load (lb/ft2).
 */

double FBL_CrownFuelLoad(
		double canopyBulkDensity,
		double canopyHt,
		double baseHt )
{
    return( canopyBulkDensity * ( canopyHt - baseHt ) );
}

//------------------------------------------------------------------------------
/*! \brief Calculates the fire type; surface, passive, or active.
 *
 *  \param transitionRatio  Crown fire transition ratio.
 *  \param activeRatio      Crown fire active ratio.
 *
 *  \retval 0 == Surface: surface fire with no torching or crown fire spread.
 *  \retval 1 == Torching: surface fire with torching.
 *  \retval 2 == Conditional crown fire: conditions indicate the fire will
 *                  not transition from the surface to the crown.
 *                  But if it does, an active crown fire may result.
 *  \retval 3 == Crowing: active crown fire, fire is spreading through the canopy.
 */

int FBL_FireType( double transitionRatio, double activeRatio )
{
    int status = 0;
    // If the fire CAN NOT transition to the crown ...
    if ( transitionRatio < 1.0 )
    {
        if ( activeRatio < 1.0 )
        {
            status = 0;     // Surface fire
        }
        else // if ( activeRatio >= 1.0 )
        {
            status = 2;     // Conditional crown fire
        }
    }
    // If the fire CAN transition to the crown ...
    else // if ( transitionRation >= 1.0 )
    {
        if ( activeRatio < 1.0 )
        {
            status = 1;     // Torching
        }
        else // if ( activeRatio >= 1.0 )
        {
            status = 3;     // Crowning
        }
    }
    return( status );
}
