
//------------------------------------------------------------------------------
double FBL_ChaparralAgeFromDepth( double depth, bool isChamise )
{
	double factor = ( isChamise ) ? 7.5 : 10.;
	double age = exp( 3.912023 * sqrt( depth / factor ) );
	return age;
}

//------------------------------------------------------------------------------
/*! \brief Calculates the number of calendar days since May 1st.
 *
 *  \param month Month of the year (Jan=1, Dec=12)
 *  \param day Day of the month [1..31].
 *
 *  \retval Days since May 1st [0..183]
 *	\retval 0 if month < 5
 *	\retval 184 if month > 10
 */
double FBL_ChaparralDaysSinceMay1( int month, int day )
{
	//                   J   F   M   A   M    J    J    A    S    O    N    D
	int daysBefore[] = { 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 };
	int mon = ( month < 1 ) ? 1 : month;
	mon = ( mon > 12 ) ? 12 : mon;
	day = ( day < 1 ) ? 1 : day;
	day = ( day > 31 ) ? 31 : day;
	int days = daysBefore[mon-1] + day;
	days = ( days > 304 ) ? 304 : days;		// Do not extend past Oct 31
	days -= 121;							// Days since May 1
	days - ( days < 0. ) ? 0. : days;		// Do not begin before May 1
	return days;
}

//------------------------------------------------------------------------------
double FBL_ChaparralDeadFuelFraction( double age, bool isAvereage )
{
	double average = 0.0694 * exp( 0.0402 * age );	// Average mortality
	double severe  = 0.1094 * exp( 0.0385 * age );	// Severe mortality
	return ( isAvereage) ? average : severe;
}

//------------------------------------------------------------------------------
double FBL_ChaparralDepth( double age, bool isChamise )
{
	double x = log( age ) / 3.912023;
	double depth = ( isChamise ) ? 7.5*x*x : 10.*x*x;
	depth = ( depth < 0.01 ) ? 0.01 : depth;
	return depth;
}

//------------------------------------------------------------------------------
double FBL_ChaparralHeatLiveLeaf( double daysSinceMay1 )
{
	double d = daysSinceMay1;
	double heat = 9613. -  1.00*d + 0.1369*d*d - 0.000365*d*d*d;
	return heat;
}

//------------------------------------------------------------------------------
double FBL_ChaparralHeatLiveStem( double daysSinceMay1 )
{
	double d = daysSinceMay1;
	double heat = 9509. - 10.74*d + 0.1359*d*d - 0.000405*d*d*d;
	return heat;
}

//------------------------------------------------------------------------------
double FBL_ChaparralLiveExtinctionMoisture( bool isChamise )
{
	double emc = isChamise ? 0.65 : 0.74;
	return emc;
}

//------------------------------------------------------------------------------
double FBL_ChaparralLoadDead( double totalLoad, double deadLoadFraction, int size )
{
	double f[] = { 0.347, 0.364, 0.207, 0.082 };
	double load = totalLoad * deadLoadFraction * f[size];
	return load;
}

//------------------------------------------------------------------------------
double FBL_ChaparralLoadLive( double totalLoad, double deadLoadFraction, int size )
{
	double a[] = { 0.1957, 0.2416, 0.1918, 0.2648, 0.1036 };
	double b[] = { 0.3050, 0.2560, 0.2560, 0.0500, 0.1140 };
	double load = totalLoad * ( a[size] - b[size] * deadLoadFraction );
	return load;
}

//------------------------------------------------------------------------------
double FBL_ChaparralMoistureLiveLeaf( double daysSinceMay1 )
{
	double mois = 1. / ( 0.726 + 0.00877 * daysSinceMay1 );
	return mois;
}

//------------------------------------------------------------------------------
double FBL_ChaparralMoistureLiveStem( double daysSinceMay1 )
{
	double mois = 1. / ( 1.454 + 0.00650 * daysSinceMay1 );
	return mois;
}

//------------------------------------------------------------------------------
/*! \brief Calculate the total chaparral fuel load from age and type.
 *
 * NOTE - Rothermel & Philpot (1973) used a factor of 0.0315 for chamise age,
 * while Cohen used 0.0347 in FIRECAST.  According to Faith Ann Heinsch:
 * <i>We are going to use Cohen�s calculation from FIRECAST. The change has to do
 * with the fact that we are creating a proxy age from fuel bed depth rather than
 * using an entered age. He had to make some corrections for that assumption.</i>
 */
double FBL_ChaparralTotalFuelLoad( double age, bool isChamise )
{
	double factor1 = 0.0315;	// Chamise load factor from Rothermel & Philpot (1973)
	double factor2 = 0.0347;	// Chamise load factor from Cohen's FIRECAST code
	double chamiseFactor = factor2;
	double tpa = ( isChamise )
		? age / ( 1.4459 + factor2 * age )	// ton/ac
		: age / ( 0.4849 + 0.0170 * age );	// ton/ac
	double load = tpa * 2000. / 43560.;		// lb/ft2
	return load;
}
