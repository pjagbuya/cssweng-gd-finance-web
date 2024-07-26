'use server';

import { createClient } from '@/utils/supabase/server';

export async function insert(schema: any, data: any) {
  const supabase = createClient();

  const { error } = await supabase.from(schema).insert(data);
  return error;
}

export async function edit(schema: any, data: any, column: any, value: any) {
  const supabase = createClient();

  const { error } = await supabase.from(schema).update(data).eq(column, value);
  return error;
}

export async function remove(schema: any, column: any, value: any) {
  const supabase = createClient();

  const { error } = await supabase.from(schema).delete().eq(column, value);
  return error;
}

export async function selectAll(schema: any) {
  const supabase = createClient();

  const { data, error } = await supabase.from(schema).select();
  return { data, error };
}

export async function selectWhere(schema: any, column: any, value: any) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(schema)
    .select()
    .eq(column, value);
  return { data, error };
}

/*
const { data, error } = await supabase.from(schema).select().eq(column, var)
const { error } = await supabase.from(schema).insert(data)
const { error } = await supabase.from(schema).update(data).eq(column, value)
const { error } = await supabase.from(schema).delete().eq(column, var)
*/
