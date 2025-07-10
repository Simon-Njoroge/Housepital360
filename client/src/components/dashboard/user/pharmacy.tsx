import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FaPills, FaInfoCircle, FaCapsules, FaHeartbeat, FaFlask, FaCheckCircle, FaTimesCircle, FaIndustry, FaPlus, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMedicationCatalogStoreActions } from '@/store/usemedicalcatalogstore';
import { useMedicationRequestStoreActions } from '@/store/medicalrequest';
import { authStore } from "@/store/authstore";
import { useStore } from '@tanstack/react-store';
import { Toaster, toast } from 'sonner';
import { usePharmacyInventoryStoreActions } from '@/store/pharmacyinventorystore';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FaDownload } from 'react-icons/fa';

export default function PharmacyPanel() {
  const { userId } = useStore(authStore);
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const { catalogs, isLoading, error } = useMedicationCatalogStoreActions();
  const { medicationRequests, isLoading: isMedical, error: mederror,addMedicationRequest } = useMedicationRequestStoreActions(userId);
  const { inventories, isLoading: isInventory, error: inventoryerror } = usePharmacyInventoryStoreActions();

  const handleAddToCart = (inventory: any) => {
    setCart(prev => [...prev, {
      patient_id: userId,
      medication_id: inventory.medication_id,
      inventory_id: inventory.id,
      reason: '',
      quantity: 1,
    }]);
  };

  const handleUpdateCart = (index: number, field: string, value: any) => {
    const updated = [...cart];
    updated[index][field] = value;
    setCart(updated);
  };

  const handleRemoveFromCart = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
  };

