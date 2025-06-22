import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import 'dotenv/config';

dotenv.config({path: '.env.local'})

export const supabase = createClient(process.env.DATABASE_URL, process.env.SUPABASE_ANON_KEY)