import Notification from 'containers/App/NotificationStack/Notification';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Col } from 'reactstrap';

const mapState = (state: Redux.State) => ({
  notifications: state.app.notifications,
});

const connector = connect(mapState);

type NotificationStackProps = ConnectedProps<typeof connector>;

const NotificationStack = ({ notifications }: NotificationStackProps) => {
  return (
    <Col
      className="p-2"
      sm={5}
      style={{ position: 'fixed', top: 0, right: 0, zIndex: 99999 }}
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </Col>
  );
};

export default connector(NotificationStack);