'use server';

import {
  StaffSchema,
  UserFormSchema,
  EditUserFormSchema,
  staffType,
  addUserType,
  AddUserFormSchema,
} from '@/lib/definitions';
import { revalidatePath } from 'next/cache';
import { createAdminClient, createClient } from '@/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import { insert, remove } from '@/lib/supabase';
import { query } from '@/utils/supabase/supabase';

export type AccountState = {
  errors?: {
    email?: string[];
    password?: string[];
    first_name?: string[];
    last_name?: string[];
  };
  message?: string | null;
};

export type RegisterAccountState = {
  errors?: {
    staff_position?: string[];
  };
  message?: string | null;
};

async function getStaffId() {
  var staffData = await query.selectAll('staffs');
  var id_mod = 10000;
  if (staffData.data) {
    if (staffData.data.length > 0) {
      for (let i = 0; i < staffData.data!.length; i++) {
        var num = parseInt(staffData.data[i].staff_id.slice(6));
        if (num > id_mod) {
          id_mod = num;
        }
      }
      id_mod += 1;
    }
  }

  return `staff_${id_mod}`;
}

export async function createAccount(
  prevState: AccountState,
  formData: FormData,
) {
  const supabase = createAdminClient();
  const validatedFields = AddUserFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Unable to create event.',
    };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    email_confirm: true,
  });
  if (error) {
    throw new Error(error.message);
  }

  await createAccountDb(validatedFields.data, data.user.id);

  revalidatePath('/accounts');
  return {
    message: null,
  };
}

export async function editAccount(
  id: string,
  prevState: AccountState,
  formData: FormData,
) {
  const supabase = createAdminClient();
  const validatedFields = EditUserFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Unable to edit event.',
    };
  }

  const { error } = await supabase.auth.admin.updateUserById(id, {
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  await editAccountDb(
    { ...validatedFields.data, password: validatedFields.data.password || '' },
    id,
  );

  revalidatePath('/accounts');
  return {
    message: null,
  };
}

export async function selectOneUser(id: string) {
  const supabase = createClient();

  const { data } = await supabase.from('users').select().eq('user_id', id);
  return data;
}

export async function deleteAccount(id: string) {
  const supabase = createAdminClient();
  const supabase2 = createClient();

  const { error: error1 } = await supabase2
    .from('staffs')
    .update({ staff_status: false })
    .eq('user_id', id);
  if (error1) {
    throw new Error(error1.message);
  }

  const { error } = await supabase.auth.admin.deleteUser(id, false);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/accounts');
}

export async function registerAccount(
  id: string,
  prevState: RegisterAccountState,
  formData: FormData,
) {
  const validatedFields = StaffSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Unable to register account.',
    };
  }

  await createStaff(validatedFields.data, id);

  revalidatePath('/accounts');
  return {
    message: null,
  };
}

export async function editSTaffForm(
  id: string,
  prevState: RegisterAccountState,
  formData: FormData,
) {
  const validatedFields = StaffSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Unable to register account.',
    };
  }

  await editSTaff(validatedFields.data, id);

  revalidatePath('/accounts');
  return {
    message: null,
  };
}

export async function createStaff(data: staffType, userId: string) {
  const { error: staffError } = await insert('staffs', {
    staff_position: data.staff_position.toUpperCase(),
    user_id: userId,
    staff_id: await getStaffId(),
    staff_status: true,
  });

  if (staffError) {
    console.log(staffError);
  }
}

export async function editSTaff(data: staffType, userId: string) {
  const supabase = createClient();
  await supabase
    .from('staffs')
    .update({ staff_position: data.staff_position.toUpperCase() })
    .eq('user_id', userId)
    .select();
}

export async function getUserStaff(uuid: string) {
  noStore();
  const { data, error } = await selectOneAccountDb(uuid);

  if (error) {
    throw new Error(error.message);
  }

  return data?.map(user => {
    return {
      staff_name: user.staff_name,
      position: user.staff_position && user.staff_position.toLowerCase(),
    };
  })[0];
}

export async function getUsers() {
  noStore();
  const { data, error } = await selectAllAccountDb();

  if (error) {
    throw new Error(error.message);
  }

  return data?.map(user => {
    return {
      email: user.email,
      uuid: user.uuid,
      first_name: user.user_first_name,
      last_name: user.user_last_name,
      id: user.uuid,
      position: user.staff_position && user.staff_position.toLowerCase(),
    };
  });
}

export async function getUser(uuid: string) {
  noStore();
  const { data, error } = await selectOneAccountDb(uuid);

  if (error) {
    throw new Error(error.message);
  }

  return data?.map(user => {
    return {
      email: user.email,
      first_name: user.user_first_name,
      last_name: user.user_last_name,
      position: user.staff_position && user.staff_position.toLowerCase(),
    };
  })[0];
}

async function createAccountDb(data: addUserType, userId: string) {
  const { error: userError } = await insert('users', {
    user_first_name: data.first_name,
    user_last_name: data.last_name,
    user_id: userId,
  });

  if (userError) {
    console.log(userError);
  }
}

async function editAccountDb(data: addUserType, uuid: string) {
  const supabase = createAdminClient();
  const { data: userData, error } = await supabase
    .from('users')
    .update({
      user_first_name: data.first_name,
      user_last_name: data.last_name,
    })
    .eq('user_id', uuid)
    .select();

  if (!userData) {
    return;
  }

  if (error) {
    return error;
  }
}

async function deleteAccountDb(data: addUserType, id: string) {
  return remove('varSchema', 'var_id', id);
}

export async function selectOneAccountDb(uuid: string) {
  const supabase = createAdminClient();
  let { data, error } = await supabase
    .from('users_view')
    .select('*')
    .eq('uuid', uuid);

  return { data: data, error: error };
}

async function selectAllAccountDb() {
  const supabase = createAdminClient();
  let { data, error } = await supabase.from('users_view').select(`
    *
  `);
  return { data: data, error: error };
}
