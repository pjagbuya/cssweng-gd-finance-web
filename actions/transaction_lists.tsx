// INSTRUCTIONS:
// transactionList -> small case
// TransactionList -> big case
// replace vals with column names
// remove comments after

import { TransactionListSchema } from '@/lib/definitions';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import * as query from '@/lib/supabase';
import * as transactionQuery from '@/actions/transactions';

export type transactionListState = {
  errors?: {
    transaction_list_id?: string[];
  };
  message?: string | null;
};

var transactionListFormat = {
  transaction_list_id: null,

  /*
    CREATE TABLE IF NOT EXISTS transaction_lists
    (
        transaction_list_id VARCHAR(25),
        PRIMARY KEY (transaction_list_id)
    );
  */
};

var schema = 'transaction_lists'; // replace with table name

async function transformData(data: any) {
  var arrayData = Array.from(data.entries());
  // TODO: provide logic

  // TODO: fill information
  var transformedData = {};
  return transformedData;
}

async function convertData(data: any) {
  // TODO: provide logic

  // JUST IN CASE: needs to do something with other data of validated fields
  return data.data;
}

export async function createTransactionListValidation(
  prevState: transactionListState,
  formData: FormData,
) {
  var transformedData = transformData(formData);
  const validatedFields = TransactionListSchema.safeParse(transformedData);

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Unable to create var.',
    };
  }

  // TODO: provide logic
  var data = convertData(validatedFields);
  const { error } = await createTransactionList(data);
  if (error) {
    throw new Error(error.message);
  }

  //revalidatePath("/")
  return {
    message: null,
  };
}

export async function editTransactionListValidation(
  id: string,
  identifier: string,
  prevState: transactionListState,
  formData: FormData,
) {
  var transformedData = transformData(formData);
  const validatedFields = TransactionListSchema.safeParse(transformedData);

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Unable to edit var.',
    };
  }

  // TODO: provide logic
  var data = convertData(validatedFields.data);
  const { error } = await editTransactionList(data, id, identifier);
  if (error) {
    throw new Error(error.message);
  }

  //revalidatePath("/")
  return {
    message: null,
  };
}

export async function selectWhereTransactionListValidation(
  id: string,
  identifier: string,
) {
  // TODO: provide logic
  const { data, error } = await selectWhereTransactionList(id, identifier);
  if (error) {
    throw new Error(error.message);
  }

  //revalidatePath("/")
  return {
    data: data,
  };
}

export async function selectAllTransactionListValidation() {
  // TODO: provide logic
  const { data, error } = await selectAllTransactionList();
  if (error) {
    throw new Error(error.message);
  }

  //revalidatePath("/")
  return {
    data: data,
  };
}

export async function deleteTransactionListValidation(
  id: string,
  identifier: string,
) {
  // TODO: provide logic
  var transactionData = await transactionQuery.selectWhereTransactionValidation(
    id,
    identifier,
  );

  if (transactionData.data) {
    for (let i = 0; i < transactionData.data.length; i++) {
      await transactionQuery.deleteTransactionValidation(
        null,
        transactionData.data[i].transaction_id,
        'transaction_id',
      );
    }
  }

  const { error } = await deleteTransactionList(id, identifier);
  if (error) {
    throw new Error(error.message);
  }

  //revalidatePath("/")
  return {
    message: null,
  };
}

export async function createTransactionList(data: any) {
  return await query.insert(schema, data);
}

export async function editTransactionList(
  data: any,
  id: string,
  identifier: string,
) {
  return await query.edit(schema, data, identifier, id);
}

export async function deleteTransactionList(id: string, identifier: string) {
  return await query.remove(schema, identifier, id);
}

export async function selectWhereTransactionList(
  id: string,
  identifier: string,
) {
  return await query.selectWhere(schema, identifier, id);
}

export async function selectAllTransactionList() {
  return await query.selectAll(schema);
}
