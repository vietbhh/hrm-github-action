<?php
$myTaskUrl = $_ENV["app.siteURL"] . '/checklist/' . $data['type'];
?>

<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;' align='center' bgcolor='#F2F2F3'>
    <tr>
        <td>
            <table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;max-width:700px;font: small/1.5 Arial,Helvetica,sans-serif;padding: 10px;' align='center' bgcolor='#ffffff'>
                <tr>
                    <td>
                        <h2>Off-track <?= $data['type'] ?></h2>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Hi <?= $data['receiver_name'] ?></span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Please be informed that some tasks in the <?= $data['type'] ?> checklist
                            <?= $data['receiver_type'] == 'hr_in_charge' ?  'of' . $data['assignee_name'] : '' ?>
                            are overdue.</span>
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
                        <span>View <a target='_blank' href='<?= $myTaskUrl ?>' style='color: #01CD89; text-decoration: none;'>Link</a> for more details on tasks' progress.</span>
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