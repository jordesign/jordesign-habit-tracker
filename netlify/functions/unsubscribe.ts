import { Handler } from '@netlify/functions';
import { storageService } from '../../src/services/storageService';

const handler: Handler = async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const token = event.queryStringParameters?.token;
    if (!token) {
      throw new Error('No token provided');
    }

    // Update user preferences to disable reminders
    await storageService.updateReminderPreferences({
      enabled: false,
      token
    });

    // Redirect to the app with a success message
    return {
      statusCode: 302,
      headers: {
        Location: `${process.env.APP_URL}/settings?unsubscribed=true`
      },
      body: ''
    };
  } catch (error) {
    console.error('Error processing unsubscribe:', error);
    return {
      statusCode: 302,
      headers: {
        Location: `${process.env.APP_URL}/settings?error=unsubscribe-failed`
      },
      body: ''
    };
  }
};

export { handler }; 