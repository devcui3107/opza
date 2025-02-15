document.addEventListener("DOMContentLoaded", function () {
  // DEMO 1
  const btnModalWithTemplateId = document.querySelector("#btn-with-templateId");
  const modal1 = new Opza({
    templateId: "modal-1",
  });

  btnModalWithTemplateId.onclick = function () {
    modal1.open();
  };

  // DEMO 2
  const btnModalWithContent = document.querySelector("#btn-with-html");

  // String HTML
  const modal2 = new Opza({
    content: `<div>Nội dung content của modal<br>
  <a href='#!'>Link (nếu có)!</a>
  </div>`,
    cssContainer: ["modal__content", "class-N"],
  });

  btnModalWithContent.onclick = function () {
    modal2.open();
  };

  // DEMO 3
  const btnModalHasDestroyDOM = document.querySelector("#btn-has-destroy");

  // String HTML
  const modal3 = new Opza({
    content: `<div>Modal sẽ tự xoá khỏi DOM sau khi đóng
  </div>`,
    cssContainer: ["modal__content", "class-N"],
    destroy: true,
  });

  btnModalHasDestroyDOM.onclick = function () {
    modal3.open();
  };

  // DEMO 4
  const btnModalOptionClose = document.querySelector("#btn-trigger");

  // String HTML
  const modal4 = new Opza({
    content: `<div>Ví dụ ở modal này là chỉ cho phép đóng modal bằng cách bấm nút Escape hoặc bấm vào nút X. Vô hiệu hoá chức năng bấm vào vùng trống (overlay) để đóng modal
  </div>`,
    cssContainer: ["modal__content", "class-N"],
    closeTrigger: ["button", "Escape"], // Array
  });

  btnModalOptionClose.onclick = function () {
    modal4.open();
  };

  // DEMO 5
  const btnModalHasFooter = document.querySelector("#btn-has-footer");

  // String HTML
  const modal5 = new Opza({
    content: `<div>Nội dung của modal khi sử dụng tùy chọn footerContent sẽ được hiển thị trong phần footer của modal</div>
    <ul>
      <li>footerContent hỗ trợ nội dung dạng HTML, cho phép tùy chỉnh linh hoạt.</li>
      <li>Người dùng có thể tự thêm class tùy chỉnh và tự thiết lập CSS theo nhu cầu của mình.</li>
    </ul>
    <button id="updateContent">Đổi content</button>
    `,
    cssContainer: ["modal__content", "class-N"],
    footerContent: "<p>Đây là nội dung footer</p>",
  });

  btnModalHasFooter.onclick = function () {
    modal5.open();

    document.querySelector("#updateContent").onclick = () => {
      modal5.footerContentEdit("Đây là nội dung mới chỉnh sửa");
    };
  };

  // DEMO 6
  const btnModalHasButtons = document.querySelector("#btn-has-buttons");

  // String HTML
  const modal6 = new Opza({
    content: `<div>Nội dung của modal khi sử dụng tùy chọn footerContent sẽ được hiển thị trong phần footer của modal</div>
    <ul>
      <li>footerContent hỗ trợ nội dung dạng HTML, cho phép tùy chỉnh linh hoạt.</li>
      <li>Người dùng có thể tự thêm class tùy chỉnh và tự thiết lập CSS theo nhu cầu của mình.</li>
    </ul>
    <button id="updateBtn">Cập nhật button</button>
    `,
    cssContainer: ["modal__content", "class-N"],
    // footerContent: "<p>Đây là nội dung footer</p>",
    buttons: [
      {
        label: "Huỷ Bỏ",
        cssName: "modal__btn btn--outline",
        preAction: () => {
          // console.log("Kiểm tra trước khi Huỷ Bỏ");
          return true; // Nếu false, sẽ không chạy action
        },
        action: () => {
          console.log("Xử lý logic khi bấm vào Huỷ bỏ");
          modal6.close();
        },
      },
      {
        label: "Xác Nhận",
        cssName: "modal__btn btn--primary",
        preAction: () => {
          // console.log("Kiểm tra điều kiện trước khi xác nhận");
          return confirm("Bạn có chắc chắn muốn xác nhận không?");
        },
        action: () => {
          // console.log("Xử lý logic khi bấm vào Xác nhận");
          modal6.close(true);
        },
      },
    ],
  });

  btnModalHasButtons.onclick = function () {
    modal6.open();
    document.querySelector("#updateBtn").onclick = () => {
      modal6.buttonsEdit(
        0,
        "newLabel",
        "modal__btn btn--danger",
        () => {
          console.log(
            "PreAction đã được gọi trước khi thực hiện hành động chính"
          );
        }, // preAction (callback trước khi hành động chính)
        () => {
          console.log("Action đã được thực hiện!");
          modal6.close(); // Ví dụ là đóng modal sau khi thực hiện hành động chính
        }
      );
    };
  };

  // DEMO 7
  const btnModalActiveScroll = document.querySelector("#btn-active-scroll");

  // String HTML
  const modal7 = new Opza({
    content: `<div>Nội dung của trang bên dưới modal vẫn có thể cuộn được dùng scrollLock: false</div>
    `,
    cssContainer: ["modal__content", "class-N"],
    scrollLock: false,
  });

  btnModalActiveScroll.onclick = function () {
    modal7.open();
  };

  // DEMO BASIC
  const btnModalBasic = document.querySelector("#btn-basic");

  // String HTML
  const modal8 = new Opza({
    content: `<div>Nội dung của modal</div>
      `,
    cssContainer: ["modal__content", "class-N"],
  });

  btnModalBasic.onclick = function () {
    modal8.open();
  };

  // DEMO HAS BUTTON CLOSE
  const btnModalHasButtonClose = document.querySelector("#btn-has-closeButton");

  // String HTML
  const modal9 = new Opza({
    content: `<div>Modal chỉ có 1 nút button với chức năng duy nhất là đóng modal lại. Lúc này không cần dùng đến các phương thức đóng modal khác nên để  closeTrigger: []</div>
        `,
    cssContainer: ["modal__content", "class-N"],
    closeTrigger: [],
    buttons: [
      {
        label: "Đóng modal",
        cssName: "modal__btn btn--primary",
        action: () => {
          modal9.close();
        },
      },
    ],
  });

  btnModalHasButtonClose.onclick = function () {
    modal9.open();
  };

  // DEMO HAS 2 BUTTON CLOSE
  const btnModalHasButtonsClose = document.querySelector(
    "#btn-has-closeButtons"
  );

  // String HTML
  const modal10 = new Opza({
    content: `<div>Modal có 2 nút button xác nhận và huỷ bỏ một chức năng nào đó</div>
        `,
    cssContainer: ["modal__content", "class-N"],
    buttons: [
      {
        label: "Huỷ Bỏ",
        cssName: "modal__btn btn--outline",
        action: () => {
          modal10.close();
        },
      },
      {
        label: "Đồng Ý",
        cssName: "modal__btn btn--primary",
        action: () => {
          modal10.close();
        },
      },
    ],
  });

  btnModalHasButtonsClose.onclick = function () {
    modal10.open();
  };

  // DEMO CONTENT CUSTOM
  const btnModalContentCustom = document.querySelector(
    "#btn-with-content-custom"
  );

  // String HTML
  const modal11 = new Opza({
    templateId: "modal-2",
    cssContainer: ["modal__content", "class-N"],
    buttons: [
      {
        label: "Huỷ Bỏ",
        cssName: "modal__btn btn--outline",
        action: () => {
          modal11.close();
        },
      },
      {
        label: "Đồng Ý",
        cssName: "modal__btn btn--primary",
        action: () => {
          modal11.close();
        },
      },
    ],
  });

  btnModalContentCustom.onclick = function () {
    modal11.open();
  };

  // DEMO BIG CONTENT
  const btnModalBigContent = document.querySelector("#btn-with-big-content");

  // String HTML
  const modal12 = new Opza({
    templateId: "modal-3",
    cssContainer: ["modal__content", "class-N"],
    buttons: [
      {
        label: "Huỷ Bỏ",
        cssName: "modal__btn btn--outline",
        action: () => {
          modal12.close();
        },
      },
      {
        label: "Đồng Ý",
        cssName: "modal__btn btn--primary",
        action: () => {
          modal12.close();
        },
      },
    ],
  });

  btnModalBigContent.onclick = function () {
    modal12.open();
  };

  // DEMO BIG CONTENT
  const btnModalVideo = document.querySelector("#btn-video");

  // String HTML
  const modal13 = new Opza({
    content: `
    <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/RDfwGkasp58?si=IX2TTBONI2joAimS"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
    `,
    cssContainer: ["modal__content", "class-N"],
    widthModal: "800px",
  });

  btnModalVideo.onclick = function () {
    modal13.open();
  };
});
