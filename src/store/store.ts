import { writable } from 'svelte/store';
import type { Session } from '@supabase/supabase-js';

export const session = writable<null | Session>(null);
