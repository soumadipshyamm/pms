let jc;
$(document).on("submit", ".adminFrm", function (event) {
  event.preventDefault();
  let formClass = ($(this).data("class")!=undefined)?$(this).data("class"):"";
  if (commonFormChecking(true, formClass)) {
    let formdata = new FormData(this);
    $.ajax({
      type: "POST",
      url: baseUrl + $(this).data("action"), // where you wanna post
      data: formdata,
      processData: false,
      contentType: false,
      dataType: "JSON",
      beforeSend: function () {
        var rtl = false;
        var title = "Working!";
        var content = "Sit back, we are processing your request!";
        if (lang === "ar") {
          rtl = true;
          title = "عمل!";
          content = "استرخ ، نحن نعالج طلبك!";
        }
        jc = $.dialog({
          icon: "fa fa-spinner fa-spin",
          title: title,
          content: content,
          type: "dark",
          rtl: rtl,
          closeIcon: false,
        });
      },
      success: function (data) {
        jc.close();
        // console.log(data);
        var rtl = false;
        var warning = "Warning!";
        var success = "Success!";
        if (lang === "ar") {
          rtl = true;
          warning = "!تحذير";
          success = "!نجاح";
        }
        if (data.status) {
          $.alert({
            icon: "fa fa-check",
            title: success,
            content: data.message,
            rtl: rtl,
            type: "green",
            typeAnimated: true,
          });
          if (data.redirect != "") {
            setTimeout(function () {
              window.location.href = baseUrl + data.redirect;
            }, 2000);
          }
          // if($(this).data("class")==="requiredCheckModal"){

          // }
          switch (formClass) {
            case "requiredCheckModal":
              tempfileListing();
              break;
            case "requiredCheckModalFolder":
              if (data.data.parent!=0) {
                getSubfolderAndFiles(data.data.parent);
                uploadModal.hide();
              }
              break;
            case "requiredCheckModalfileUploadModal":
               setTimeout(function () {
                 location.reload();
               }, 2000);
              break;
            default:
              break;
          }
        } else {
          $.alert({
            icon: "fa fa-warning",
            title: warning,
            content: data.message,
            rtl: rtl,
            type: "orange",
            typeAnimated: true,
          });
        }
      },
    });
  }
});

function jqueryConfirmAlert(text, type, timer = 2000) {
  var rtl     =false;
  var warning = "Warning!"
  var success = "Success!";
  if (lang === "ar") {
    rtl = true;
    warning = "تحذير !";
    success = "نجاح !";
  }
  if (type === "warning") {
    $.alert({
      icon: "fa fa-warning",
      title: warning,
      rtl: rtl,
      content: text,
      type: "orange",
      typeAnimated: true,
     
    });
  } else if (type === "success") {
    $.alert({
      icon: "fa fa-check",
      title: success,
      rtl: rtl,
      content: text,
      type: "green",
      typeAnimated: true,
     
    });
  }
}

$(document).on("click", ".change-status", function () {
  var id = $(this).data("id");
  var keyId = $(this).data("key");
  var table = $(this).data("table");
  var status = $(this).data("status");
  var dataJSON = {
    id: id,
    keyId: keyId,
    table: table,
    status: status,
    _csrf: _token,
  };
  var rtl = false;
  var title = "Confirm!";
  var content = "Do you really want to do this ?";
  if (lang === "ar") {
    rtl = true;
    title = "يتأكد!";
    content = "هل تريد حقا أن تفعل هذا ?";
  }
  $.confirm({
    icon: "fa fa-spinner fa-spin",
    title: title,
    content: content,
    type: "orange",
    rtl:rtl,
    typeAnimated: true,
    buttons: {
      confirm: function () {
        if (id && table) {
          $.ajax({
            type: "POST",
            url: baseUrl + "generic-status-change-delete",
            data: dataJSON,
            dataType: "JSON",
            success: function (data) {
              var rtl = false;
              var warning = "Warning!";
              var success = "Success!";
              var deleteContent = "Data has been deleted !";
              if (lang === "ar") {
                rtl = true;
                warning = "!تحذير";
                success = "!نجاح";
                deleteContent = "تم حذف البيانات!";
              }
              if (data.status) {
                if (data.postStatus == "3") {
                  $.alert({
                    icon: "fa fa-check",
                    title: success,
                    rtl: rtl,
                    content: deleteContent,
                    type: "green",
                    typeAnimated: true,
                   
                  });
                  setTimeout(function () {
                    location.reload();
                  }, 1550);
                } else if (data.postStatus == "1") {
                  if (table==="roles"){
                      setTimeout(function () {
                        location.reload();
                      }, 1550);
                  }
                  $("#" + id).prop("checked", true);
                  $("#" + id).data("status", "0");
                  $.alert({
                    icon: "fa fa-check",
                    title: success,
                    rtl: rtl,
                    content: data.message,
                    type: "green",
                    typeAnimated: true,
                  });
                } else if (data.postStatus == "0") {
                  if (table === "roles") {
                    setTimeout(function () {
                      location.reload();
                    }, 1550);
                  }
                  $("#" + id).prop("checked", false);
                  $("#" + id).data("status", "1");
                  $.alert({
                    icon: "fa fa-check",
                    title: success,
                    content: data.message,
                    rtl: rtl,
                    type: "green",
                    typeAnimated: true,
                  });
                }
              }
            },
          });
        }
      },
      cancel: function () {
        var rtl = false;
        var title = "Canceled!";
        var content = "Process canceled!";
        if (lang === "ar") {
          rtl = true;
          title = "ألغيت!";
          content = "تم إلغاء العملية!";
        }
        $.alert({
          icon: "fa fa-times",
          title: title,
          content: content,
          type: "purple",
          rtl: rtl,
          typeAnimated: true,
        });
      },
    },
  });
});

