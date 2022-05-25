import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { withSSRGuest } from '../utils/withSSRGuest';

import styles from '../styles/Home.module.css';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useAuth();

  function handleSubmite(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      password
    }

    signIn(data);
  }

  return (
    <form className={styles.container} onSubmit={handleSubmite}>
      <input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className={styles.button} type="submit">Entrar</button>
    </form>
  )
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return { 
    props: {}
  }
})