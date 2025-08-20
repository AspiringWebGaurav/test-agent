# Todo App Setup Guide

This guide will help you set up the Todo functionality in your Next.js application with Firebase integration.

## Overview

The Todo app has been successfully integrated into your existing Gaurav's Personal Notes (GPN) application with the following features:

- ✅ **CRUD Operations**: Create, read, update, and delete todos
- ✅ **Due Date/Time**: Optional due dates with time support
- ✅ **Real-time Sync**: 30-second polling with SWR
- ✅ **Overdue Notifications**: Bell icon with badge count in navbar
- ✅ **Filters**: All, Active, Completed, Overdue
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Snooze Functionality**: Add 30 minutes to due time
- ✅ **Inline Editing**: Edit todos directly in the list

## Setup Instructions

### 1. Firestore Security Rules

**IMPORTANT**: You need to update your Firestore security rules to allow Todo operations.

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `gaurav-personal-notes`
3. Navigate to **Firestore Database** → **Rules**
4. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // Generic user subtree guard
    match /users/{userId} {
      allow read, write: if isOwner(userId);

      // NOTES (preserve legacy behavior)
      match /notes/{noteId} {
        allow read, write: if isOwner(userId);
      }

      // MONEY (preserve legacy behavior)
      match /money/{trackerId} {
        allow read, write: if isOwner(userId);
      }

      // TODOS (new)
      match /todos/{todoId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && isValidCreate(request.resource.data);
        allow update: if isOwner(userId) && isValidUpdate(resource.data, request.resource.data);
        allow delete: if isOwner(userId);
      }
    }

    // Block everything else
    match /{document=**} {
      allow read, write: if false;
    }

    // ----- Validation helpers -----
    function hasOnly(fields, data) {
      // ensure no unexpected fields
      return data.keys().hasOnly(fields);
    }

    function isValidTitle(t) {
      return t is string && t.size() >= 1 && t.size() <= 120;
    }

    function isValidNotes(n) {
      return !('notes' in n) || (n.notes is string && n.notes.size() <= 5000);
    }

    function isValidDueAt(d) {
      return !('dueAt' in d) || (d.dueAt is timestamp);
    }

    function isBool(v) {
      return v is bool;
    }

    function isValidCreate(d) {
      return hasOnly(['id','title','notes','dueAt','isCompleted','createdAt','updatedAt'], d)
        && d.id is string
        && isValidTitle(d.title)
        && isValidNotes(d)
        && isValidDueAt(d)
        && ('isCompleted' in d) && isBool(d.isCompleted)
        && ('createdAt' in d) && (d.createdAt is timestamp)
        && ('updatedAt' in d) && (d.updatedAt is timestamp)
        && d.updatedAt >= d.createdAt;
    }

    function isValidUpdate(old, d) {
      // Allow partial updates but validate current snapshot
      return hasOnly(['id','title','notes','dueAt','isCompleted','createdAt','updatedAt'], d)
        && (d.id is string) && (d.id == old.id)
        && isValidTitle(d.title)
        && isValidNotes(d)
        && isValidDueAt(d)
        && ('isCompleted' in d) && isBool(d.isCompleted)
        && ('createdAt' in d) && (d.createdAt is timestamp) && (d.createdAt == old.createdAt)
        && ('updatedAt' in d) && (d.updatedAt is timestamp) && (d.updatedAt >= old.updatedAt);
    }
  }
}
```

5. Click **Publish** to deploy the new rules

### 2. Dependencies

The following dependency has been added to your project:

```bash
npm install swr
```

This is already installed and ready to use.

### 3. File Structure

The Todo functionality has been added with the following new files:

```
src/
├── components/todos/
│   ├── AddTodoForm.tsx       # Form to create new todos
│   ├── TodoItem.tsx          # Individual todo item with edit/delete
│   ├── NotificationsBell.tsx # Bell icon with overdue notifications
│   └── Filters.tsx           # Filter buttons (All/Active/Completed/Overdue)
├── hooks/
│   └── useTodos.ts           # SWR-based hooks for CRUD operations
├── lib/
│   └── todoUtils.ts          # Utility functions for time formatting, validation
├── types/
│   └── index.ts              # Updated with Todo interface
└── app/dashboard/todos/
    └── page.tsx              # Main Todo page
