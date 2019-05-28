import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Input,
  Button,
  Alert,
  Spinner,
} from 'reactstrap';
import QRCode from 'qrcode.react';
import api from 'lib/api';
import { Post } from 'types';
import './PostForm.scss';

interface Props {
  post: Post | null;
}

interface State {
  name: string;
  content: string;
  isPosting: boolean;
  pendingPost: null | Post;
  paymentRequest: null | string;
  error: null | string;
}

const INITIAL_STATE: State = {
  name: '',
  content: '',
  isPosting: false,
  pendingPost: null,
  paymentRequest: null,
  error: null,
};

export default class PostForm extends React.Component<Props, State> {
  state = { ...INITIAL_STATE };

  componentDidUpdate(prevProps: Props) {
    const { post } = this.props;
    const { pendingPost } = this.state;

    // Reset the form if a new post is made
    if (pendingPost && this.props.post !== prevProps.post) {
      this.setState({ ...INITIAL_STATE });
    }
  }

  render() {
    const { name, content, isPosting, error, paymentRequest } = this.state;
    const disabled = !content.length || !name.length || isPosting;

    let cardContent;
    if (paymentRequest) {
      cardContent = (
        <div className="PostForm-pay">
          <div className="PostForm-pay-top">
            <QRCode value={paymentRequest.toUpperCase()} />
            <FormGroup>
              <Input
                value={paymentRequest}
                type="textarea"
                rows="5"
                disabled
              />
            </FormGroup>
          </div>
          <Button color="primary" block href={`lightning:${paymentRequest}`}>
            Open in Wallet
          </Button>
        </div>
      );
    } else {
      cardContent = (
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Input
              name="name"
              value={name}
              placeholder="Name (Max 80 chars)"
              maxLength={80}
              onChange={this.handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Input
              name="content"
              value={content}
              type="textarea"
              rows="5"
              placeholder="Content (Max 280 chars)"
              maxLength={280}
              onChange={this.handleChange}
            />
          </FormGroup>

          {error && (
            <Alert color="danger">
              <h4 className="alert-heading">Failed to submit post</h4>
              <p>{error}</p>
            </Alert>
          )}

          <Button color="primary" size="lg" type="submit" block disabled={disabled}>
            {isPosting ? <Spinner size="sm" /> : 'Submit'}
          </Button>
        </Form>
      );
    }

    return (
      <Card className="mb-4">
        <CardHeader>
          Take the Throne
        </CardHeader>
        <CardBody>
          {cardContent}
        </CardBody>
      </Card>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({ [ev.target.name]: ev.target.value } as any);
  };

  private handleSubmit = (ev: React.FormEvent) => {
    const { name, content } = this.state;
    ev.preventDefault();

    this.setState({
      isPosting: true,
      error: null,
    });

    api.submitPost(name, content)
      .then(res => {
        this.setState({
          isPosting: false,
          pendingPost: res.post,
          paymentRequest: res.paymentRequest,
        });
      }).catch(err => {
        this.setState({
          isPosting: false,
          error: err.message,
        })
      });
  };
}
