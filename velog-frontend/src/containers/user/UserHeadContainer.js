// @flow
import React, { Component } from 'react';
import { FollowActions } from 'store/actionCreators';
import type { State } from 'store';
import { connect } from 'react-redux';
import UserHead from 'components/user/UserHead';
import { type Profile } from 'store/modules/profile';

type OwnProps = {
  username: ?string,
};
type Props = OwnProps & {
  profile: ?Profile,
  self: boolean,
  followingUsers: {
    [string]: boolean,
  },
  followLoading: boolean,
};

class UserHeadContainer extends Component<Props> {
  onToggleFollow = () => {
    const { profile, followingUsers, followLoading } = this.props;
    if (!profile || followLoading) return;

    const { user_id } = profile;
    const following = followingUsers[user_id];

    if (following) {
      FollowActions.unfollowUser(user_id);
      return;
    }
    FollowActions.followUser(user_id);
  };
  render() {
    const { profile, self, followingUsers } = this.props;
    if (!profile) return null;

    const following = followingUsers[profile.user_id];

    return (
      <UserHead
        profile={profile}
        self={self}
        following={following}
        onToggleFollow={this.onToggleFollow}
      />
    );
  }
}

export default connect(
  (state: State, ownProps: OwnProps) => ({
    profile: state.profile.profile,
    self: (state.user.user && state.user.user.username) === ownProps.username,
    followingUsers: state.follow.users,
    followLoading:
      state.pender.pending['follow/FOLLOW_USER'] || state.pender.pending['follower/UNFOLLOW_USER'],
  }),
  () => ({}),
)(UserHeadContainer);
