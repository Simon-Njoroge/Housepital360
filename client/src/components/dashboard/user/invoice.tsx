'use client';

import { useStore } from '@tanstack/react-store';
import { authStore } from '@/store/authstore';
import { useInvoiceStoreActions } from '@/store/invoicestore';
import { cn } from '@/lib/utils';
import { useTheme } from '@/utils/themeProvider';
import { Button } from '@/components/ui/button';
import {
  FaFileInvoiceDollar,
  FaDownload,
  FaMoneyCheckAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUndo,
  FaHourglassHalf,
} from 'react-icons/fa';
import { useState } from 'react';
import { InvoiceStatus } from '@/types/types';

const statusIcons: Record<InvoiceStatus, JSX.Element> = {
  [InvoiceStatus.PAID]: <FaCheckCircle className="text-green-500" />,
  [InvoiceStatus.DRAFT]: <FaHourglassHalf className="text-yellow-500" />,
  [InvoiceStatus.ISSUED]: <FaClock className="text-blue-500" />,
  [InvoiceStatus.PARTIALLY_PAID]: <FaCheckCircle className="text-teal-500" />,
  [InvoiceStatus.CANCELLED]: <FaTimesCircle className="text-red-500" />,
  [InvoiceStatus.REFUNDED]: <FaUndo className="text-purple-500" />,
};

const InvoicePanel = () => {
  const { userId } = useStore(authStore);
  const { invoices: invoiceData, isLoading, error } = useInvoiceStoreActions(userId ?? undefined);
  const { theme } = useTheme();

  const invoices = (invoiceData as any)?.invoices || [];
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredInvoices =
    filterStatus === 'all'
      ? invoices
      : invoices.filter((invoice:any) => invoice.status === filterStatus);

  const totalPaid = invoices.reduce(
    (sum:any, invoice:any) =>
      invoice.status === InvoiceStatus.PAID
        ? sum + parseFloat(invoice.grand_total)
        : sum,
    0,
  );

  const downloadCSV = (invoice: any) => {
    const headers = Object.keys(invoice).join(',');
    const values = Object.values(invoice).join(',');
    const csvContent = `${headers}\n${values}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${invoice.invoice_number}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={cn(
        'p-6 space-y-6 min-h-screen',
        theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900',
      )}
    >
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <FaFileInvoiceDollar /> Invoice Overview
      </h2>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg shadow-md bg-blue-100 dark:bg-blue-800">
          <h3 className="text-lg font-semibold mb-1">Total Paid</h3>
          <p className="text-xl font-bold">KES {totalPaid.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label htmlFor="filter" className="text-sm font-medium">
          Filter by Status:
        </label>
        <select
          id="filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded-md bg-white dark:bg-zinc-800 dark:text-white"
        >
          <option value="all">All</option>
          {Object.values(InvoiceStatus).map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500">Error loading invoices: {error.message}</p>}

      {isLoading ? (
        <p>Loading invoices...</p>
      ) : filteredInvoices.length === 0 ? (
        <p className="text-muted-foreground">No invoices found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800">
                <th className="text-left px-4 py-2 border dark:border-zinc-700">Invoice #</th>
                <th className="text-left px-4 py-2 border dark:border-zinc-700">Issue Date</th>
                <th className="text-left px-4 py-2 border dark:border-zinc-700">Due Date</th>
                <th className="text-left px-4 py-2 border dark:border-zinc-700">Status</th>
                <th className="text-left px-4 py-2 border dark:border-zinc-700">Grand Total (KES)</th>
                <th className="text-left px-4 py-2 border dark:border-zinc-700">Balance Due (KES)</th>
                <th className="text-left px-4 py-2 border dark:border-zinc-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice: any) => (
                <tr
                  key={invoice.invoice_number}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <td className="px-4 py-2 border dark:border-zinc-700">{invoice.invoice_number}</td>
                  <td className="px-4 py-2 border dark:border-zinc-700">
                    {new Date(invoice.issue_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border dark:border-zinc-700">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border dark:border-zinc-700">
                    <div className="flex items-center gap-2">
                      {statusIcons[invoice.status]}
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          invoice.status === InvoiceStatus.DRAFT
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : invoice.status === InvoiceStatus.ISSUED
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : invoice.status === InvoiceStatus.PAID
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : invoice.status === InvoiceStatus.PARTIALLY_PAID
                            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                            : invoice.status === InvoiceStatus.CANCELLED
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : invoice.status === InvoiceStatus.REFUNDED
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                        )}
                      >
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1).toLowerCase().replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 border dark:border-zinc-700">
                    {parseFloat(invoice.grand_total).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border dark:border-zinc-700">
                    {parseFloat(invoice.balance_due).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border dark:border-zinc-700">
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" onClick={() => downloadCSV(invoice)}>
                        <FaDownload className="mr-1" /> CSV
                      </Button>
                      {(invoice.status === InvoiceStatus.DRAFT ||
                        invoice.status === InvoiceStatus.ISSUED) && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          <FaMoneyCheckAlt className="mr-1" /> Pay Now
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoicePanel;
