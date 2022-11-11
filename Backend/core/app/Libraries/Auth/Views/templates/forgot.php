<body style="margin: 0; padding: 20px; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; --bg-opacity: 1; background-color: #eceff1;">
<div style="display: none;">A request to reset password was received from your <?= $app_name ?></div>
<div role="article" aria-roledescription="email" aria-label="Reset your Password" lang="en">
    <table style="font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; width: 100%;" width="100%"
           cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center"
                style="font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif;">
                <table class="sm-w-full"
                       style="font-family: 'Montserrat',Arial,sans-serif; width: 600px;    background-color: white;"
                       width="600"
                       cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                        <td align="center" class="sm-px-24" style="font-family: 'Montserrat',Arial,sans-serif;">
                            <table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%"
                                   cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td class="sm-px-24"
                                        style="--bg-opacity: 1; background-color: #ffffff; border-radius: 10px; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; font-size: 14px; line-height: 24px; padding: 48px; text-align: left; --text-opacity: 1; color: #626262; color: rgba(98, 98, 98, var(--text-opacity));"
                                        bgcolor="rgba(255, 255, 255, var(--bg-opacity))" align="left">
                                        <p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hey</p>
                                        <p style="font-weight: 700; font-size: 20px; margin-top: 0; --text-opacity: 1; color: #ff5850; color: rgba(255, 88, 80, var(--text-opacity));">
											<?= $name ?>!</p>
                                        <p style="margin: 0 0 24px;">
                                            A request to reset password was received from your
                                            <span style="font-weight: 600;"><?= $app_name ?></span> Account -
                                            <a href="<?= $email ?>" class="hover-underline"
                                               style="--text-opacity: 1; color: #7367f0; color: rgba(115, 103, 240, var(--text-opacity)); text-decoration: none;"><?= $email ?></a>
                                            from the IP - <span
                                                    style="font-weight: 600;"><?= $ip ?></span> .
                                        </p>
                                        <p style="margin: 0 0 24px;">Use this link to reset your password and login.</p>
                                        <a href="<?= getenv('app.siteURL') ?>/reset-password/<?= $hash ?>"
                                           style="display: block; font-size: 14px; line-height: 100%; margin-bottom: 24px; --text-opacity: 1; color: #7367f0; color: rgba(115, 103, 240, var(--text-opacity)); text-decoration: none;"><?= getenv('app.siteURL') ?>
                                            /reset-password/<?= $hash ?></a>
                                        <table style="font-family: 'Montserrat',Arial,sans-serif;" cellpadding="0"
                                               cellspacing="0" role="presentation">
                                            <tr>
                                                <td style="mso-padding-alt: 16px 24px; --bg-opacity: 1; background-color: #2ad25f; border-radius: 4px; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif;"
                                                    bgcolor="rgba(115, 103, 240, var(--bg-opacity))">
                                                    <a href="<?= getenv('app.siteURL') ?>/reset-password/<?= $hash ?>"
                                                       style="display: block; font-weight: 600; font-size: 14px; line-height: 100%; padding: 16px 24px; --text-opacity: 1; color: #ffffff; text-decoration: none;">Reset
                                                        Password &rarr;</a>
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="margin: 24px 0;">
                                            <span style="font-weight: 600;">Note:</span> This link is valid for 1 hour
                                            from the time it was
                                            sent to you and can be used to change your password only once.
                                        </p>
                                        <p style="margin: 0;">
                                            If you did not intend to deactivate your account or need our help keeping
                                            the account, please
                                            contact us at
                                            <a href="mailto:<?= $supportEmail ?>" class="hover-underline"
                                               style="--text-opacity: 1; color: #7367f0; color: rgba(115, 103, 240, var(--text-opacity)); text-decoration: none;"><?= $supportEmail ?></a>
                                        </p>
                                        <table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;"
                                               width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                            <tr>
                                                <td style="font-family: 'Montserrat',Arial,sans-serif; padding-top: 15px; padding-bottom: 15px;">
                                                    <div style="--bg-opacity: 1; background-color: #eceff1; background-color: rgba(236, 239, 241, var(--bg-opacity)); height: 1px; line-height: 1px;">
                                                        &zwnj;
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="margin: 0 0 16px;">
                                            Not sure why you received this email? Please
                                            <a href="mailto:<?= $supportEmail ?>" class="hover-underline"
                                               style="--text-opacity: 1; color: #7367f0; color: rgba(115, 103, 240, var(--text-opacity)); text-decoration: none;">let
                                                us know</a>.
                                        </p>
                                        <p style="margin: 0 0 16px;">Thanks, <br><?= $app_name ?></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
</body>