import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken } from './actions/actions';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useHistory from react-router-dom

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api-login/', {
        username,
        password,
      });

      if (response.status === 200) {
        // Successful login, navigate to TokenDisplay with the token as a parameter
        const token = response.data.token;
        localStorage.setItem('token', token);
        dispatch(setToken(token));
        setStatus('success');
        navigate('/main/');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          // Unauthorized, display an error message on the login page.
          setStatus('error-401');
        } else if (error.response.status === 400) {
          // Bad request, display an error page with status 400.
          setStatus('error-400');
        }
      }
    }
  };

  return (
    <div className="form-container">
      {status === 'success' ? (
        <div>
          <h1>Success</h1>
         
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
           <div class="form-group">
           <label for="login" className='labelLoginForm'>Login</label>
          <input
            type="text"
            class="form-control loginFormControl"
            id="login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          </div>
          <div class="form-group">
          <label for="password" className='labelLoginForm'>Mot de passe</label>
          <input
            type="password"
            class="form-control loginFormControl"
            id="password"
            aria-describedby="passwordHelpBlock"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
         </div> <br/>
          <button type="submit"  class="btn btn-outline-light">Submit</button>
          {status === 'error-401' && (
            <p className="error-message">Login ou mot de passe inconrect.</p>
          )}
          {status === 'error-400' && (
            <p className="error-message">Bad Request: Something went wrong.</p>
          )}
        </form>
      )}
    </div>
  );
}

export default LoginForm;
