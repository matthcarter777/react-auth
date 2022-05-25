import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth"
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";


export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    api.get('/me')
    .then(response => console.log(response))
    .catch(err => console.error(err))
  }, [])

  return <h1>H3y Y0u, {user?.email}</h1>
}

export const getServerSideProps = withSSRAuth(async(ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/me');

  console.log(response.data)
  
  return {
    props: {}
  }
})