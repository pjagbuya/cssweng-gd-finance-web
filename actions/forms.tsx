'use server'

import { EventSchema } from "@/lib/definitions";
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache";

export type State = {
  errors?: {
    name?: string;
  };
  message?: string | null;
}

export async function createFundTransfer(prevState: State, formData: FormData) {
  const validatedFields = EventSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    console.log(validatedFields.error)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Unable to create event."
    }
  }

  // TODO: provide logic

  revalidatePath("")
  redirect("/")
}

export async function editForm(prevState: State, formData: FormData) {
  const validatedFields = EventSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    console.log(validatedFields.error)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Unable to edit event."
    }
  }

  // TODO: provide logic

  revalidatePath("")
  redirect("/")
}

export async function deleteFundTransfer(id: string) {

  // TODO: provide logic

  revalidatePath("")
}
