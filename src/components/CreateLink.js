import React, { Component, Fragment } from 'react';
import { Mutation } from 'react-apollo';

import { FEED_QUERY } from '../graphql/queries';
import { POST_MUTATION } from '../graphql/mutations';
import { LINKS_PER_PAGE } from '../constants';

class CreateLink extends Component {
  state = {
    description: '',
    url: ''
  };

  render() {
    const { description, url } = this.state;
    return (
      <Fragment>
        <h4 className="head area">Add new</h4>
        <div className="flex col shade pad rad">
          <input
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
            className="input rad down"
          />
          <input
            value={url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
            className="input rad down"
          />
          <Mutation
            mutation={POST_MUTATION}
            variables={{ description, url }}
            onCompleted={() => this.props.history.push('/new/1')}
            update={(store, { data: { post } }) => {
              const first = LINKS_PER_PAGE;
              const skip = 0;
              const orderBy = 'createdAt_DESC';
              const data = store.readQuery({
                query: FEED_QUERY,
                variables: { first, skip, orderBy }
              });
              data.feed.links.unshift(post);
              store.writeQuery({
                query: FEED_QUERY,
                data,
                variables: { first, skip, orderBy }
              });
            }}
          >
            {postMutation => (
              <button className="btn white rad up" onClick={postMutation}>
                Submit
              </button>
            )}
          </Mutation>
        </div>
      </Fragment>
    );
  }
}

export default CreateLink;
