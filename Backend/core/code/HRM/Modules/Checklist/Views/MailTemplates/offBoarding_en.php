<?php
$myTaskUrl = $_ENV["app.siteURL"] . '/checklist/my-tasks';
?>

<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;' align='center' bgcolor='#F2F2F3'>
    <tr>
        <td>
            <table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;max-width:700px;font: small/1.5 Arial,Helvetica,sans-serif;padding: 10px;' align='center' bgcolor='#ffffff'>
                <tr>
                    <td>
                        <h2>It is too soon to say goodbye…</h2>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Hi <?= $data['receiver_name'] ?></span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>
                            On behalf of Life Media, we would like to extend ot appreciation for the amazing work you have done since joining.
                            We are saddened to see you leave but believe this is a decision made with both you and Life Media's best interest in mind.
                            <br />
                            Here are a list of things we will need to do so we can help you close this chapter and prepare for new adventures
                        </span>
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
                    <td>
                        <br />
                        <br />
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>
                            Once again, thank you so much. We are lucky to have had you on our team and we hope that your last days with us will be memorable ones.
                            <br>
                            View <a target='_blank' href='<?= $myTaskUrl ?>' style='color: #01CD89; text-decoration: none;'>My Tasks</a> for more details.
                        </span>
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