import { EventEmitter } from 'events';

// All logic and storage around posts happens in here. To keep things simple,
// we're just storing posts in memory. Every time you restart the server, all
// posts will be lost. For long term storage, you'd want to look into putting
// these into a database.

export interface Post {
  id: number;
  time: number;
  name: string;
  content: string;
  hasPaid: boolean;
};

class PostManager extends EventEmitter {
  post: Post | undefined = undefined;
  pendingPosts: Post[] = [];

  // Add a new post to the list
  addPendingPost(name: string, content: string): Post {
    const post = {
      name,
      content,
      id: Math.floor(Math.random() * 100000000) + 1000,
      time: Date.now(),
      hasPaid: false,
    };
    this.pendingPosts.push(post);
    return post;
  }

  // Gets a particular post given an ID
  getCurrentPost(): Post | undefined {
    return this.post;
  }

  // Mark a post as paid
  markPostPaid(id: number) {
    // Grab the post by ID
    const pendingPost = this.pendingPosts.find(p => p.id === id);
    if (!pendingPost) return;

    // Make it the new post, and empty out the list of pending posts
    this.post = pendingPost;
    this.pendingPosts = [];

    // Fire an event
    this.emit('post', this.post);
  }
}

export default new PostManager();
