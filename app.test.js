const axios = require('axios');
const faker = require('faker');

const url = 'http://127.0.0.1:5000';
const userURL = 'http://127.0.0.1:5000/api/auth';
const searchURL = 'http://127.0.0.1:5000/api/search';
let testUser = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
};

// Test for User routes
describe('User Routes', () => {
    
      test('Register a new user', async () => {
        const res = await axios.post(`${userURL}/signup`, testUser);
    
        expect(res.status).toBe(200);
        expect(res.data.message).toBe('Registered');
        expect(res.data.email).toBe(testUser.email);
        expect(res.data).toHaveProperty('_id');
      });
    
      test('Register a user with missing fields', async () => {
        const userData = {
          username: 'incompleteUser',
          password: 'Incomplete123'
          // Missing email intentionally
        };
    
        try {
          await axios.post(`${userURL}/signup`, userData);
        } catch (error) {
          expect(error.response.status).toBe(400);
          expect(error.response.data.message).toBe('all fields are mandatory');
        }
      });
    
      test('Login with correct credentials', async () => {
        const loginData = {
          email: testUser.email,
          password: testUser.password,
        };
    
        const res = await axios.post(`${userURL}/login`, loginData);
    
        expect(res.status).toBe(200);
        expect(res.data.message).toBe('Success');
        expect(res.data).toHaveProperty('access');
      });

  test('Login with incorrect credentials', async () => {
    const wrongLoginData = {
      email: 'wrong@example.com',
      password: 'WrongPass123'
    };

    try {
      await axios.post(`${userURL}/login`, wrongLoginData);
    } catch (error) {
      expect(error.response.status).toBe(404); // Updated to match the controller status code
      expect(error.response.data.message).toBe('Invalid credentials');
    }
  });
});

// Test for Note routes
describe('Note Routes', () => {
    let authToken = '';
  
    // Log in the previously created test user
    beforeAll(async () => {
      const loginData = {
        email: testUser.email,
        password: testUser.password,
      };
  
      const res = await axios.post(`${userURL}/login`, loginData);
      authToken = res.data.access;
    });
  
    test('Get all notes for authenticated user', async () => {
      const res = await axios.get(`${url}/api/notes`, { headers: {"Authorization" : `Bearer ${authToken}`} });
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('notes');
      expect(Array.isArray(res.data.notes)).toBe(true);
    });
  
    test('Create a new note', async () => {
      const newNoteData = {
        title: 'Test Note Title',
        content: 'This is a test note content.',
      };
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
  
      const res = await axios.post(`${url}/api/notes`, newNoteData, config);
  
      expect(res.status).toBe(200);
      expect(res.data.title).toBe(newNoteData.title);
      expect(res.data.content).toBe(newNoteData.content);
      expect(res.data).toHaveProperty('_id');
    });
  
    test('Update an existing note', async () => {
      const updateData = {
        title: 'Updated Title',
      };
  
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
  
      // Make a request to get all notes to find the ID of the note to update
      const getNotesRes = await axios.get(`${url}/api/notes`, config);
      const noteToUpdateId = getNotesRes.data.notes[0]._id; // Assuming there's at least one note
  
      const updateRes = await axios.put(`${url}/api/notes/${noteToUpdateId}`, updateData, config);
  
      expect(updateRes.status).toBe(200);
      expect(updateRes.data.note.title).toBe(updateData.title);
      expect(updateRes.data.note).toHaveProperty('_id');
    });
  
    test('Delete a note', async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
  
      // Make a request to get all notes to find the ID of the note to delete
      const getNotesRes = await axios.get(`${url}/api/notes`, config);
      const noteToDeleteId = getNotesRes.data.notes[0]._id; // Assuming there's at least one note
  
      const deleteRes = await axios.delete(`${url}/api/notes/${noteToDeleteId}`, config);
  
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.data.message).toBe('Note deleted successfully');
    });
  });  
  
  describe('Search Routes', () => {
    let authToken = '';
  
    // Log in the previously created test user
    beforeAll(async () => {
      const loginData = {
        email: testUser.email,
        password: testUser.password,
      };
  
      const res = await axios.post(`${userURL}/login`, loginData);
      authToken = res.data.access;
    });
  
    test('Get matching notes for a query', async () => {
      const query = 'Test'; // Sample query to search
  
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          q: query,
        },
      };
  
      const res = await axios.get(`${searchURL}`, config);
  
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('matchingNotes');
      expect(Array.isArray(res.data.matchingNotes)).toBe(true);
    });
  
    test('Get all notes when empty query is provided', async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
      
        const res = await axios.get(`${searchURL}`, config);
      
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty('matchingNotes');
        expect(Array.isArray(res.data.matchingNotes)).toBe(true);
    });
  
    test('Add a note, query it, and check if it match', async () => {
        const newNoteData = {
            title: 'Sample Note for Testing',
            content: 'This is a test note content.',
        };
        
        const config = {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
      
        // Add a new note
        const addNoteRes = await axios.post(`${url}/api/notes`, newNoteData, config);
        expect(addNoteRes.status).toBe(200);
        expect(addNoteRes.data.title).toBe(newNoteData.title);
        expect(addNoteRes.data.content).toBe(newNoteData.content);
        expect(addNoteRes.data).toHaveProperty('_id');
        
        addedNoteId = addNoteRes.data._id;
      
        // Query the added note
        const query = 'Sample Note for Testing'; // Query based on the note title

        const searchConfig = {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            params: {
                q: query,
            },
        };
      
        const searchRes = await axios.get(`${searchURL}`, searchConfig);
        expect(searchRes.status).toBe(200);
        expect(searchRes.data).toHaveProperty('matchingNotes');
        expect(Array.isArray(searchRes.data.matchingNotes)).toBe(true);
      
        // Check if the added note is in the returned list
        const matchingNotes = searchRes.data.matchingNotes;
        const foundNote = matchingNotes.find(note => note._id === addedNoteId);
        expect(foundNote).toBeDefined();
        expect(foundNote.title).toBe(newNoteData.title);
        expect(foundNote.content).toBe(newNoteData.content);
    });
});