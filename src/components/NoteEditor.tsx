// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteEditor.tsx
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Import the saveNote function from your noteService call this to save the note to firebase
import { saveNote } from '../services/noteService';
import { Note } from '../types/Note';

interface NoteEditorProps {
  initialNote?: Note;
  onSave?: (note: Note) => void;
}
// remove the eslint disable when you implement on save
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NoteEditor: React.FC<NoteEditorProps> = ({ initialNote, onSave }) => {
  // State for the current note being edited
  // remove the eslint disable when you implement the state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [note, setNote] = useState<Note>(() => {
    return (
      initialNote || {
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      }
    );
  });

  //create state for saving status
  const [isSaving, setIsSaving] = useState(false);
  //createState for error handling
  const [error, setError] = useState<string | null>(null);

  // Update local state when initialNote changes in a useEffect (if editing an existing note)
  // This effect runs when the component mounts or when initialNote changes
  // It sets the note state to the initialNote if provided, or resets to a new empty note, with a unique ID

  //on form submit create a "handleSubmit" function that saves the note to Firebase and calls the onSave callback if provided
  // This function should also handle any errors that occur during saving and update the error state accordingly

  // for each form field; add a change handler that updates the note state with the new value from the form
  // disable fields and the save button while saving is happening
  // for the save button, show "Saving..." while saving is happening and "Save Note" when not saving
  // s  85:14  error  'error' is defined but never used  @typescript-eslint/no-unused-varshow an error message if there is an error saving the note

  useEffect(() => {
    if (initialNote) {
      setNote(initialNote);
    }
  }, [initialNote]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [id]: value,
      lastUpdated: Date.now(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const updatedNote = {
        ...note,
        lastUpdated: Date.now(),
      };
      await saveNote(updatedNote);
      if (onSave) {
        onSave(updatedNote);
      }
      if (!initialNote) {
        setNote({
          id: uuidv4(),
          title: '',
          content: '',
          lastUpdated: Date.now(),
        });
      }
    } catch (error) {
      console.error(error);
      setError('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="note-editor" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={note.title}
          onChange={handleChange}
          disabled={isSaving}
          required
          placeholder="Enter note title"
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={note.content}
          onChange={handleChange}
          disabled={isSaving}
          rows={5}
          required
          placeholder="Enter note content"
        />
      </div>
      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : initialNote ? 'Update Note' : 'Save Note'}
        </button>
      </div>
    </form>
  );
};

export default NoteEditor;
