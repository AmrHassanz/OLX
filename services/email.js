const nodeoutlook = require('nodejs-nodemailer-outlook');
function sendEmail(dest, message, attachment) {
    try {
        if (!attachment) {
            attachment = [];
        }
        nodeoutlook.sendEmail({
            auth: {
                user: process.env.senderEmail,
                pass: process.env.senderPassword
            },
            // auth email or sub email
            from: process.env.senderEmail,
            to: dest,
            subject: 'Dear User ...',
            html: message,
            text: 'This is text version!',
            attachments: attachment,
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i)
        }
        );
    } catch (error) {
        console.log(`catch error ${error}`);
    }
}

module.exports = sendEmail;