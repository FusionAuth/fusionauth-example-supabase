import {createClient} from '@supabase/supabase-js';

const createSupabaseClient = (accessToken = null) => {
  const options = {};
  if (accessToken) {
    options.global = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    options,
  );
};

export {createSupabaseClient};
