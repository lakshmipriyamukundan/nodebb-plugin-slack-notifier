import * as Slack from 'slack-node';
// import { webHookUri, channelName } from './slack-settings';

const nconf = module.parent.require('nconf');
const webHookUri = nconf.get('slackWebUrl');
const channelName = nconf.get('channelName');

export function savePost(newPost: any) {
  const slackObj = new Slack();

  const uri = webHookUri;
  slackObj.setWebhook(uri);

  const post = newPost.post;

  slackObj.webhook(
    {
      channel: channelName || '#general',
      username: 'webhookbot',
      text: post.content,
    },
    (err, response) => {
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
