
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  increment,
  getDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  duration: string;
  likes: number;
  views: number;
  comments: number;
  coverUrl: string;
  audioUrl: string;
  isPublic: boolean;
  style?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrackUpload {
  title: string;
  artist: string;
  artistId: string;
  audioFile: File;
  coverFile: File;
  isPublic: boolean;
  style?: string;
}

export const uploadTrack = async (trackData: TrackUpload): Promise<string> => {
  try {
    // Upload do arquivo de áudio
    const audioRef = ref(storage, `tracks/audio/${Date.now()}_${trackData.audioFile.name}`);
    const audioSnapshot = await uploadBytes(audioRef, trackData.audioFile);
    const audioUrl = await getDownloadURL(audioSnapshot.ref);

    // Upload da capa
    const coverRef = ref(storage, `tracks/covers/${Date.now()}_${trackData.coverFile.name}`);
    const coverSnapshot = await uploadBytes(coverRef, trackData.coverFile);
    const coverUrl = await getDownloadURL(coverSnapshot.ref);

    // Criar documento da música no Firestore
    const track: Omit<Track, 'id'> = {
      title: trackData.title,
      artist: trackData.artist,
      artistId: trackData.artistId,
      duration: '0:00', // Será calculado no frontend
      likes: 0,
      views: 0,
      comments: 0,
      coverUrl,
      audioUrl,
      isPublic: trackData.isPublic,
      style: trackData.style,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'tracks'), track);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao fazer upload da música:', error);
    throw error;
  }
};

export const getPublicTracks = async (): Promise<Track[]> => {
  try {
    const q = query(
      collection(db, 'tracks'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Track));
  } catch (error) {
    console.error('Erro ao buscar músicas:', error);
    return [];
  }
};

export const getUserTracks = async (userId: string): Promise<Track[]> => {
  try {
    const q = query(
      collection(db, 'tracks'),
      where('artistId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Track));
  } catch (error) {
    console.error('Erro ao buscar músicas do usuário:', error);
    return [];
  }
};

export const updateTrack = async (trackId: string, updates: Partial<Track>): Promise<void> => {
  try {
    const trackRef = doc(db, 'tracks', trackId);
    await updateDoc(trackRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erro ao atualizar música:', error);
    throw error;
  }
};

export const deleteTrack = async (trackId: string): Promise<void> => {
  try {
    // Buscar dados da música para deletar arquivos do Storage
    const trackDoc = await getDoc(doc(db, 'tracks', trackId));
    if (trackDoc.exists()) {
      const trackData = trackDoc.data() as Track;
      
      // Deletar arquivos do Storage
      const audioRef = ref(storage, trackData.audioUrl);
      const coverRef = ref(storage, trackData.coverUrl);
      
      await deleteObject(audioRef);
      await deleteObject(coverRef);
    }

    // Deletar documento do Firestore
    await deleteDoc(doc(db, 'tracks', trackId));
  } catch (error) {
    console.error('Erro ao deletar música:', error);
    throw error;
  }
};

export const incrementViews = async (trackId: string): Promise<void> => {
  try {
    const trackRef = doc(db, 'tracks', trackId);
    await updateDoc(trackRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error('Erro ao incrementar visualizações:', error);
  }
};

export const toggleLike = async (trackId: string, isLiked: boolean): Promise<void> => {
  try {
    const trackRef = doc(db, 'tracks', trackId);
    await updateDoc(trackRef, {
      likes: increment(isLiked ? 1 : -1)
    });
  } catch (error) {
    console.error('Erro ao curtir música:', error);
    throw error;
  }
};