const handleDownloadCSV = (request: any) => {
  const csvContent = `Medication, Dosage, Quantity, Frequency, Duration, Requested At, Batch, Status\n${request.medication.name}, ${request.dosage || '-'}, ${request.quantity}, ${request.frequency || '-'}, ${request.duration || '-'}, ${new Date(request.requested_at).toLocaleDateString()}, ${request.inventory?.batch_number || '-'}, ${request.status}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${request.medication.name}_request.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleConfirmPurchase = async () => {
  try {
    if (!Array.isArray(cart) || cart.length === 0) {
      toast.error('❌ Your cart is empty.');
      return;
    }

    await addMedicationRequest({ items: cart }); 

    toast.success('✅ Invoice sent to your email!');
    setCart([]);
    setOpen(false);
  } catch (e: any) {
    toast.error(`❌ ${e.message}`);
  }
};


  return (
    <>
      <Toaster />
      <div className="p-4 w-full">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2 items-center rounded-xl shadow-md w-full sm:w-auto">
              <FaPills className="text-white" /> View Our Medication Catalog
            </Button>
          </DialogTrigger>

          <DialogContent className="w-full sm:max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-lg px-4 sm:px-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary border-b pb-2">
                🧪 Medication Catalog
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-6 h-[70vh] overflow-hidden">
              <ScrollArea className="h-[50%] pr-2">
                {isLoading || isInventory ? (
                  <div className="text-center py-6 text-muted-foreground">Loading catalog...</div>
                ) : error || inventoryerror ? (
                  <div className="text-center py-6 text-red-500">Failed to load data.</div>
                ) : (catalogs as any).length === 0 || (inventories as any).length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">No medications available.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {(inventories as any).map((inv: any) => {
                      const med = (catalogs as any).find((m:any) => m.id === inv.medication_id);
                      if (!med) return null;
                      return (
                        <div key={inv.id} className="border bg-background dark:bg-gray-800 border-border rounded-2xl p-4 shadow-sm transition hover:shadow-md">
                          <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-2">
                            <FaCapsules className="text-blue-500" /> {med.name}{' '}
                            <span className="text-sm text-muted-foreground">({med.strength})</span>
                          </h3>

                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            <FaInfoCircle className="inline mr-1 text-blue-400" />{' '}
                            {med.description || 'No description provided.'}
                          </p>

                          <div className="text-sm space-y-1 text-muted-foreground">
                            <div><strong>Generic:</strong> {med.generic_name}</div>
                            <div><strong>Form:</strong> {med.form}</div>
                            <div><strong>Batch:</strong> {inv.batch_number}</div>
                            <div><strong>Price:</strong> KES {inv.price}</div>
                            <div className="flex items-center gap-1">
                              {med.is_controlled ? <><FaCheckCircle className="text-red-500" /><span className="text-red-600 font-medium">Controlled</span></> : <><FaTimesCircle className="text-green-500" /><span className="text-green-600">Non-Controlled</span></>}
                            </div>
                          </div>

                          <Button size="sm" className="mt-4 w-full flex gap-2 items-center" onClick={() => handleAddToCart(inv)}>
                            <FaPlus /> Add to Order
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              {cart.length > 0 && (
                <div className="flex flex-col gap-2 overflow-y-auto h-[50%] border-t pt-4">
                  <h3 className="text-lg font-semibold text-primary">🛒 Order Summary</h3>
                  <ScrollArea className="flex-1 overflow-y-auto pr-2 border rounded-md p-2">
                    {cart.map((item, idx) => {
                      const med = (catalogs as any).find(m => m.id === item.medication_id);
                      const inv = (inventories as any).find(i => i.id === item.inventory_id);
                      return (
                        <div key={idx} className="border-b pb-2 mb-2">
                          <div className="flex justify-between items-center">
                            <div className="font-medium text-blue-700">{med?.name || 'Medication'} ({inv?.batch_number})</div>
                            <Button size="icon" variant="ghost" onClick={() => handleRemoveFromCart(idx)}><FaTrash /></Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <Input placeholder="Reason" value={item.reason} onChange={(e) => handleUpdateCart(idx, 'reason', e.target.value)} />
                            <Input type="number" min={1} placeholder="Quantity" value={item.quantity} onChange={(e) => handleUpdateCart(idx, 'quantity', parseInt(e.target.value))} />
                          </div>
                        </div>
                      );
                    })}
                  </ScrollArea>

                  <DialogFooter className="pt-2">
                    <div className="w-full flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        🛒 {cart.length} item(s) in order
                      </div>
                      <Button onClick={handleConfirmPurchase} className="bg-green-600 hover:bg-green-700">
                        <FaShoppingCart className="mr-2" /> Confirm Purchase
                      </Button>
                    </div>
                  </DialogFooter>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* table */}
{/* Medication Requests Table */}
<div className="mt-10">
  <h2 className="text-xl font-semibold mb-4 text-primary">Your Medication Requests</h2>
  {isMedical ? (
    <div className="text-center text-muted-foreground">Loading your medication requests...</div>
  ) : mederror ? (
    <div className="text-center text-red-500">Error loading medication requests</div>
  ) : medicationRequests?.length === 0 ? (
    <div className="text-center text-muted-foreground">No medication requests found.</div>
  ) : (
    <div className="overflow-x-auto rounded-xl border border-border shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="border-b p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">#</th>
            <th className="border-b p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Medication</th>
            <th className="border-b p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Dosage</th>
            <th className="border-b p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Qty</th>
            <th className="border-b p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Frequency</th>
            <th className="border-b p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Duration</th>
            <th className="border-b p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Requested At</th>
            <th className="border-b p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Batch</th>
            <th className="border-b p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
            <th className="border-b p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicationRequests?.map((r, idx) => {
            const status = r.status.toUpperCase();
            const statusIcon = {
              PENDING: <FaHeartbeat className="text-yellow-500 animate-pulse" />,
              APPROVED: <FaCheckCircle className="text-blue-500 animate-bounce" />,
              REJECTED: <FaTimesCircle className="text-red-500" />,
              FULFILLED: <FaCheckCircle className="text-green-600" />,
              CANCELLED: <FaTimesCircle className="text-gray-400" />,
            }[status];

            return (
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="p-2 text-sm text-gray-600 dark:text-gray-300">{idx + 1}</td>
                <td className="p-2 text-sm font-medium text-gray-800 dark:text-gray-100">{r.medication.name}</td>
                <td className="p-2 text-sm text-gray-600 dark:text-gray-400">{r.dosage || '-'}</td>
                <td className="p-2 text-sm text-gray-600 dark:text-gray-400">{r.quantity}</td>
                <td className="p-2 text-sm text-gray-600 dark:text-gray-400">{r.frequency || '-'}</td>
                <td className="p-2 text-sm text-gray-600 dark:text-gray-400">{r.duration || '-'}</td>
                <td className="p-2 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(r.requested_at).toLocaleDateString()}
                </td>
                <td className="p-2 text-sm text-gray-600 dark:text-gray-400">
                  {r.inventory?.batch_number || '-'}
                </td>
                <td className="p-2 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  {statusIcon} {r.status}
                </td>
                <td className="p-2 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-red-100 dark:hover:bg-red-900 transition flex items-center gap-2"
                    onClick={() => handleDeleteRequest(r.id)}
                  >
                    <FaTrash className="text-red-500 animate-pulse" /> Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-blue-100 dark:hover:bg-blue-900 transition flex items-center gap-2"
                    onClick={() => handleDownloadCSV(r)}
                  >
                    <FaDownload className="text-blue-500" /> Download CSV
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>
    </>
  );
}
