import React from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'reactstrap';
import PostForm from 'components/PostForm';
import KingPost from 'components/KingPost';
import api from 'lib/api';
import { Post } from 'types';
import './App.scss';

interface State {
  post: Post | null;
  isConnecting: boolean;
  error: Error | null;
}

// Starting state, can be used for "resetting" as well
const INITIAL_STATE: State = {
  post: null,
  isConnecting: true,
  error: null,
};

export default class App extends React.Component<State> {
  state: State = { ...INITIAL_STATE };

  // Connect websocket immediately
  componentDidMount() {
    this.connect();
  }

  // Reset our state, connect websocket, and update state on new data or error
  private connect = () => {
    this.setState({ ...INITIAL_STATE });
    const socket = api.getPostWebSocket();

    // Mark isConnecting false once connected
    socket.addEventListener('open', () => {
      setTimeout(() => {
        this.setState({ isConnecting: false });
      }, 300);
    });

    // Add new posts when they're sent
    socket.addEventListener('message', ev => {
      try {
        const msg = JSON.parse(ev.data.toString());
        if (msg && msg.type === 'post') {
          this.setState({ post: msg.data });
        }
      } catch(err) {
        console.error(err);
      }
    });

    // Handle closes and errors
    socket.addEventListener('close', (ev) => {
      this.setState({
        isConnecting: false,
        error: new Error('Connection to server closed unexpectedly.')
      });
    });
    socket.addEventListener('error', (ev) => {
      console.error(ev);
      this.setState({
        isConnecting: false,
        error: new Error('There was an error, see your console for more information.')
      });
    });
  };

  render() {
    const { post, isConnecting, error } = this.state;

    let content;
    if (isConnecting) {
      content = (
        <div className="d-flex justify-content-center p-5">
          <Spinner color="warning" style={{ width: '3rem', height: '3rem' }} />
        </div>
      );
    } else if (error) {
      content = (
        <Alert color="danger">
          <h4 className="alert-heading">Something went wrong!</h4>
          <p>{error.message}</p>
          <Button block outline color="danger" onClick={this.connect}>
            Try to reconnect
          </Button>
        </Alert>
      )
    } else {
      content = (
        <>
          <KingPost post={post} />
          <PostForm post={post} />
        </>
      );
    }

    return (
      <div className="App">
        <Container>
          <h1 className="App-title">👑 King of Lightning 👑</h1>
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              {content}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
