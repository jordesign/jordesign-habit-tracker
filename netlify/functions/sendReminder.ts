import { Handler } from '@netlify/functions';
import sgMail from '@sendgrid/mail';
import { ReminderTemplate } from '../../src/services/emailService';

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const { to, subject, metrics, unsubscribeUrl }: ReminderTemplate = JSON.parse(event.body!);

    // Construct email HTML
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Daily Metrics Reminder</h1>
        <p>Here are your metrics to track for today:</p>
        
        <ul style="list-style: none; padding: 0;">
          ${metrics.map(metric => `
            <li style="margin-bottom: 16px; padding: 16px; background-color: #f3f4f6; border-radius: 8px;">
              <h3 style="margin: 0; color: #1f2937;">${metric.name}</h3>
              ${metric.description ? `<p style="margin: 4px 0; color: #6b7280;">${metric.description}</p>` : ''}
            </li>
          `).join('')}
        </ul>

        <div style="margin-top: 32px;">
          <a href="${process.env.APP_URL}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Track Now
          </a>
        </div>

        <p style="margin-top: 32px; font-size: 12px; color: #6b7280;">
          <a href="${unsubscribeUrl}" style="color: #6b7280;">
            Unsubscribe from these reminders
          </a>
        </p>
      </div>
    `;

    // Send email
    await sgMail.send({
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL!,
        name: 'Metrics Tracker'
      },
      subject,
      html,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Reminder sent successfully' })
    };
  } catch (error) {
    console.error('Error sending reminder:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send reminder' })
    };
  }
};

export { handler }; 