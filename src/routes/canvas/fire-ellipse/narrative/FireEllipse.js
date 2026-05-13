/**
 * FireEllipse represents a parametric fire ellipse defined by its (1) length-to-width
 * ratio and (2) head fire spread rate.  These two parameters distinguish one FireEllipse
 * instance from another, and determine derived properties such as eccentricity,
 * backing spread rate, length and width expansion rate.
 * 
 * FireEllipse dimensions of interest (length, width, major and minor radii, perimeter, area)
 * at any time since ignition are updatable by calling the setDuration(duration) method.
 * 
 * FireEllipse geographic locations of interest (ignition, center, head, back, flank, perimeter)
 * expressed in the client's Projected Coordinate System are updatable by calling the
 * setLocation(ignEast, ignNorth, bearing) method.
 */
import * as FE from './FireEllipseEquations.js'

export class FireEllipse {
    constructor(headRos=1, lwr=1, duration=1, ignEast=0, ignNorth=0, bearing=0) {
        this.setBehavior(headRos, lwr)
        this.setDuration(duration)
        this.setLocation(ignEast, ignNorth, bearing)
    }

    // Updates basic axis & shape properties dependent upon headRos, lwr
    setBehavior(headRos, lwr) {
        this.headRos = headRos
        this.lwr = lwr
        this.eccent = FE.eccentricity(this.lwr)
        this.backRos = FE.backRos(this.headRos, this.eccent)
        this.majorRos = FE.majorRos(this.headRos, this.backRos)
        this.minorRos = FE.minorRos(this.majorRos, this.lwr)
        this.fRos = FE.fRos(this.majorRos)
        this.gRos = FE.gRos(this.fRos, this.backRos)
        this.hRos = FE.hRos(this.minorRos)
        return this
    }

    // Updates distance and size properties dependent upon *duration*
    setDuration(duration) {
        this.duration = duration
        this.headDist = this.headRos * this.duration
        this.backDist = this.backRos * this.duration
        this.fDist = this.fRos * this.duration          // same as 'rx'
        this.gDist = this.gRos * this.duration
        this.hDist = this.hRos * this.duration          // same as 'ry'
        this.length = this.majorRos * this.duration
        this.width = this.minorRos * this.duration
        this.majorDist = this.length / 2
        this.minorDist = this.width / 2
        this.perimDist = FE.perimeter(this.majorDist, this.minorDist)
        this.area = FE.area(this.length, this.width)
        return this
    }

    // Updates ignition, center, head, and back locations
    // dependent upon duration, ignition point and bearing
    setLocation(ignEast, ignNorth, bearing) {
        this.bearing = bearing
        this.ignEast = ignEast
        this.ignNorth = ignNorth

        this.degRot = (450-this.bearing ) % 360      // was 'headDeg'
        this.radRot = FE.radians(this.degRot)
        this.cosRot = Math.cos(this.radRot)
        this.sinRot = Math.sin(this.radRot)

        this.centerEast = this.ignEast + this.gDist * this.cosRot
        this.centerNorth = this.ignNorth + this.gDist * this.sinRot
        
        this.headEast = this.ignEast + this.headDist * this.cosRot
        this.headNorth = this.ignNorth + this.headDist * this.sinRot
        
        this.backEast = this.ignEast + this.backDist * this.cosRot
        this.backNorth = this.ignNorth + this.backDist * this.sinRot
        return this
    }
}
