
// INSTRUCTIONS:
// staff -> small case
// Staff -> big case
// replace vals with column names
// remove comments after

import { StaffSchema } from "@/lib/definitions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/supabase";

export type staffState = {
  errors?: {
    staff_id?: string[];   
    user_id?: string[];   
    staff_name?: string[];   
    staff_position?: string[];   
    staff_list_id?: string[];   
  }; 
  message?: string | null;
}

var staffFormat = {
  staff_id : null,  
  user_id : null,
  staff_name : null,
  staff_position : null,
  staff_list_id : null,

  /*
  CREATE TABLE IF NOT EXISTS staffs
  (
      staff_id VARCHAR(25),
      user_id VARCHAR(25),
      staff_name VARCHAR(55),
      staff_position VARCHAR(55),
      staff_list_id VARCHAR(25),
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (staff_list_id) REFERENCES staff_lists(staff_list_id),
      PRIMARY KEY (staff_id)
  );
  */
}

var schema = "StaffSchema" // replace with table name
var identifier = "staff_id"

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


async function createStaffValidation(prevState: staffState, formData: FormData) {

  var transformedData = transformData(formData)
  const validatedFields = StaffSchema.safeParse(transformedData)

  if (!validatedFields.success) {
    console.log(validatedFields.error)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Unable to create var."
    }
  }

  // TODO: provide logic
  var data = convertData(validatedFields)
  const { error } = await createStaff(data)
  if (error) {
    throw new Error(error.message)
  }

  //revalidatePath("/")
  return {
    message: null
  }
}

async function editStaffValidation(id: string, prevState: staffState, formData: FormData) {
  
  var transformedData = transformData(formData)
  const validatedFields = StaffSchema.safeParse(transformedData)

  if (!validatedFields.success) {
    console.log(validatedFields.error)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Unable to edit var."
    }
  }

  // TODO: provide logic
  var data = convertData(validatedFields.data)
  const { error } = await editStaff(data, id)
  if (error) {
    throw new Error(error.message)
  }

  //revalidatePath("/")
  return {
    message: null
  }
}

async function selectOneStaffValidation(id: string) {

  // TODO: provide logic
  const { data, error } = await selectOneStaff(id)
  if (error) {
    throw new Error(error.message)
  }

  //revalidatePath("/")
  return {
    data: data
  }
}

async function selectAllStaffValidation() {

  // TODO: provide logic
  const { data, error } = await selectAllStaff()
  if (error) {
    throw new Error(error.message)
  }

  //revalidatePath("/")
  return {
    data: data
  }
}


async function deleteStaffValidation(id: string) {

  // TODO: provide logic
  const { error } = await deleteStaff(id)
  if (error) {
    throw new Error(error.message)
  }

  //revalidatePath("/")
  return {
    message: null
  }
}

async function createStaff(data : any){
  return query.insert(schema, data);
}

async function editStaff(data : any, id : string){
  return query.edit(schema, data, identifier, id);
}

async function deleteStaff(id : string){
  return query.remove(schema, identifier, id);
}

async function selectOneStaff(id : string){
  return query.selectWhere(schema, identifier, id);
}

async function selectAllStaff(){
  return query.selectAll(schema);
}

export const staffQuery = { 
  createStaffValidation, createStaff,
  editStaffValidation, editStaff,
  deleteStaffValidation, deleteStaff,
  selectOneStaffValidation, selectOneStaff,
  selectAllStaffValidation, selectAllStaff
}