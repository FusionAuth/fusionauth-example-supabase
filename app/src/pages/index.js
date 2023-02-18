import Head from 'next/head';
import LoginButton from '@/components/login-button';
import {authOptions} from '@/pages/api/auth/[...nextauth]';
import {createSupabaseClient} from '@/utils/supabase';
import {getServerSession} from 'next-auth/next';
import {useSession} from 'next-auth/react';

export async function getServerSideProps ({ req, res }) {
  // @link https://next-auth.js.org/configuration/nextjs#in-getserversideprops
  const session = await getServerSession(req, res, authOptions);
  if ((!session) || (!session.accessToken)) {
    return {
      props: {},
    };
  }

  const supabase = createSupabaseClient(session.accessToken);

  const response = await supabase.from('events').select('*');

  return {
    props: {events: response.data},
  };
}

const renderTable = (events) => {
  if (!Array.isArray(events)) {
    return null;
  }
  return (
    <div style={{marginTop: "20px"}}>
      <h2>Rows</h2>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.title}</td>
              <td>{event.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Home ({ events }) {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Next.js + FusionAuth</title>
        <meta name="description" content="Sample app to demonstrate implementing authentication in a Next.js application with FusionAuth" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <LoginButton />
        {session && renderTable(events)}
      </main>
    </>
  )
}
