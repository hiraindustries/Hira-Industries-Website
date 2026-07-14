"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addLeadNote,
  archiveCustomer,
  archiveLead,
  archiveTask,
  completeTask,
  convertEnquiryToLead,
  convertLeadToCustomer,
  createCustomer,
  createLead,
  createOrUpdateTask,
  logLeadEvent,
  restoreCustomer,
  restoreLead,
  updateCustomer,
  updateLead,
} from "@/lib/admin/crm/mutations";
import { CrmUnavailableError } from "@/lib/admin/crm/availability";

async function runCrmAction<T>(action: () => Promise<T>) {
  try {
    return await action();
  } catch (error) {
    if (error instanceof CrmUnavailableError) {
      throw new Error(error.availability.message);
    }

    throw error;
  }
}

export async function convertEnquiryToLeadAction(formData: FormData) {
  const leadId = await runCrmAction(() => convertEnquiryToLead(formData));

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/leads");
  redirect(`/admin/leads/${leadId}`);
}

export async function createLeadAction(formData: FormData) {
  const leadId = await runCrmAction(() => createLead(formData));

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  redirect(`/admin/leads/${leadId}`);
}

export async function updateLeadAction(formData: FormData) {
  await runCrmAction(() => updateLead(formData));

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${formData.get("lead_id")}`);
  redirect(`/admin/leads/${formData.get("lead_id")}?updated=1`);
}

export async function addLeadNoteAction(formData: FormData) {
  await runCrmAction(() => addLeadNote(formData));

  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${formData.get("lead_id")}`);
}

export async function logLeadEventAction(formData: FormData) {
  await runCrmAction(() => logLeadEvent(formData));

  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${formData.get("lead_id")}`);
}

export async function archiveLeadAction(formData: FormData) {
  await runCrmAction(() => archiveLead(formData));

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  redirect("/admin/leads?archived=1");
}

export async function restoreLeadAction(formData: FormData) {
  await runCrmAction(() => restoreLead(formData));

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${formData.get("lead_id")}`);
}

export async function createOrUpdateTaskAction(formData: FormData) {
  await runCrmAction(() => createOrUpdateTask(formData));

  revalidatePath("/admin");
  revalidatePath("/admin/follow-ups");
  const leadId = formData.get("lead_id");
  const customerId = formData.get("customer_id");
  if (typeof leadId === "string" && leadId) {
    revalidatePath(`/admin/leads/${leadId}`);
  }
  if (typeof customerId === "string" && customerId) {
    revalidatePath(`/admin/customers/${customerId}`);
  }
}

export async function completeTaskAction(formData: FormData) {
  await runCrmAction(() => completeTask(formData));

  revalidatePath("/admin");
  revalidatePath("/admin/follow-ups");
  const leadId = formData.get("lead_id");
  if (typeof leadId === "string" && leadId) {
    revalidatePath(`/admin/leads/${leadId}`);
  }
}

export async function archiveTaskAction(formData: FormData) {
  await runCrmAction(() => archiveTask(formData));

  revalidatePath("/admin");
  revalidatePath("/admin/follow-ups");
}

export async function createCustomerAction(formData: FormData) {
  const customerId = await runCrmAction(() => createCustomer(formData));

  revalidatePath("/admin");
  revalidatePath("/admin/customers");
  redirect(`/admin/customers/${customerId}`);
}

export async function updateCustomerAction(formData: FormData) {
  await runCrmAction(() => updateCustomer(formData));

  revalidatePath("/admin");
  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${formData.get("customer_id")}`);
  redirect(`/admin/customers/${formData.get("customer_id")}?updated=1`);
}

export async function convertLeadToCustomerAction(formData: FormData) {
  const customerId = await runCrmAction(() => convertLeadToCustomer(formData));

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/customers");
  revalidatePath(`/admin/leads/${formData.get("lead_id")}`);
  redirect(`/admin/customers/${customerId}`);
}

export async function archiveCustomerAction(formData: FormData) {
  await runCrmAction(() => archiveCustomer(formData));

  revalidatePath("/admin");
  revalidatePath("/admin/customers");
  redirect("/admin/customers?archived=1");
}

export async function restoreCustomerAction(formData: FormData) {
  await runCrmAction(() => restoreCustomer(formData));

  revalidatePath("/admin");
  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${formData.get("customer_id")}`);
}
