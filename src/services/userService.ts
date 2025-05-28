
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const searchUsers = async (searchTerm: string) => {
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('username'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return users.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};
