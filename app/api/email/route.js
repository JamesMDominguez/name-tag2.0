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
    subject: `Nametag Invitation`,
    text: `<!DOCTYPE html>
    <html>
    <head>
    <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      text-align: center;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      margin-top: 50px;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    h3 {
      color: #333333;
    }
    
    </style>
    </head>
    <body>
    <div class="container">
        <h3>Hello, this email is to inform you that you have been added to a Nametag, Click here to view: <a href="${process.env.NEXT_PUBLIC_HOME}/${id}">Link</a></h3>
    </div>
    </body>
    </html>
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
