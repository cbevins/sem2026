import { expect, test } from 'vitest'
import {FireEllipseMod} from './FireEllipseMod.js'

const ellipse = new FireEllipseMod('e')
ellipse.setConsumers()

const {beta, head, lwr, psi, theta} = ellipse
beta.beta.select()
beta.theta.select()
beta.psi.select()
psi.beta.select()
psi.theta.select()
psi.psi.select()
theta.beta.select()
theta.theta.select()
theta.psi.select()

head.angle.north.set(0)
lwr.set(2)

test('Beta-Theta-Psi Recipricol Conversions', () => {
	for(let i=0; i<360; i++) {
		beta.angle.north.set(i)
		const a = beta.angle.head.get()
		const b = beta.beta.get()
		const t = beta.theta.get()
		const p = beta.psi.get()
		expect(a).toBeCloseTo(b, 11)
	}
})
test('Theta-Beta-Psi Recipricol Conversions', () => {
	for(let i=0; i<360; i++) {
		theta.angle.north.set(i)
		const a = theta.angle.head.get()
		const b = theta.beta.get()
		const t = theta.theta.get()
		const p = theta.psi.get()
		expect(a).toBeCloseTo(t, 11)
	}
})
test('Psi-Theta-Beta Recipricol Conversions', () => {
	for(let i=0; i<360; i++) {
		psi.angle.north.set(i)
		const a = psi.angle.head.get()
		const b = psi.beta.get()
		const t = psi.theta.get()
		const p = psi.psi.get()
		expect(a).toBeCloseTo(p, 11)
	}
})