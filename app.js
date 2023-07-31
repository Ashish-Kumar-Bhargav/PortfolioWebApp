const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = 8000;

mongoose.connect('mongodb+srv://ashishbhargav11072003:1kpAfWRwSZ72RjdK@bhargav.bdbchg6.mongodb.net/Portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

const Contact = mongoose.model('Contact', contactSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('All fields are required');
  }

  const newContact = new Contact({ name, email, message });
  newContact.save()
    .then(() => {
      console.log('Data inserted successfully!');

      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'thad.orn@ethereal.email',
          pass: 'vp5CW1PfhWJqDnTM1H'
        }
      });

      const mailOptions = {
        from: 'Ashish Bhargav <ashishbhargav11072003@gmail.com>',
        to: 'thad.orn@ethereal.email',
        subject: 'Contact Form Submission',
        html: `
          <h1></strong> ${name}</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error occurred while sending email:', error.message);
        } else {
          console.log('Email sent successfully!');
        }
      });

      res.redirect('/');
    })
    .catch((err) => {
      console.error('Error saving contact data to MongoDB:', err.message);
      res.status(500).send('Error saving contact data.');
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
