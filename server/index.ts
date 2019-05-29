import express from 'express';
import expressWs from 'express-ws';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { Invoice, Readable } from '@radar/lnrpc';
import env from './env';
import { node, initNode } from './node';
import postManager from './post';

const isDev = process.env.NODE_ENV !== 'production';

/*************** Configure server ***************/

const app = expressWs(express()).app;
app.use(compression());
app.use(bodyParser.json());

if (isDev) {
  app.use(cors({ origin: '*' }));
}


/******************** Routes ********************/

// Websocket for post data
app.ws('/api/post', (ws) => {
  // Send the current post we have initially
  const post = postManager.getCurrentPost();
  if (post) {
    ws.send(JSON.stringify({
      type: 'post',
      data: post,
    }));
  }

  // Send each new post as it's paid for. If we error out, just close
  // the connection and stop listening.
  const postListener = (post: any) => {
    ws.send(JSON.stringify({
      type: 'post',
      data: post,
    }));
  };
  postManager.addListener('post', postListener);

  // Keep-alive by pinging every 10s
  const pingInterval = setInterval(() => {
    ws.send(JSON.stringify({ type: 'ping' }));
  }, 10000);

  // Stop listening if they close the connection
  ws.addEventListener('close', () => {
    postManager.removeListener('post', postListener);
    clearInterval(pingInterval);
  });
});


// POST endpoint for creating a new post that needs paying for
app.post('/api/post', async (req, res, next) => {
  try {
    // Get fields from JSON post body, throw if they're missing
    const { name, content } = req.body;
    if (!name || !content) {
      throw new Error('Fields name and content are required to make a post');
    }

    // If it's too long, throw
    if (name.length > 80) {
      throw new Error('Name is too long, max 80 chars');
    }
    if (content.length > 280) {
      throw new Error('Content is too long, max 280 chars')
    }

    // Make the post & invoice
    const post = postManager.addPendingPost(name, content);
    const invoice = await node.addInvoice({
      memo: `King of Lightning post #${post.id}`,
      value: '1', // fixed amount of satoshis
      expiry: '120', // 2 minutes
    });

    res.json({
      data: {
        post,
        paymentRequest: invoice.paymentRequest,
      },
    });
  } catch(err) {
    next(err);
  }
});

/****************** Root path ******************/

if (isDev) {
  // Development uses webpack-dev-server
  app.get('/', (req, res) => {
    res.send('You need to load the webpack-dev-server page, not the server page!');
  });
} else {
  // Production serves compiled webpack assets
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/index.html'));
  });
  app.use('/static', express.static(path.join(__dirname, 'static')));
}

/****************** Initialize ******************/

// Initialize node & server
console.log('Initializing Lightning node...');
initNode().then(() => {
  console.log('Lightning node initialized!');
  console.log('Starting server...');
  app.listen(env.PORT, () => {
    console.log(`Server started at http://localhost:${env.PORT}!`);
  });

  // Subscribe to all invoices, mark posts as paid
  const stream = node.subscribeInvoices() as any as Readable<Invoice>;
  stream.on('data', chunk => {
    // Skip unpaid / irrelevant invoice updates
    if (!chunk.settled || !chunk.amtPaidSat || !chunk.memo) return;

    // Extract post id from memo, skip if we can't find an id
    const id = parseInt(chunk.memo.replace('King of Lightning post #', ''), 10);
    if (!id) return;

    // Mark the invoice as paid!
    postManager.markPostPaid(id);
  });
});
