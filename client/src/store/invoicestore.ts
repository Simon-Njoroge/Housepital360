import { useAllInvoices,useAllInvoicesByPatientId,useInvoiceById,useAddInvoice,useUpdateInvoiceById,useDeleteInvoiceById } from '@/hooks/useinvoice';
import type { TInvoice } from '@/types/types';
import { Store } from '@tanstack/store';

// store state type
type InvoiceStoreType = {
  invoices: TInvoice[] | undefined;
  isLoading: boolean;
  error: string | null;
};

export const invoiceStore = new Store<InvoiceStoreType>({
  invoices: undefined,
  isLoading: false,
  error: null,
});

// CRUD actions hooks
export function useInvoiceStoreActions(userId?: string) {
  const {
    data: invoices,
    isLoading,
    error,
    refetch,
  } = userId
    ? useAllInvoicesByPatientId(userId)
    : useAllInvoices();

  const addInvoiceMutation = useAddInvoice();
  const updateInvoiceMutation = useUpdateInvoiceById();
  const deleteInvoiceMutation = useDeleteInvoiceById();

  // Sync store state
  invoiceStore.setState({
    invoices,
    isLoading,
    error: error ? String(error) : null,
  });

  const getInvoiceById = (id: string) => {
    return useInvoiceById(id);
  };

  const addInvoice = async (invoice: Partial<TInvoice>) => {
    const newInvoice = await addInvoiceMutation.mutateAsync(invoice);
    await refetch();
    return newInvoice;
  };

  const updateInvoiceById = async (
    id: string | number,
    invoice: Partial<TInvoice>,
  ) => {
    const updatedInvoice = await updateInvoiceMutation.mutateAsync({ id, data: invoice });
    await refetch();
    return updatedInvoice;
  };

  const deleteInvoiceById = async (id: string | number) => {
    await deleteInvoiceMutation.mutateAsync(id);
    await refetch();
  };

  return {
    invoices,
    isLoading,
    error,
    getInvoiceById,
    addInvoice,
    updateInvoiceById,
    deleteInvoiceById,
    refetchInvoices: refetch,
  };
}
