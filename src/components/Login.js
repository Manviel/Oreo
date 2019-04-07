import React, { Component } from 'react';
import { AUTH_TOKEN } from '../constants';
import { Mutation } from 'react-apollo';

import { SIGNUP_MUTATION, LOGIN_MUTATION } from '../graphql/mutations';

class Login extends Component {
  state = {
    login: true,
    email: '',
    password: '',
    name: ''
  };

  confirm = async data => {
    const { token } = this.state.login ? data.login : data.signup;
    this.saveUserData(token);
    this.props.history.push(`/`);
  };

  saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  render() {
    const { login, email, password, name } = this.state;
    return (
      <div className="flex col shade pad rad">
        <h4 className="head pad">{login ? 'Login' : 'Sign Up'}</h4>
        {!login && (
          <input
            value={name}
            onChange={e => this.setState({ name: e.target.value })}
            type="text"
            placeholder="Your name"
            className="input rad down"
          />
        )}
        <input
          value={email}
          onChange={e => this.setState({ email: e.target.value })}
          type="text"
          placeholder="Your email address"
          className="input rad down"
        />
        <input
          value={password}
          onChange={e => this.setState({ password: e.target.value })}
          type="password"
          placeholder="Choose a safe password"
          className="input rad"
        />
        <div className="flex space pad">
          <Mutation
            mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
            variables={{ email, password, name }}
            onCompleted={data => this.confirm(data)}
          >
            {mutation => (
              <button className="btn white rad" onClick={mutation}>
                {login ? 'login' : 'create account'}
              </button>
            )}
          </Mutation>
          <button
            className="btn white rad"
            onClick={() => this.setState({ login: !login })}
          >
            {login ? 'need to create an account?' : 'already have an account?'}
          </button>
        </div>
      </div>
    );
  }
}

export default Login;
