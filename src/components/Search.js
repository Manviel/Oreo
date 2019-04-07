import React, { Component } from 'react';
import { withApollo } from 'react-apollo';

import { FEED_SEARCH_QUERY } from '../graphql/queries';

import Link from './Link';

class Search extends Component {
  state = {
    links: [],
    filter: ''
  };

  executeSearch = async () => {
    const { filter } = this.state;
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter }
    });
    const links = result.data.feed.links;
    this.setState({ links });
  };

  render() {
    return (
      <div className="flex col">
        <h4 className="head area">Search</h4>
        <section className="bot">
          <input
            type="text"
            className="input rad"
            placeholder="Type someting..."
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <button
            className="btn shade rad left"
            onClick={() => this.executeSearch()}
          >
            OK
          </button>
        </section>
        {this.state.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
      </div>
    );
  }
}

export default withApollo(Search);
