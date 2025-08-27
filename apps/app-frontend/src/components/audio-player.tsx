import { useEffect, useRef } from "react"

type AudioPlayerProps = {
	url: string
	startTime?: number // en secondes
}

export const AudioPlayer = ({ url, startTime = 0 }: AudioPlayerProps) => {
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		if (!audioRef.current) return

		const audio = audioRef.current

		const playAudio = async () => {
			audio.currentTime = startTime / 1000
			await audio.play()
		}

		playAudio()

		return () => {
			audio.pause()
		}
	}, [ url, startTime ])

	return <audio ref={audioRef} src={url} hidden loop />
}
