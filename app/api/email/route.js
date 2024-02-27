import nodemailer from 'nodemailer';

export async function GET(req) {
    const { name, email, id } = req.body;
  // Create a transporter using your Gmail account
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jamesdominguez2020@gmail.com', // replace with your actual email address
      pass: process.env.EMAILPASS
    }
  });

  const mailOptions = {
    from: 'jamesdominguez2020@gmail.com',
    to: email,
    subject: `Message from ${name}`,
    text: `Hello!,
We're excited to inform you that you've been added to Name Tag at this link http://localhost:3000/name-tags/group/${id}, Name Tag is a web app that helps you remember names by associating them with photos. Here's a brief summary:

Name Tag is a web app and server that uses photos with labels to aid name recall.
Upload photos, add names, and utilize facial recognition for automatic detection.
Collaborate and track names by sharing your Name Tag website with others.

Getting Started:

Visit our website and create an account.
Upload photos, add names, and let facial recognition do its magic.

Thank you for joining Name Tag! Enjoy the seamless name-recall experience.

Best,
The NameTag Team
`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return Response.json('Error: Could not send email')

    } else {
      console.log('Email sent: ' + info.response);
      return Response.json('Email sent')      
    }
  });
}
