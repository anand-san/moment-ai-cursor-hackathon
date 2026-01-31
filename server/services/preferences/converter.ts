import type { QueryDocumentSnapshot } from '../firestoreDemo/queryTypes';
import type { PreferencesDocRaw } from './types';

export interface FirestoreDataConverter<T> {
  toFirestore: (data: T) => Record<string, unknown>;
  fromFirestore: (snapshot: QueryDocumentSnapshot) => T;
}

export const preferencesConverter: FirestoreDataConverter<PreferencesDocRaw> = {
  toFirestore: (data: PreferencesDocRaw) =>
    data as unknown as Record<string, unknown>,
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();
    return data as PreferencesDocRaw;
  },
};
