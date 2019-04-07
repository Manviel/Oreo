import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { AUTH_TOKEN } from '../constants';

const Header = props => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <nav className="flex space">
      <Link to="/" className="grow head">
        Hacker News
      </Link>
      <section className="flex space grow">
        <Link to="/top" className="link">
          Top
        </Link>
        <Link to="/search" className="link">
          Search
        </Link>
        {authToken && (
          <Link to="/create" className="link">
            Create
          </Link>
        )}
        {authToken ? (
          <button
            className="btn shade rad"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              props.history.push(`/`);
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="link">
            Login
          </Link>
        )}
      </section>
    </nav>
  );
};

export default withRouter(Header);
