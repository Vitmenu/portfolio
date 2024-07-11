import env from "../../../config/env";

const templateFormer = (sender, senderCompany, message) => ({
    Source: 'Vitmenu Portfolio <no-reply@auth.vitmenu.com>',
    Destination: {
        ToAddresses: [env.emailaddress],
    },
    Message: {
        Subject: {
            Data: `new Messsage from ${senderCompany}`,
        },
        Body: {
            Html: {
                Data: `
                    <html>
                        <head>
                        </head>
                        <body>
                            <div style="width: 24rem; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                <h1>Vitmenu Portfolio</h1>
                                <br />
                                <div style="width: 100%; display: flex; justify-content: center">
                                    <h2>User Company: ${senderCompany}</h2>
                                </div>
                                <br />
                                <div style="width: 100%; display: flex; justify-content: center">
                                    <h2>User ID: ${sender}</h2>
                                </div>
                                <br />
                                <article style="white-space: normal; overflow-wrap: break-word; text-wrap: wrap; width: 24rem; height: 48rem; margin: 2rem 2rem;">
                                    ${message}
                                </article>
                            </div>
                        </body>
                    </html>
                `
            }
        },
    },
});

export default templateFormer;