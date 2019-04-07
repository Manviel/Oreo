import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

import { VOTE_MUTATION } from '../graphql/mutations';
import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';

class Link extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);

    return (
      <article className="flex bot">
        <div className="flex">
          {authToken && (
            <Mutation
              mutation={VOTE_MUTATION}
              variables={{ linkId: this.props.link.id }}
              update={(store, { data: { vote } }) =>
                this.props.updateStoreAfterVote(store, vote, this.props.link.id)
              }
            >
              {voteMutation => (
                <button className="btn rad blue" onClick={voteMutation}>
                  Like
                </button>
              )}
            </Mutation>
          )}
        </div>
        <div className="link">
          {this.props.link.description} ({this.props.link.url})
          <p>
            {this.props.link.votes.length} votes | by{' '}
            {this.props.link.postedBy
              ? this.props.link.postedBy.name
              : 'Unknown'}{' '}
            {timeDifferenceForDate(this.props.link.createdAt)}
          </p>
        </div>
      </article>
    );
  }
}

export default Link;
