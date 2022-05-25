import { useEffect } from "react";
import { Can } from "../components/Can";
import { useAuth } from "../hooks/useAuth"
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";


export default function Dashboard() {
  const { user } = useAuth();

  const useCanSeeMetrics = useCan({
    permissions: ['metrics.list']
  });

  useEffect(() => {
    api.get('/me')
    .then(response => console.log(response))
    .catch(err => console.error(err))
  }, [])

  return(
    <>
      <h1>H3y Y0u, {user?.email}</h1>

      <Can permissions={['metrics.list']}>
        <div>Metricas</div>
      </Can>
    </>
  ) 
}

export const getServerSideProps = withSSRAuth(async(ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/me');

  console.log(response.data)
  
  return {
    props: {}
  }
})