const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const officegen = require('officegen');
const fs = require('fs');
const path = require('path')
const nodemailer = require('nodemailer')

const router = express.Router();

router.post('/write', async (req, res) => {
    const docx = officegen('docx');

    const imagePath = path.join(__dirname, '../uploads', 'globeflight.png');

    // Create a paragraph for the image
    const imageParagraph = docx.createP();
    const imageOptions = {
        cx: 300, // width in EMU (English Metric Units)
        cy: 200, // height in EMU
        floating: {
            horizontalPosition: { relative: 'margin', align: 'center' },
            verticalPosition: { relative: 'line', offset: 0 },
            margin: { top: 0 }
        }
    };
    imageParagraph.addImage(imagePath, imageOptions);

    const content = `
Subject: Validate and Authorize Your Order
Dear [clientName],
Hello! I'm delighted to inform you that your order has been meticulously handled as per our recent conversation. All your specific requirements have been meticulously integrated into the final product, ensuring a precise fit. Your order consists of:            
Service: [order], Origin: [origin], Destination:[destination]
Weight: [weight], Description: [description], Dimension:
Amount: [Amount]
Air Freight:
Kindly peruse the above at your earliest. Approving by signing and sending it back will kickstart the process. If it's all in line with your wishes, please grant us the green light to proceed.
Please provide your signature and approval below:
Signature: ________________________
Date: ____________________________
Once we receive your approval, we will swiftly move forward to ensure a prompt delivery and impeccable service. Should you have any questions or require further clarification, please do not hesitate to contact us.
Thank you for choosing us for your needs. We look forward to your prompt response.
Best regards,
[YourName]
[YourTitle]
[YourContactInformation]
`;

    const contentLines = content.split('\n');

    contentLines.forEach(line => {
        const paragraph = docx.createP();
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('Subject:')) {
            paragraph.addText(trimmedLine, { bold: true, font_face: 'Arial', font_size: 16 });
        } else if (trimmedLine.startsWith('Dear')) {
            paragraph.addText(trimmedLine, { font_face: 'Arial', font_size: 14 });
        } else {
            paragraph.addText(trimmedLine, { font_face: 'Arial', font_size: 10 });
        }

    });
    const outputPath = path.join(__dirname, '../uploads', 'order_confirmation.docx');
    const outputStream = fs.createWriteStream(outputPath);

    docx.generate(outputStream);

    outputStream.on('close', () => {
        sendEmailWithAttachment(outputPath) // You'll need to implement this function
            .then(() => {
                res.send('Word document generated and sent successfully.');
            })
            .catch(err => {
                console.error('Error sending email:', err);
                res.status(500).send('Error sending email');
            });
    });

    docx.on('error', err => {
        console.error('Error generating Word document:', err);
        res.status(500).send('Error generating Word document');
    });
});

const sendEmailWithAttachment = async(filepath) =>{
    const attachment = {
        filename: 'order_confirmation.docx',
        path: filepath,
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
    const mailTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'rshadrackochieng@gmail.com',
          pass: 'dufhbqmcdepbhvdk',
        },
      });

      const mailDetails = {
        from: 'rshadrackochieng@gmail.com',
        to: 'rodgers.onyango22@gmail.com',
        subject: 'Order Confirmation and Approval Request',
        text: 'Order confirmation details',
        html: '<p>Order confirmation details</p>',
        attachments: [attachment],
      };
      try {
        await mailTransporter.sendMail(mailDetails);
        console.log('Email sent');
      } catch (err) {
        console.error('Email error:', err);
      }
}

module.exports = router;
