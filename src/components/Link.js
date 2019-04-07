import React from 'react';
import { Mutation } from 'react-apollo';

import { VOTE_MUTATION } from '../graphql/mutations';
import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';

const Link = props => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <article className="flex shade space pad down rad">
      <div className="link">
        <p>{props.link.description}</p>
        <span>({props.link.url})</span>
        <p className="up">
          {props.link.votes.length} votes | by{' '}
          {props.link.postedBy ? props.link.postedBy.name : 'Unknown'}{' '}
          {timeDifferenceForDate(props.link.createdAt)}
        </p>
      </div>
      {authToken && (
        <Mutation
          mutation={VOTE_MUTATION}
          variables={{ linkId: props.link.id }}
          update={(store, { data: { vote } }) =>
            props.updateStoreAfterVote(store, vote, props.link.id)
          }
        >
          {voteMutation => (
            <button className="btn rad blue" onClick={voteMutation}>
              Like
            </button>
          )}
        </Mutation>
      )}
    </article>
  );
};

export default Link;
