import { LoginButton } from "#/components/login-button"
import { LogoutButton } from "#/components/logout-button"
import { authMeOptions } from "#/generated/@tanstack/react-query.gen"
import { useQuery } from "@tanstack/react-query"

export const Profile = () => {
	const { data: profile, isLoading, isError } = useQuery({
		...authMeOptions(),
		retry: false
	})

	if (isLoading) {
		return <p> Loading profile... </p>
	}

	if (isError || !profile) {
		return <LoginButton />
	}

	return (
		<div className="profile">
			<h1 className="text-2xl font-bold mb-4">User Profile</h1>
			<p>
				<strong>ID:</strong>
				{" "}
				{profile.id}
			</p>
			<p>
				<strong>Name:</strong>
				{" "}
				{profile.display_name}
			</p>
			<p>
				<strong>Email:</strong>
				{" "}
				{profile.email}
			</p>
			{profile.profile_image_url && (
				<img src={profile.profile_image_url} alt="Profile" className="w-32 h-32 rounded-full" />
			)}
			<LogoutButton />
		</div>
	)
}
