<?php
$myTaskUrl = $_ENV["app.siteURL"] . '/checklist/my-tasks';

$title = "New tasks";
$pleaseContent = "Please be informed that " . count($data['list_task']) . " new task(s) have been assigned to you in order to assist the " . $data['type'] . " of " . $data['employee_name'];
$viewContent = "View <a target='_blank' href='" . $myTaskUrl . "' style='color: #01CD89; text-decoration: none;'>My Tasks</a> for more details.";
$questionContent = "";
if ($data['receiver_id'] === $data['employee_id']) {
    $title = "Start onboarding now!";
    $pleaseContent = "We are all really excited to welcome you to our team! Here are a list of things you will need to do for a smooth " . $data['type'] . " with us:";
    $viewContent  = "Log in with your employee account and view <a target='_blank' href='" . $myTaskUrl . "' style='color: #01CD89; text-decoration: none;'>My Tasks</a> for more details.";
    $questionContent = "If you have further questions, please don’t hesitate to let us know. We are looking forward to working with you and seeing you achieve great things!";
}
?>

<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;' align='center' bgcolor='#F2F2F3'>
    <tr>
        <td>
            <table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;max-width:700px;font: small/1.5 Arial,Helvetica,sans-serif;padding: 10px;' align='center' bgcolor='#ffffff'>
                <tr>
                    <td>
                        <h2><?= $title ?></h2>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Hi <?= $data['receiver_name'] ?></span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span><?= $pleaseContent ?></span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <br />
                        <br />
                        <br />
                    </td>
                </tr>
                <?php
                $i = 1;
                foreach ($data['list_task'] as $row) {
                ?>
                    <tr>
                        <td>
                            <p><?= $i . '. ' . $row['task_name'] ?></p>
                        </td>
                    </tr>
                <?php
                    $i++;
                }
                ?>
                <tr>
                    <br />
                    <br />
                </tr>
                <tr>
                    <td>
                        <span><?= $questionContent ?></span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span><?= $viewContent ?></span>
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