export interface Feedback {
  title: string;
  category: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
}

export async function submitSystemFeedback(feedback: Feedback): Promise<void> {
  // Mock submit
  console.log('Submitting system feedback:', feedback);
  await new Promise((r) => setTimeout(r, 300));
}


