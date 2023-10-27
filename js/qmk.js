function addqmk() {
  document.write(`
  <span class="close" onclick="window.location.href='index.html'">&times;</span>

  <div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4 class="text-center">Đặt lại mật khẩu</h4>
          </div>
          <div class="card-body">
            <form>
              <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" name="email" id="email" class="form-control" required />
              </div>
              <button type="button" name="submit" class="btn btn-primary btn-block" onclick="validateEmail()">
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>`);
}
var listUser = getListUser();

function validateEmail() {
  const email = document.getElementById("email").value;
  var emailExists = false;

  for (var u of listUser) {
    if (u.email === email) {
      emailExists = true;
      const newPassword = generateRandomPassword(8);

      // Mã hóa mật khẩu mới bằng sha256
      sha256(newPassword).then(function (hashedPassword) {
        var temp = copyObject(u);
        u.pass = hashedPassword; // Lưu mật khẩu đã mã hóa vào đối tượng người dùng
        // Cập nhật danh sách người dùng trong cơ sở dữ liệu (hoặc local storage)
        updateListUser(temp, u);

        resetPassword(email, newPassword); // Đặt lại mật khẩu cho người dùng
      });

      break;
    }
  }

  if (!emailExists) {
    // If email does not exist, display an error message
    Swal.fire({
      icon: "error",
      title: "Email không tồn tại",
      text: "Vui lòng nhập một địa chỉ email tồn tại.",
      confirmButtonText: "OK",
    });
  }
}

function resetPassword(email, newPassword) {
  sendEmailNotification(email, newPassword);

  // Hiển thị thông báo cho người dùng sử dụng SweetAlert2
  Swal.fire({
    icon: "success",
    title: "Mật khẩu mới đã được gửi",
    text: `Mật khẩu mới đã được gửi đến ${email}. Vui lòng kiểm tra email của bạn.`,
    confirmButtonText: "OK",
  }).then((result) => {
    if (result.isConfirmed) {
      // Chuyển hướng trang web về index.html hoặc trang khác
      window.location.href = "index.html";
      sendEmailNotification(email, newPassword);
    }
  });
}

function sendEmailNotification(email, newPassword) {
  emailjs.init("T0kVSb9470O5Pa9IH");
  var templateParams = {
    to_email: email, // Địa chỉ email người nhận
    to_name: email,
    Text: newPassword, //
  };

  // Sử dụng public key thay thế cho User ID
  emailjs
    .send("service_947rffi", "template_f4prki8", templateParams) // Thay your_service_id và your_template_id bằng thông tin tương ứng của bạn
    .then(
      function (response) {
        console.log("Email đã được gửi thành công: ", response);
      },
      function (error) {
        console.log("Lỗi khi gửi email: ", error);
      }
    );
}

// Hàm tạo mật khẩu ngẫu nhiên
function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
}

// // Hàm kiểm tra địa chỉ email hợp lệ (đơn giản)
// function isValidEmail(email) {
//   const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//   return emailPattern.test(email);
// }