```

### 4. Integration Points

The Todo functionality has been integrated into your existing app:

1. **Navigation**: Added "Todos" to the main navigation bar
2. **Dashboard**: Added Todo overview card to the dashboard
3. **Notifications**: Bell icon in navbar shows overdue count
4. **Mobile**: Added Todo panel to mobile swipe navigation

## Features

### Core Functionality

- **Create Todos**: Click "Add a new todo..." to create todos with optional due dates
- **Edit Todos**: Click the edit icon on any todo to modify it inline
- **Complete Todos**: Click the checkbox to mark todos as complete
- **Delete Todos**: Click the trash icon to delete todos (with confirmation)

### Due Dates & Notifications

- **Optional Due Dates**: Set due date and time when creating/editing todos
- **Overdue Detection**: Todos past their due time are marked as overdue
- **Bell Notifications**: Bell icon in navbar shows count of overdue todos
- **Snooze Feature**: Add 30 minutes to overdue todos from notifications panel

### Filtering & Organization

- **Smart Filters**: Filter by All, Active, Completed, or Overdue
- **Auto-sorting**: Todos are sorted by priority (overdue first, then by due date)
- **Real-time Updates**: Changes sync across all devices within 30 seconds

### Time Display

- **Relative Time**: Shows "in 2h", "5m late", etc.
- **Absolute Time**: Hover over relative time to see exact date/time
- **Smart Formatting**: Automatically formats based on time difference

## Data Model

Todos are stored in Firestore at: `users/{uid}/todos/{todoId}`

```typescript
interface Todo {
  id: string;            // Document ID
  title: string;         // 1-120 characters
  notes?: string;        // Optional notes
  dueAt?: Timestamp;     // Optional due date/time
  isCompleted: boolean;  // Completion status
  createdAt: Timestamp;  // Creation time
  updatedAt: Timestamp;  // Last update time
}
```

## Usage Examples

### Creating a Todo

1. Navigate to `/dashboard/todos` or click the Todo card on dashboard
2. Click "Add a new todo..." 
3. Enter title (required)
4. Optionally add notes and due date/time
5. Click "Add Todo"

### Managing Overdue Todos

1. Overdue todos appear with red styling and "⚠ Overdue" label
2. Bell icon in navbar shows overdue count
3. Click bell to see overdue todos with quick actions:
   - **Complete**: Mark as done
   - **+30m**: Snooze for 30 minutes
   - **Open Todos**: Go to full todo list

### Filtering Todos

Use the filter buttons to view:
- **All**: All todos
- **Active**: Incomplete todos
- **Completed**: Finished todos  
- **Overdue**: Past due date todos

## Technical Details

### SWR Configuration

- **Polling**: Every 30 seconds for real-time updates
- **Revalidation**: On focus and reconnect
- **Deduplication**: 5-second window to prevent duplicate requests

### Performance

- **Optimistic Updates**: UI updates immediately, syncs in background
- **Efficient Queries**: Only fetches user's todos with proper indexing
- **Lazy Loading**: Components load only when needed

### Security

- **User Isolation**: Each user can only access their own todos
- **Input Validation**: Client and server-side validation
- **Schema Enforcement**: Firestore rules prevent invalid data

## Troubleshooting

### Common Issues

1. **Todos not loading**: Check Firestore rules are updated
2. **Permission denied**: Ensure user is authenticated
3. **Real-time not working**: Check network connection and SWR polling

### Debug Steps

1. Open browser dev tools → Network tab
2. Check for Firestore errors in console
3. Verify user authentication status
4. Test with simple todo creation

## Next Steps

The Todo app is now fully functional! You can:

1. **Test the functionality** by creating, editing, and managing todos
2. **Customize styling** to match your preferences
3. **Add more features** like categories, priorities, or collaboration
4. **Monitor usage** through Firebase Analytics

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify Firestore rules are correctly applied
3. Ensure all dependencies are installed
4. Test with a fresh browser session

The Todo app is designed to work seamlessly with your existing GPN application while maintaining the same design language and user experience patterns.