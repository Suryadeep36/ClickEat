require('dotenv').config();
const nodemailer = require('nodemailer');
const ejs = require('ejs');
module.exports = function sendMail(username, email){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_APP_USER,
            pass: process.env.GMAIL_APP_PASS
        },
    })
    ejs.renderFile(__dirname + "/../views/mail.ejs", {name: username}, function (err,data){
        if(err){
            console.log(err);
        }
        else{
            let message = {
                from: 'gohilsuryadeep3101@gmail.com',
                to: email,
                subject: `Hello ${username} 🚀🚀`,
                html: data
            }
            transporter.sendMail(message, (err, info) => {
                if(err){
                    console.log(err);
                }
                else{
                    console.log(info);
                }
            })
        }
    })
    
}
