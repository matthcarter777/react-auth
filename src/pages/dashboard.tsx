import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth"
import { api } from "../services/api";


export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    api.get('/me')
    .then(response => console.log(response))
  }, [])

  return <h1>H3y Y0u, {user?.email}</h1>
}