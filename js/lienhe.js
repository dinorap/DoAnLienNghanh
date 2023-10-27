window.onload = function () {
  khoiTao();

  // thêm tags (từ khóa) vào khung tìm kiếm
  var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
  for (var t of tags) addTags(t, "index.html?search=" + t);
};

function nguoidung() {
  //kiem tra ho ten
  var hoten = document.formlh.ht.value;
  //kiem tra so dien thoai
  var dienthoai = document.formlh.sdt.value;
  var email = document.formlh.em.value;
  var tieude = document.formlh.tde.value;
  var noidung = document.formlh.nd.value;
  //kiểm tra họ tên
  if (!checkName(hoten)) {
    addAlertBox("Họ tên không phù hợp.", "#f55", "#000", 3000);
    formlh.ht.focus();
    return false;
  } else if (!checkPhone(dienthoai)) {
    addAlertBox("Số điện thoại không phù hợp.", "#f55", "#000", 3000);
    return false;
  }
  sendEmailToAdmin(hoten, email, dienthoai, tieude, noidung);
  addAlertBox(
    "Gửi thành công. Chúng tôi chân thành cám ơn những góp ý từ bạn.",
    "#5f5",
    "#000",
    5000
  ); // cám ơn
  document.formlh.reset(); // làm sạch
  return false; // thoát
}
function sendEmailToAdmin(name, email, sdt, tieude, text) {
  emailjs.init("3pFiUGRsvVLOI7ifR");

  var templateParams = {
    from_name1: name,
    from_std: sdt,
    from_email: email,
    from_tieude: tieude,
    message: text, //
  };
  console.log(templateParams);

  // Sử dụng public key thay thế cho User ID
  emailjs
    .send("service_5v2d5e8", "template_rns1l99", templateParams) // Thay your_service_id và your_template_id bằng thông tin tương ứng của bạn
    .then(
      function (response) {
        console.log("Email đã được gửi thành công: ", response);
      },
      function (error) {
        console.log("Lỗi khi gửi email: ", error);
      }
    );
}
function checkName(str) {
  var special = "~!@#$%^&*()_+=-`./*{}[]|'<>?;\"";

  for (var i = 0; i < str.length; i++) {
    if (Number(str[i])) return false;
    for (var j = 0; j < special.length; j++)
      if (str[i] == special[j]) return false;
  }
  return true;
}

function checkPhone(phone) {
  for (var i = 0; i < phone.length; i++) {
    if (phone.charAt(i) < "0" || phone.charAt(i) > "9") return false;
  }
  return true;
}

function checkPhone2(phone) {
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (phone.match(phoneno)) return true;
  return false;
}
