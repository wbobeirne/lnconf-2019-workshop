import React from 'react';
import { Card, CardTitle, CardBody, CardText, Jumbotron } from 'reactstrap';
import { Post } from 'types';
import './KingPost.scss';

interface Props {
  post: Post | null;
}

export default class KingPost extends React.Component<Props> {
  render() {
    const { post } = this.props;

    let content;
    if (post) {
      content = (
        <Card className="KingPost-post mb-4" key={post.id}>
          <CardBody>
            <CardTitle tag="h4">King {post.name} says:</CardTitle>
            <CardText>{post.content}</CardText>
          </CardBody>
        </Card>
      );
    } else {
      content = (
        <Jumbotron>
          <h2 className="text-center">No post yet!</h2>
          <p className="text-center">Why not make yourself king?</p>
        </Jumbotron>
      );
    }

    return (
      <div className="KingPost">
        <h3 className="text-center">The Reigning King</h3>
        {content}
      </div>
    );
  }
}
