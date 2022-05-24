import { useAuth } from "../hooks/useAuth"


export default function Dashboard() {
  const { user } = useAuth()

  return <h1>H3y Y0u, {user?.email}</h1>
}