import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/authService';

function AuthTester() {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const result = await loginUser({
        email: 'test@example.com',
        password: 'password123'
      });
      setTestResult('Login success: ' + JSON.stringify(result, null, 2));
    } catch (error) {
      setTestResult('Login error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    try {
      const result = await registerUser({
        email: 'newuser@example.com',
        password: 'password123',
        fullName: 'Test User'
      });
      setTestResult('Register success: ' + JSON.stringify(result, null, 2));
    } catch (error) {
      setTestResult('Register error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: '#1a1a2e', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'monospace'
    }}>
      <h2>Auth API Tester</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testLogin} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Login
        </button>
        
        <button 
          onClick={testRegister} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Register
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Expected Backend Endpoints:</h3>
        <ul style={{ color: '#ccc' }}>
          <li>POST https://localhost:7151/api/auth/login</li>
          <li>POST https://localhost:7151/api/auth/register</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test Login Payload:</h3>
        <pre style={{ backgroundColor: '#2a2a3e', padding: '10px', borderRadius: '5px' }}>
{`{
  "email": "test@example.com",
  "password": "password123"
}`}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test Register Payload:</h3>
        <pre style={{ backgroundColor: '#2a2a3e', padding: '10px', borderRadius: '5px' }}>
{`{
  "email": "newuser@example.com",
  "password": "password123",
  "fullName": "Test User"
}`}
        </pre>
      </div>

      {testResult && (
        <div>
          <h3>Result:</h3>
          <pre style={{ 
            backgroundColor: testResult.includes('error') ? '#4a1a1a' : '#1a4a1a', 
            padding: '15px', 
            borderRadius: '5px',
            maxHeight: '300px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {testResult}
          </pre>
        </div>
      )}

      {loading && (
        <div style={{ color: '#ff6b6b' }}>
          Testing API connection...
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#2a2a3e', borderRadius: '5px' }}>
        <h3>Instructions:</h3>
        <ol style={{ color: '#ccc' }}>
          <li>Make sure your backend is running on https://localhost:7151</li>
          <li>Ensure CORS is configured to allow frontend requests</li>
          <li>Create a test user in your database first</li>
          <li>Click "Test Login" or "Test Register" to verify API connection</li>
        </ol>
      </div>
    </div>
  );
}

export default AuthTester;