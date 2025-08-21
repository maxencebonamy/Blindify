import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "#/components/ui/card"
import { env } from "#/env"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { Music, Play, Volume2, Headphones, Radio, Disc3, Waves, Zap, Star } from "lucide-react"

export const Route = createFileRoute("/login/")({
	component: RouteComponent
})

function RouteComponent() {
	const router = useRouter()

	const login = () => router.navigate({
		href: `${env.VITE_BACKEND_URL}/auth/login`,
		reloadDocument: true
	})

	return (
		<div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
			{/* Animated gradient orbs */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
				<div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 rounded-full blur-2xl animate-bounce delay-500" />
				<div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-gradient-to-r from-orange-400/15 to-red-500/15 rounded-full blur-2xl animate-pulse delay-2000" />
			</div>

			{/* Floating geometric shapes */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div
					className="absolute top-1/4 left-1/5 w-4 h-4 bg-cyan-400/30 rotate-45 animate-spin"
					style={{ animationDuration: "8s" }}
				/>
				<div className="absolute top-3/4 right-1/4 w-6 h-6 bg-purple-400/25 rounded-full animate-bounce delay-700" />
				<div className="absolute bottom-1/4 left-1/3 w-3 h-12 bg-pink-400/20 animate-pulse delay-1200" />
				<div className="absolute top-1/3 right-1/5 w-8 h-8 bg-emerald-400/20 rotate-12 animate-pulse delay-300" />
				<div className="absolute bottom-1/2 left-1/6 w-5 h-5 bg-orange-400/25 rounded-full animate-bounce delay-1800" />
			</div>

			{/* Music-themed floating elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<Music className="absolute top-1/6 left-1/4 w-8 h-8 text-cyan-400/40 animate-bounce delay-300" />
				<Play className="absolute top-2/3 right-1/5 w-6 h-6 text-purple-400/50 animate-pulse delay-700" />
				<Volume2 className="absolute bottom-1/4 left-1/6 w-7 h-7 text-pink-400/35 animate-bounce delay-1500" />
				<Headphones className="absolute top-1/2 right-1/3 w-9 h-9 text-emerald-400/30 animate-pulse delay-900" />
				<Radio className="absolute bottom-1/3 right-1/6 w-5 h-5 text-orange-400/40 animate-bounce delay-2100" />
				<Disc3
					className="absolute top-1/5 right-1/4 w-10 h-10 text-blue-400/25 animate-spin delay-600"
					style={{ animationDuration: "12s" }}
				/>
				<Waves className="absolute bottom-1/5 left-1/3 w-6 h-6 text-teal-400/35 animate-pulse delay-1300" />
				<Zap className="absolute top-3/4 left-1/5 w-4 h-4 text-yellow-400/40 animate-bounce delay-800" />
				<Star className="absolute top-1/3 left-1/2 w-5 h-5 text-indigo-400/30 animate-pulse delay-1600" />
			</div>

			{/* Animated lines/connections */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-pulse delay-500" />
				<div className="absolute bottom-1/3 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-purple-400/25 to-transparent animate-pulse delay-1200 rotate-45" />
				<div className="absolute top-1/2 left-1/6 w-20 h-px bg-gradient-to-r from-transparent via-pink-400/20 to-transparent animate-pulse delay-800 -rotate-12" />
			</div>

			{/* Subtle grid pattern overlay */}
			<div className="absolute inset-0 opacity-5">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
						backgroundSize: "50px 50px"
					}}
				/>
			</div>

			{/* Radial gradient spotlight effect */}
			<div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20" />

			<Card className="w-full max-w-md mx-auto shadow-2xl border border-white/10 bg-black/40 backdrop-blur-xl relative z-10">
				<CardHeader className="text-center space-y-4 pb-8">
					<div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
						<Music className="w-8 h-8 text-white" />
					</div>
					<div className="space-y-2">
						<CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
							Blindify
						</CardTitle>
						<CardDescription className="text-base text-gray-300">
							Your music journey starts here. Connect your streaming platforms and discover music like never before.
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Active Spotify Button */}
					<Button
						className="w-full h-12 bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/25"
						onClick={login}
						size="lg"
					>
						<svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
						</svg>
						Continue with Spotify
					</Button>

					{/* Coming Soon Buttons */}
					<div className="space-y-3">
						<div className="relative">
							<Button
								disabled
								className="w-full h-12 bg-white/5 text-gray-400 cursor-not-allowed opacity-60 border border-white/10"
								size="lg"
							>
								<svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM18.26 17.25c-.25.4-.7.5-1.125.25-2.875-1.75-6.5-2.125-10.75-1.125-.425.1-.85-.175-.95-.575-.1-.425.175-.85.575-.95 4.675-1.05 8.75-.6 12.025 1.35.4.2.45.7.225 1.05zm1.575-3.525c-.3.45-.85.6-1.3.3-3.275-2.025-8.25-2.625-12.1-1.425-.5.125-1.025-.125-1.15-.625-.125-.5.125-1.025.625-1.15 4.4-1.3 9.95-.725 13.675 1.65.45.225.6.825.25 1.25zm.15-3.675c-3.925-2.325-10.4-2.55-14.15-1.4-.6.175-1.25-.175-1.425-.775-.175-.6.175-1.25.775-1.425 4.3-1.275 11.475-1.025 15.9 1.65.575.325.775 1.075.45 1.65-.325.575-1.075.775-1.55.3z" />
								</svg>
								Continue with Deezer
							</Button>
							<Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-white text-xs px-2 py-1 shadow-lg">
								Soon
							</Badge>
						</div>

						<div className="relative">
							<Button
								disabled
								className="w-full h-12 bg-white/5 text-gray-400 cursor-not-allowed opacity-60 border border-white/10"
								size="lg"
							>
								<svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
									<path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.001-.08-.004-.12-.004H5.986c-.04 0-.08.003-.12.004-.526.015-1.047.057-1.564.15-.673.121-1.303.353-1.877.727C1.307 1.624.562 2.624.245 3.934.07 4.654.005 5.386.005 6.124v11.741c0 .738.065 1.47.24 2.19.317 1.31 1.062 2.31 2.18 3.043.574.374 1.204.606 1.877.727.517.093 1.038.135 1.564.15.04.001.08.004.12.004h12.014c.04 0 .08-.003.12-.004.526-.015 1.047-.057 1.564-.15.673-.121 1.303-.353 1.877-.727 1.118-.733 1.863-1.733 2.18-3.043.175-.72.24-1.452.24-2.19V6.124zM9.68 16.464V7.536L15.937 12 9.68 16.464z" />
								</svg>
								Continue with YouTube Music
							</Button>
							<Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-white text-xs px-2 py-1 shadow-lg">
								Soon
							</Badge>
						</div>

						<div className="relative">
							<Button
								disabled
								className="w-full h-12 bg-white/5 text-gray-400 cursor-not-allowed opacity-60 border border-white/10"
								size="lg"
							>
								<svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 17.568c-.24.24-.576.24-.816 0L12 12.816l-4.752 4.752c-.24.24-.576.24-.816 0s-.24-.576 0-.816L11.184 12 6.432 7.248c-.24-.24-.24-.576 0-.816s.576-.24.816 0L12 11.184l4.752-4.752c.24-.24.576-.24.816 0s.24.576 0 .816L12.816 12l4.752 4.752c.24.24.24.576 0 .816z" />
								</svg>
								Continue with Apple Music
							</Button>
							<Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-white text-xs px-2 py-1 shadow-lg">
								Soon
							</Badge>
						</div>
					</div>

					<div className="pt-4 text-center">
						<p className="text-sm text-gray-400">More platforms coming soon. Stay tuned!</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
