// REFERENCE SOLUTION - Do not distribute to students
// src/services/noteService.ts

import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';

import { db } from '../firebase-config';
import { Note, Notes } from '../types/Note';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NOTES_COLLECTION = 'notes';

/**
 * Creates or updates a note in Firestore
 * @param note Note object to save
 * @returns Promise that resolves when the note is saved
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function saveNote(note: Note): Promise<void> {
  // Use setDoc to create or update the note document; throw an error if it fails
  try {
    const noteRef = doc(collection(db, NOTES_COLLECTION), note.id);
    await setDoc(noteRef, note);
  } catch (error) {
    console.error('error saving note: ', error);
    throw new Error('failed to save note');
  }
}

/**
 * Deletes a note from Firestore
 * @param noteId ID of the note to delete
 * @returns Promise that resolves when the note is deleted
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteNote(noteId: string): Promise<void> {
  // Use deleteDoc to remove the note document; throw an error if it fails
  try {
    const noteRef = doc(collection(db, NOTES_COLLECTION), noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('error deleting note: ', error);
    throw new Error('failed to delete note');
  }
}

/**
 * Transforms a Firestore snapshot into a Notes object
 * @param snapshot Firestore query snapshot
 * @returns Notes object with note ID as keys
 */
export function transformSnapshot(snapshot: QuerySnapshot<DocumentData>): Notes {
  const notes: Notes = {};

  snapshot.docs.forEach((doc) => {
    const noteData = doc.data() as Note;
    notes[doc.id] = noteData;
  });

  return notes;
}

/**
 * Subscribes to changes in the notes collection
 * @param onNotesChange Callback function to be called when notes change
 * @param onError Optional error handler for testing
 * @returns Unsubscribe function to stop listening for changes
 */

export function subscribeToNotes(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNotesChange: (notes: Notes) => void,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onError?: (error: Error) => void,
): Unsubscribe {
  // subscribe to the notes collection in Firestore
  // Use onSnapshot to listen for changes; call onNotesChange with the transformed notes
  // Handle errors by calling onError if provided
  // Return s proper (not empty) unsubscribe function to stop listening for changes
  const notesRef = collection(db, NOTES_COLLECTION);
  const unsubscribe = onSnapshot(
    notesRef,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const notes = transformSnapshot(snapshot);
      onNotesChange(notes);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error('error fetching notes: ', error);
      }
    },
  );
  return unsubscribe;
}