/*change approval*/
$(document).on("click", ".change-approval", function () {
  var id = $(this).data("id");
  var keyId = $(this).data("key");
  var table = $(this).data("table");
  var approval = $(this).data("approval");
  var dataJSON = {
    id: id,
    keyId: keyId,
    table: table,
    approval: approval,
    _tdddzzzen: _tdddzzzen,
  };
  $.confirm({
    icon: "fa fa-spinner fa-spin",
    title: "Confirm!",
    content: "Do you really want to do this ?",
    type: "orange",
    typeAnimated: true,
    buttons: {
      confirm: function () {
        if (id && table) {
          $.ajax({
            type: "POST",
            url: baseUrl + "generic-approval-change",
            data: dataJSON,
            dataType: "JSON",
            success: function (data) {
              if (data.status) {
                if (data.postApproval == "1") {
                  $("#" + id).removeClass("badge-danger");
                  $("#" + id).addClass("badge-primary");
                  $("#" + id).html("Approved");
                  $("#" + id).data("approval", "0");
                  $.alert({
                    icon: "fa fa-check",
                    title: "Success!",
                    content: data.message,
                    type: "green",
                    typeAnimated: true,
                  });
                } else {
                  $("#" + id).removeClass("badge-primary");
                  $("#" + id).addClass("badge-danger");
                  $("#" + id).html("Unapproved");
                  $("#" + id).data("approval", "1");

                  $.alert({
                    icon: "fa fa-check",
                    title: "Success!",
                    content: data.message,
                    type: "green",
                    typeAnimated: true,
                  });
                }
              }
            },
          });
        }
      },
      cancel: function () {
        $.alert({
          icon: "fa fa-times",
          title: "Canceled!",
          content: "Process canceled",
          type: "purple",
          typeAnimated: true,
        });
      },
    },
  });
});

/*change approval*/

