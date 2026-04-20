import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const COLLECTION = 'entries'

export async function addEntry(userId, data) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function getEntries(userId) {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId)
  )
  const snapshot = await getDocs(q)
  const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  return docs.sort((a, b) => {
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0
    return timeB - timeA
  })
}

export async function updateEntry(id, data) {
  const ref = doc(db, COLLECTION, id)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export async function deleteEntry(id) {
  await deleteDoc(doc(db, COLLECTION, id))
}
