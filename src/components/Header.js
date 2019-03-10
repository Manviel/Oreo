import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { AUTH_TOKEN } from '../constants';

const Header = props => {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <nav className="flex space bot">
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
          <div className="flex">
            <Link to="/create" className="link">
              Create
            </Link>
          </div>
        )}
        {authToken ? (
          <div
            className="ml1 pointer black"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              props.history.push(`/`);
            }}
          >
            Logout
          </div>
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
