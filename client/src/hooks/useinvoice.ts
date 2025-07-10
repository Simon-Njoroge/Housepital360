import {
  useAllItems,
  useItemById,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
} from "@/utils/hookClient";
import type { TInvoice } from "@/types/types";
import {
  getAllInvoices,
  getAllInvoicesByPatientId,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "@/data/invoiceapi";

export const useAllInvoices = () =>
  useAllItems<TInvoice>(["allInvoices"], getAllInvoices);

export const useAllInvoicesByPatientId = (userId: string) =>
  useAllItems<TInvoice>(["allInvoices", userId], () => getAllInvoicesByPatientId(userId));

export const useInvoiceById = (id: string) =>
  useItemById<TInvoice>(["invoice"], getInvoiceById, id);

export const useAddInvoice = () =>
  useAddItem<TInvoice>(["allInvoices"], createInvoice);

export const useUpdateInvoiceById = () =>
  useUpdateItem<TInvoice>(["allInvoices"], updateInvoice);

export const useDeleteInvoiceById = () =>
  useDeleteItem(["allInvoices"], deleteInvoice);