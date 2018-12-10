import * as Slack from 'slack-node';
import { Promise as BluePromise } from 'bluebird';

// import { webHookUri, channelName } from './slack-settings';

const nconf = module.parent.require('nconf');
const webHookUri = nconf.get('slackWebUrl');
const channelName = nconf.get('channelName');
const contentLen = nconf.get('postContentLength');

const user = module.parent.require('./user');
const topics = module.parent.require('./topics');
const categories = module.parent.require('./categories');

export async function savePost(newPost: any) {
  const slackObj = new Slack();

  const uri = webHookUri;
  slackObj.setWebhook(uri);

  const post = newPost.post;

  const userPromise = new Promise((resolve, reject) => {
    user.getUserFields(
      post.uid,
      ['username', 'picture'],
      (err: any, result: any) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      },
    );
  });

  const topicPromise = new Promise((resolve, reject) => {
    topics.getTopicFields(
      post.tid,
      ['title', 'slug'],
      (err: any, result: any) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      },
    );
  });

  const catPromise = new Promise((resolve, reject) => {
    categories.getCategoryFields(
      post.cid,
      ['name'],
      (err: any, result: any) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      },
    );
  });

  const [userResult, topicResult, catResult] = await BluePromise.all([
    userPromise,
    topicPromise,
    catPromise,
  ]);
  // tslint:disable-next-line
  // console.log(userResult, topicResult, catResult);

  const content = post.content.substring(0, contentLen) + '...';

  const message =
    '<' +
    nconf.get('url') +
    '/topic/' +
    (topicResult as any).slug +
    '|[' +
    (catResult as any).name +
    ': ' +
    (topicResult as any).title +
    ']>\n' +
    content;

  // tslint:disable-next-line
  // console.log('message', message);

  slackObj.webhook(
    {
      channel: channelName || '#general',
      username: (userResult as any).username,
      text: message,
    },
    (err: any, response: any) => {
      // tslint:disable-next-line
      //console.log(response);
      if (err) {
        // tslint:disable-next-line
        console.log('********error*********', err);
      }
    },
  );
}

// savePost({ post: { content: 'vbvbvb' } });
