const validator = require("email-validator");
const sgMail = require('@sendgrid/mail');

const inviteModel = {
    sendMail: async function sendMail(res, content) {
        const toEmail = content.to;
        const fromUser = content.from;
        const title = content.title;

        //let db = await database.getDb("users");
        //const user = await db.collection.findOne({email: toEmail});
        //await db.client.close();

        //if (user) {
        //    return res.status(400).json({
        //        errors: {
        //            status: 400,
        //            message: "User already exists.",
        //        }
        //    });
        //};

        if (!validator.validate(toEmail)) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "Email has wrong format",
                }
            });
        }

        sgMail.setApiKey(
            process.env.SENDGRID_API_KEY
        );

        const message = {
            to: toEmail,
            from: 'viai20@student.bth.se',
            subject: 'Inbjudan till att redigera dokument',
            html: `
                    <h1>Inbjudan</h1>
                    <p>
                        Användare ${fromUser} har bjudit in dig 
                        till att redigera dokumentet '${title}'.
                    </p>
                    <p>
                        Om du redan har ett konto hos 
                        <a href='http://www.student.bth.se/~viai20/editor/'>Text Editor viai20</a> 
                        så har du nu tillgång till dokumentet.
                    </p>
                    <p>
                        Annars måste du 
                        <a href='http://www.student.bth.se/~viai20/editor/'>skapa</a> 
                        ett nytt konto med samma epostadress som detta mejl är skickat 
                        till för att få tillgång till dokumentet.
                    </p>
                    `
        };

        if (process.env.NODE_ENV !== 'test') {
            sgMail
                .send(message)
                .then(() => {
                    res.status(201).json({
                        data: {
                            message: "Email successfully sent."
                        }
                    });
                })
                .catch((error) => {
                    res.status(400).json({
                        errors: error
                    });
                });
        }
    }
};

module.exports = inviteModel;
