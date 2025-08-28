import { useEffect, useRef } from "react"

type AudioPlayerProps = {
	url: string
	startTimeMs?: number
}

export const AudioPlayer = ({ url, startTimeMs = 0 }: AudioPlayerProps) => {
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		if (!audioRef.current) return

		const audio = audioRef.current

		const playAudio = async () => {
			audio.currentTime = startTimeMs / 1000
			await audio.play()
		}

		playAudio()

		return () => {
			audio.pause()
		}
	}, [ url, startTimeMs ])

	return <audio ref={audioRef} src={url} hidden loop />
}
