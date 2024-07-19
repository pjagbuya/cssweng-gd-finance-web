
// INSTRUCTIONS:
// staffList -> small case
// StaffList -> big case
// replace vals with column names
// remove comments after

import { StaffListSchema } from "@/lib/definitions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/supabase";

export type staffListState = {
  errors?: {
    staff_list_id?: string[];    
  }; 
  message?: string | null;
}

var staffListFormat = {
  staff_list_id : null,

  /*
    CREATE TABLE IF NOT EXISTS staff_lists
    (
        staff_list_id VARCHAR(25),
        PRIMARY KEY (staff_list_id)
    );
  */
}

var schema = "StaffListSchema" // replace with table name
var identifier = "staffList_id"

async function transformData(data : any){

  var arrayData = Array.from(data.entries())
  // TODO: provide logic

  // TODO: fill information
  var transformedData = {

  }
  return transformedData
}

async function convertData(data : any){

  // TODO: provide logic

  // JUST IN CASE: needs to do something with other data of validated fields
  return data.data
}


async function createStaffListValidation(prevState: staffListState, formData: FormData) {

  var transformedData = transformData(formData)
  const validatedFields = StaffListSchema.safeParse(transformedData)

  if (!validatedFields.success) {
    console.log(validatedFields.error)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Unable to create var."
    }
  }

  // TODO: provide logic
  var data = convertData(validatedFields)
  const { error } = await createStaffList(data)
  if (error) {
    throw new Error(error.message)
  }

  //revalidatePath("/")
  return {
    message: null
  }
}

async function editStaffListValidation(id: string, prevState: staffListState, formData: FormData) {
  
  var transformedData = transformData(formData)
  const validatedFields = StaffListSchema.safeParse(transformedData)

  if (!validatedFields.success) {
    console.log(validatedFields.error)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Unable to edit var."
    }
  }

  // TODO: provide logic
  var data = convertData(validatedFields.data)
  const { error } = await editStaffList(data, id)
  if (error) {
    throw new Error(error.message)
  }

  //revalidatePath("/")
  return {
    message: null
  }
}

async function selectOneStaffListValidation(id: string) {

  // TODO: provide logic
  const { data, error } = await selectOneStaffList(id)
  if (error) {
    throw new Error(error.message)
  }

  //revalidatePath("/")
  return {
    data: data
  }
}

async function selectAllStaffListValidation() {

  // TODO: provide logic
  const { data, error } = await selectAllStaffList()
  if (error) {
    throw new Error(error.message)
  }

  //revalidatePath("/")
  return {
    data: data
  }
}


async function deleteStaffListValidation(id: string) {

  // TODO: provide logic
  const { error } = await deleteStaffList(id)
  if (error) {
    throw new Error(error.message)
  }

  //revalidatePath("/")
  return {
    message: null
  }
}

async function createStaffList(data : any){
  return query.insert(schema, data);
}

async function editStaffList(data : any, id : string){
  return query.edit(schema, data, identifier, id);
}

async function deleteStaffList(id : string){
  return query.remove(schema, identifier, id);
}

async function selectOneStaffList(id : string){
  return query.selectWhere(schema, identifier, id);
}

async function selectAllStaffList(){
  return query.selectAll(schema);
}

export const staffListQuery = { 
  createStaffListValidation, createStaffList,
  editStaffListValidation, editStaffList,
  deleteStaffListValidation, deleteStaffList,
  selectOneStaffListValidation, selectOneStaffList,
  selectAllStaffListValidation, selectAllStaffList
}