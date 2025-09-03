import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
  query,
  where,
  QueryDocumentSnapshot,
} from "firebase/firestore";

type PlanDoc = {
  name: string;
  price: number;
  frequency: string;
  description: string;
  imageUrl?: string;
  [key: string]: any;
};

export type Plan = PlanDoc & { id: string };

// Add a subscription plan
export async function addPlan(plan: PlanDoc) {
  return await addDoc(collection(db, "plans"), plan);
}

// Get all subscription plans
export async function getPlans(): Promise<Plan[]> {
  const snapshot = await getDocs(collection(db, "plans"));
  return snapshot.docs.map((d: QueryDocumentSnapshot) => ({
    id: d.id,
    ...(d.data() as PlanDoc),
  }));
}

// Update a plan
export async function updatePlan(planId: string, data: any) {
  return await updateDoc(doc(db, "plans", planId), data);
}

// Delete a plan
export async function deletePlan(planId: string) {
  return await deleteDoc(doc(db, "plans", planId));
}

// Get a single plan
export async function getPlan(planId: string) {
  const planDoc = await getDoc(doc(db, "plans", planId));
  return planDoc.exists() ? { id: planDoc.id, ...planDoc.data() } : null;
}

// Add a subscription
export async function addSubscription(sub: {
  userId: string;
  planId: string;
  status: string;
  nextBillingDate: string;
  stripeSubscriptionId: string;
}) {
  return await addDoc(collection(db, "subscriptions"), sub);
}

// Get subscriptions for a user
export async function getUserSubscriptions(userId: string) {
  // Query subscriptions for the specific user instead of fetching all documents
  const q = query(collection(db, "subscriptions"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
    id: doc.id,
    ...(doc.data() as {
      userId: string;
      planId: string;
      status: string;
      nextBillingDate: string;
      stripeSubscriptionId: string;
      [key: string]: any;
    }),
  }));
}

// Get user profile by uid
export async function getUserProfile(uid: string) {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
}

// Create or update user profile (set with uid as doc id)
export async function setUserProfile(
  uid: string,
  data: {
    email?: string;
    role?: string;
    subscriptionId?: string;
    activePlan?: string;
  }
) {
  return await setDoc(doc(db, "users", uid), data, { merge: true });
}

// Update subscription status
export async function updateSubscriptionStatus(
  subId: string,
  status: string,
  nextBillingDate?: string | null
) {
  const update: any = { status };
  if (nextBillingDate !== undefined) update.nextBillingDate = nextBillingDate;
  return await updateDoc(doc(db, "subscriptions", subId), update);
}

// Change subscription plan
export async function changeSubscriptionPlan(subId: string, newPlanId: string) {
  return await updateDoc(doc(db, "subscriptions", subId), { planId: newPlanId });
}

// Cancel subscription (soft cancel)
export async function cancelSubscription(subId: string) {
  return await updateSubscriptionStatus(subId, "canceled");
}

// Pause subscription
export async function pauseSubscription(subId: string) {
  return await updateSubscriptionStatus(subId, "paused");
}

// Get all subscriptions (admin use)
export async function getAllSubscriptions() {
  const snapshot = await getDocs(collection(db, "subscriptions"));
  return snapshot.docs.map((d: QueryDocumentSnapshot) => ({
    id: d.id,
    ...(d.data() as {
      userId: string;
      planId: string;
      status: string;
      nextBillingDate: string;
      stripeSubscriptionId: string;
      [key: string]: any;
    }),
  }));
}
