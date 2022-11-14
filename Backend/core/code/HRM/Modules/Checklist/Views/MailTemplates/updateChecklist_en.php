<?php
$myTaskUrl = $_ENV["app.siteURL"] . '/checklist/my-tasks';
?>

<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;' align='center' bgcolor='#F2F2F3'>
    <tr>
        <td>
            <table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;max-width:700px;font: small/1.5 Arial,Helvetica,sans-serif;padding: 10px;' align='center' bgcolor='#ffffff'>
                <tr>
                    <td>
                        <h2>Checklist updated</h2>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Hi <?= $data['receiver_name'] ?></span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Please be informed that <?= $data['type'] ?> for <?= $data['employee_name'] ?> has been updated as follow:</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <br />
                        <br />
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Template changed from <?= $data['template_name_from'] ?> to <?= $data['template_name_to'] ?></span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <br />
                        <br />
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>View <a target='_blank' href='<?= $myTaskUrl ?>' style='color: #01CD89; text-decoration: none;'>Link</a> for more details.</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <br />
                        <br />
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Best regards,</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Friday OS team</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>