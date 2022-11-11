<?php namespace App\Libraries\Mail\Config;

use CodeIgniter\Config\BaseConfig;

class Mail extends BaseConfig
{
	// Session key in that contains the integer ID of a logged in user
	public $sessionUserId = "logged_in";

	// Whether to continue instead of throwing exceptions
	public $silent = true;

	public $default = '123123';

	public $subject = [
		'intervews' => 'Chào cô em Hii',
		'invitations' => 'Chào cô em {name} Hii',
	];

	public $content = [
		'interviews' => [
			'subject' => 'Thư mời phỏng vấn',
			'fields' => ['{time}', '{name}', '{job}', '{location}'],
			'content' => '{name} thân mến !
			Qua hồ sơ của {name}, chúng tôi nhận thấy bạn có những tiềm năng để trở thành một phần của công ty chúng tôi.
			Chúng tôi rất hy vọng có thể trao đổi thêm với bạn trong một buổi phỏng vấn ngắn tại {location}.
			Đây là một bước cần thiết trong quá trình tuyển dụng để chúng tôi có thể hiểu hơn về bạn cũng như được chia sẻ với bạn nhiều hơn về câu chuyện của chúng tôi.
Bạn vui lòng trả lời lại email này trước {time} để xác nhận khả năng tham gia buổi phỏng vấn. Nếu có bất kì điều gì bất tiện, bạn có thể liên hệ ngay qua email này .',
		],
		'invitations' => [
			'subject' => 'Thư mời làm việc',
			'fields' => ['{time}', '{name}', '{job}', '{location}'],
			'content' => 'Chào {name} thân mến ! 
			Đầu tiên, chúng tôi hết sức cám ơn bạn đã dành thời gian quan tâm và ứng tuyển cho vị trí {job} tại công ty của chúng tôi. Qua thời gian gặp gỡ trao đổi, chúng tôi hết sức ấn tượng với kinh nghiệm cũng như những gì bạn đã thể hiện. Chính vì vậy, chúng tôi trân trọng được mời bạn vào làm việc tại công ty của chúng tôi với vị trí {job}.
			Chúng tôi rất háo hức được có bạn trong đội ngũ của chúng tôi, và chúc bạn sẽ có những trải nghiệm tuyệt vời tại đây.\n
Xin chân thành cảm ơn.
Trân trọng .',
		],
		'invitation_active' => [
			'subject' => 'Kích hoạt tài khoản',
			'fields' => ['{name}', '{link}'],
			'content' => 'Xin chào {name} ! 
			Chúc mừng Bạn đã đăng ký tài khoản thành công.
			Để kích hoạt tài khoản, Bạn vui lòng truy cập vào link dưới đây để xác thực email này. {link}
Xin chân thành cảm ơn.
Trân trọng .'
		],
		'active_success' => [
			'subject' => 'Kích hoạt tài khoản thành công',
			'fields' => ['{name}','{username}', '{password}'],
			'content' => 'Xin chào {name} ! 
			Chúc mừng Bạn đã kích hoạt tài khoản ({username}) thành công.
			Mật khẩu của bạn ({password}) . Vui lòng đăng nhập và cập nhật mật khẩu mới!
Xin chân thành cảm ơn.
Trân trọng .'
		],
	];


}
