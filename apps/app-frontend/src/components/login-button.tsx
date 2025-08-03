export const LoginButton = () => {
	const handleLogin = () => {
		window.location.href = "http://localhost:8000/auth/login"
	}

	return (
		<button onClick={handleLogin} className="bg-green-400 px-4 py-2 rounded text-white hover:bg-green-500">
			Connect with Spotify
		</button>
	)
}
