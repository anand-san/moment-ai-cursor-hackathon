import type { QueryDocumentSnapshot } from '../firestoreDemo/queryTypes';
import type { SessionDocRaw } from './types';

export interface FirestoreDataConverter<T> {
  toFirestore: (data: T) => Record<string, unknown>;
  fromFirestore: (snapshot: QueryDocumentSnapshot) => T;
}

export const sessionConverter: FirestoreDataConverter<SessionDocRaw> = {
  toFirestore: (data: SessionDocRaw) =>
    data as unknown as Record<string, unknown>,
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();
    return data as SessionDocRaw;
  },
};
