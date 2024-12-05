import { User } from '../types/user';

export const emailService = {
  sendWelcomeEmail: async (user: User) => {
    // In a real application, this would use an email service like SendGrid, AWS SES, etc.
    // For demo purposes, we'll simulate sending an email
    console.log(`Sending welcome email to ${user.email}`);
    
    const loginUrl = `${window.location.origin}/login`;
    const emailContent = `
      Hello ${user.firstName} ${user.lastName},

      Your account has been created successfully!
      
      You can log in using the following credentials:
      Email: ${user.email}
      Password: (the password you set during registration)

      Click here to log in: ${loginUrl}

      Best regards,
      Product Feedback Team
    `;

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Welcome email sent successfully'
    };
  }
};