
import * as z from 'zod';

export const customerSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  category: z.string(),
  isCashSale: z.boolean().default(false),
  openingBalance: z.string(),
  openingBalanceDate: z.date().optional(),
  autoAllocateReceipts: z.boolean().default(false),
  isActive: z.boolean().default(true),
  creditLimit: z.string(),
  vatNumber: z.string().optional(),
  salesRep: z.string().optional(),
  acceptsElectronicInvoices: z.boolean().default(false),
  postalAddress: z.object({
    line1: z.string().min(1, 'Address line 1 is required'),
    line2: z.string().optional(),
    line3: z.string().optional(),
    line4: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
  deliveryAddress: z.object({
    type: z.string(),
    line1: z.string().min(1, 'Address line 1 is required'),
    line2: z.string().optional(),
    line3: z.string().optional(),
    line4: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
  contactDetails: z.object({
    contactName: z.string().min(1, 'Contact name is required'),
    email: z.string().email('Invalid email address'),
    telephone: z.string().min(1, 'Telephone number is required'),
    mobile: z.string().min(1, 'Mobile number is required'),
    fax: z.string().optional(),
    webAddress: z.string().optional(),
    canViewInvoicesOnline: z.boolean().default(false),
  }),
  defaultSettings: z.object({
    statementDistribution: z.string().optional(),
    defaultDiscount: z.string(),
    defaultPriceList: z.string().optional(),
    paymentDueDays: z.string().optional(),
    paymentDueType: z.string(),
  }),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
