"use client"

import { useEffect, useState } from "react"

type ConfettiEffectProps = {
	isActive: boolean
	duration?: number
}

export function ConfettiEffect({ isActive, duration = 3000 }: ConfettiEffectProps) {
	const [ particles, setParticles ] = useState<{ id: number, color: string, left: number, delay: number }[]>([])

	useEffect(() => {
		if (isActive) {
			const colors = [ "#f97316", "#ea580c", "#be123c", "#4b5563" ] as const
			const newParticles = Array.from({ length: 50 }, (_, i) => ({
				id: i,
				color: colors[Math.floor(Math.random() * colors.length)] ?? colors[0],
				left: Math.random() * 100,
				delay: Math.random() * 2
			}))
			setParticles(newParticles)

			const timer = setTimeout(() => {
				setParticles([])
			}, duration)

			return () => clearTimeout(timer)
		}
	}, [ isActive, duration ])

	if (!isActive || particles.length === 0) return null

	return (
		<div className="fixed inset-0 pointer-events-none z-50">
			{particles.map(particle => (
				<div
					key={particle.id}
					className="absolute w-2 h-2 confetti"
					style={{
						backgroundColor: particle.color,
						left: `${particle.left}%`,
						animationDelay: `${particle.delay}s`
					}}
				/>
			))}
		</div>
	)
}