function commonFormChecking(flag, cls = "", msgbox = "") {
  if (cls == "") {
    cls = "requiredCheck";
  }
  var isMandatory = " is mandatory !"
  var containsOnlyBlankSpace = " contains only blankspace !";
  var invalidEmailAddress = " Enter valid Email address !";
  var invalidPhoneNumber = " Enter 10 digit phone number !";
  var invalidPostCode    = " Enter 6 digit Postcode !"
  if (lang === "ar") {
    isMandatory = " إلزامي ! ";
    containsOnlyBlankSpace = "يحتوي على مساحة فارغة فقط! ";
    invalidEmailAddress = "أدخل عنوان بريد إلكتروني صالح ! ";
    invalidPhoneNumber = "أدخل رقم هاتف مكون من 10 أرقام! ";
    invalidPostCode = "دخل الرمز البريدي المكون من 6 أرقام! ";
  }
  $("." + cls).each(function () {
    if ($(this).hasClass("ckeditor")) {
      if (CKEDITOR.instances[$(this).attr("id")].getData() == "") {
        if (msgbox != "") {
          $("." + msgbox).text(
            $(this).attr("data-check") + isMandatory
          );
        } else {
          jqueryConfirmAlert(
            $(this).attr("data-check") + isMandatory,
            "warning"
          );
        }
        flag = false;
        return false;
      } else {
        if (
          CKEDITOR.instances[$(this).attr("id")]
            .getData()
            .replace(/&nbsp;|\s/g, "") === "<p></p>"
        ) {
          if (msgbox != "") {
            $("." + msgbox).text(
              $(this).attr("data-check") + containsOnlyBlankSpace
            );
          } else {
            jqueryConfirmAlert(
              $(this).attr("data-check") + containsOnlyBlankSpace,
              "warning"
            );
          }
          flag = false;
          return false;
        }
      }
    } else {
      if ($.trim($(this).val()) == "") {
        if (msgbox != "") {
          $("." + msgbox).text(
            $(this).attr("data-check") + isMandatory
          );
        } else {
          jqueryConfirmAlert(
            $(this).attr("data-check") + isMandatory,
            "warning"
          );
        }
        flag = false;
        return false;
      } else {
        if ($(this).attr("data-check") == "Email") {
          var reg =
            /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
          if (reg.test($.trim($(this).val())) == false) {
            if (msgbox != "") {
              $("." + msgbox).text(invalidEmailAddress);
            } else {
              jqueryConfirmAlert(invalidEmailAddress, "warning");
            }
            flag = false;
            return false;
          }
        }
        if ($(this).attr("data-check") == "Phone") {
          if ($.trim($(this).val()).length != 10) {
            var txt = invalidPhoneNumber;
            if (msgbox != "") {
              $("." + msgbox).text(invalidPhoneNumber);
            } else {
              jqueryConfirmAlert(invalidPhoneNumber, "warning");
            }
            flag = false;
            return false;
          }
        }
        if ($(this).attr("data-check") == "Zip") {
          if ($.trim($(this).val()).length != 6) {
            if (msgbox != "") {
              $("." + msgbox).text(invalidPostCode);
            } else {
              jqueryConfirmAlert(invalidPostCode, "warning");
            }
            flag = false;
            return false;
          }
        }
      }
    }
  });
  return flag;
}
function isNumber(evt) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    if (charCode == 43 || charCode == 45 || charCode == 4) {
      return true;
    }
    return false;
  }
  return true;
}
function isNumberNotZero(evt, val) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (val == "") {
    if (charCode == 48) {
      return false;
    }
  }
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    if (charCode == 43 || charCode == 45 || charCode == 4) {
      return true;
    }
    return false;
  }
  return true;
}
function isChar(evt) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if ((charCode >= 65 && charCode <= 122) || charCode == 32 || charCode == 0) {
    return true;
  }
  return false;
}
$(document).on("keyup", ".restrictSpecial", function () {
  var yourInput = $(this).val();
  var re = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
  var isSplChar = re.test(yourInput);
  if (isSplChar) {
    var no_spl_char = yourInput.replace(
      /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
      ""
    );
    $(this).val(no_spl_char);
  }
});
$(".allowNumberDot").keyup(function () {
  var $this = $(this);
  $this.val($this.val().replace(/[^\d.]/g, ""));
});
/* allow only letter & space */
$(".allowOnlyLetter").keypress(function (event) {
  var inputValue = event.charCode;
  if (
    !(inputValue >= 65 && inputValue <= 122) &&
    inputValue != 0 &&
    inputValue != 49
  ) {
    event.preventDefault();
  }
});
$(".allowOnlyLetterSpace").keypress(function (event) {
  var inputValue = event.charCode;
  if (
    !(inputValue >= 65 && inputValue <= 122) &&
    inputValue != 32 &&
    inputValue != 0
  ) {
    event.preventDefault();
  }
});
$(".checkDecimal").keypress(function (event) {
  var $this = $(this);
  if (
    (event.which != 46 || $this.val().indexOf(".") != -1) &&
    (event.which < 48 || event.which > 57) &&
    event.which != 0 &&
    event.which != 8
  ) {
    event.preventDefault();
  }
  var text = $(this).val();
  if (event.which == 46 && text.indexOf(".") == -1) {
    setTimeout(function () {
      if ($this.val().substring($this.val().indexOf(".")).length > 3) {
        $this.val($this.val().substring(0, $this.val().indexOf(".") + 3));
      }
    }, 1);
  }
  if (
    text.indexOf(".") != -1 &&
    text.substring(text.indexOf(".")).length > 2 &&
    event.which != 0 &&
    event.which != 8 &&
    $(this)[0].selectionStart >= text.length - 2
  ) {
    event.preventDefault();
  }
});
function ucFirst(str) {
  return (str + "").replace(/^([a-z])|\s+([a-z])/g, function (letter) {
    return letter.toUpperCase();
  });
}
function ucWords(str) {
  return (str + "").replace(
    /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
    function (letter) {
      return letter.toUpperCase();
    }
  );
}
function getExtension(path) {
  var basename = path.split(/[\\/]/).pop(), // extract file name from full path ...
    // (supports `\\` and `/` separators)
    pos = basename.lastIndexOf("."); // get last position of `.`
  if (basename === "" || pos < 1){
    // if file name is empty or ...
    return ""; //  `.` not found (-1) or comes first (0)
  }
  return basename.slice(pos + 1); // extract extension ignoring `.`
}
