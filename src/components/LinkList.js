import React, { Fragment } from 'react';
import Link from './Link';
import { Query } from 'react-apollo';

import {
  FEED_QUERY,
  NEW_LINKS_SUBSCRIPTION,
  NEW_VOTES_SUBSCRIPTION
} from '../queries';
import { LINKS_PER_PAGE } from '../constants';

const LinkList = props => {
  const updateCacheAfterVote = (store, createVote, linkId) => {
    const isNewPage = props.location.pathname.includes('new');
    const page = parseInt(props.match.params.page, 10);

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? 'createdAt_DESC' : null;
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy }
    });

    const votedLink = data.feed.links.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;
    store.writeQuery({ query: FEED_QUERY, data });
  };

  const subscribeToNewLinks = subscribeToMore => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newLink = subscriptionData.data.newLink;
        const exists = prev.feed.links.find(({ id }) => id === newLink.id);
        if (exists) return prev;

        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename
          }
        });
      }
    });
  };

  const subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    });
  };

  const getQueryVariables = () => {
    const isNewPage = props.location.pathname.includes('new');
    const page = parseInt(props.match.params.page, 10);

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? 'createdAt_DESC' : null;
    return { first, skip, orderBy };
  };

  const getLinksToRender = data => {
    const isNewPage = props.location.pathname.includes('new');
    if (isNewPage) {
      return data.feed.links;
    }
    const rankedLinks = data.feed.links.slice();
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
    return rankedLinks;
  };

  const nextPage = data => {
    const page = parseInt(props.match.params.page, 10);
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      props.history.push(`/new/${nextPage}`);
    }
  };

  const previousPage = () => {
    const page = parseInt(props.match.params.page, 10);
    if (page > 1) {
      const previousPage = page - 1;
      props.history.push(`/new/${previousPage}`);
    }
  };

  return (
    <Query query={FEED_QUERY} variables={getQueryVariables()}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <div>Fetching...</div>;
        if (error) return <div>Error</div>;

        subscribeToNewLinks(subscribeToMore);
        subscribeToNewVotes(subscribeToMore);

        const linksToRender = getLinksToRender(data);
        const isNewPage = props.location.pathname.includes('new');
        const pageIndex = props.match.params.page
          ? (props.match.params.page - 1) * LINKS_PER_PAGE
          : 0;

        return (
          <Fragment>
            {linksToRender.map((link, index) => (
              <Link
                key={link.id}
                link={link}
                index={index + pageIndex}
                updateStoreAfterVote={updateCacheAfterVote}
              />
            ))}
            {isNewPage && (
              <footer className="flex space">
                <button className="btn rad blue" onClick={previousPage}>
                  Previous
                </button>
                <button
                  className="btn rad green"
                  onClick={() => nextPage(data)}
                >
                  Next
                </button>
              </footer>
            )}
          </Fragment>
        );
      }}
    </Query>
  );
};

export default LinkList;
