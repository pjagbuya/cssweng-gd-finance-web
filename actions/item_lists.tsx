'use server';

// INSTRUCTIONS:
// itemList -> small case
// ItemList -> big case
// replace vals with column names
// remove comments after

import { ItemListSchema } from '@/lib/definitions';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import * as query from '@/lib/supabase';
import * as itemQuery from '@/actions/items';

export type itemListState = {
  errors?: {
    item_list_id?: string[];
  };
  message?: string | null;
};

var itemListFormat = {
  item_list_id: null,

  /*
    CREATE TABLE IF NOT EXISTS item_lists
    (
        item_list_id VARCHAR(25),
        PRIMARY KEY (item_list_id)
    );
  */
};

var schema = 'item_lists'; // replace with table name

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

export async function createItemListValidation(
  prevState: itemListState,
  formData: FormData,
) {
  var transformedData = transformData(formData);
  const validatedFields = ItemListSchema.safeParse(transformedData);

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Unable to create var.',
    };
  }

  // TODO: provide logic
  var data = convertData(validatedFields);
  const { error } = await createItemList(data);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/category');
  return {
    message: null,
  };
}

export async function editItemListValidation(
  id: string,
  identifier: string,
  prevState: itemListState,
  formData: FormData,
) {
  var transformedData = transformData(formData);
  const validatedFields = ItemListSchema.safeParse(transformedData);

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Unable to edit var.',
    };
  }

  // TODO: provide logic
  var data = convertData(validatedFields.data);
  const { error } = await editItemList(data, id, identifier);
  if (error) {
    throw new Error(error.message);
  }

  //revalidatePath("/")
  return {
    message: null,
  };
}

export async function selectWhereItemListValidation(
  id: string,
  identifier: string,
) {
  // TODO: provide logic
  const { data, error } = await selectWhereItemList(id, identifier);
  if (error) {
    throw new Error(error.message);
  }

  //revalidatePath("/")
  return {
    data: data,
  };
}

export async function selectAllItemListValidation() {
  // TODO: provide logic
  const { data, error } = await selectAllItemList();
  if (error) {
    throw new Error(error.message);
  }

  //revalidatePath("/")
  return {
    data: data,
  };
}

export async function deleteItemListValidation(id: string, identifier: string) {
  // TODO: provide logic
  var itemData = await itemQuery.selectWhereItemValidation(id, identifier);

  if (itemData.data) {
    for (let i = 0; i < itemData.data.length; i++) {
      await itemQuery.deleteItemValidation(
        null,
        itemData.data[i].item_id,
        'item_id',
      );
    }
  }

  const { error } = await deleteItemList(id, identifier);
  if (error) {
    throw new Error(error.message);
  }

  //revalidatePath("/")
  return {
    message: null,
  };
}

export async function createItemList(data: any) {
  return await query.insert(schema, data);
}

export async function editItemList(data: any, id: string, identifier: string) {
  return await query.edit(schema, data, identifier, id);
}

export async function deleteItemList(id: string, identifier: string) {
  return await query.remove(schema, identifier, id);
}

export async function selectWhereItemList(id: string, identifier: string) {
  return await query.selectWhere(schema, identifier, id);
}

export async function selectAllItemList() {
  return await query.selectAll(schema);
}
