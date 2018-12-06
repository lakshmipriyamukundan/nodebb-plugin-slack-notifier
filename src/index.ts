import * as Slack from 'slack-node';

export function savePost(post: any) {
  const slackObj = new Slack();
  slackObj.webhook(
    {
      channel: '#general',
      username: 'webhookbot',
      text: 'This is posted to #general and comes from a bot named webhookbot.',
    },
    (err, response) => {
      console.log(response);
      if (err) {
        console.log(err);
      }
    },
  );
}
