export interface Complaint {
  bookingId: string;
  caregiverId?: string;
  careseekerId?: string;
  reason: string;
  content: string;
  fileUrl?: string;
  sendToAdmin: boolean;
  createdAt: string;
}

export async function submitComplaint(complaint: Complaint): Promise<void> {
  console.log('Submitting complaint:', complaint);
  await new Promise((r) => setTimeout(r, 300));
}


