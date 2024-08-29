const svg = `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
</svg>`;

const approve = () => {
  const reviewButton = document.querySelector(".js-reviews-toggle");
  reviewButton.click();
  setTimeout(() => {
    const approveRadio = document.getElementById(
      "pull_request_review[event]_approve"
    );
    console.log(approveRadio);
    approveRadio.checked = true;

    const submitForm = document.getElementById("pull_requests_submit_review");
    submitForm.submit();
  }, 100);
};

const checkForReviewButton = (cb) => {
  const reviewButton = document.querySelector(".js-reviews-toggle");
  if (reviewButton) {
    cb();
  } else {
    setTimeout(function () {
      checkForReviewButton(cb);
    }, 100);
  }
};

const addAutoApproveButton = () => {
  const user = document.querySelector('meta[name="user-login"]').content;
  const author = document.querySelector(".author").innerText;

  const isOpen = !!document.querySelector(".State.State--open");

  if (user === author || !isOpen) {
    return;
  }

  const autoApproveButton = document.createElement("button");
  autoApproveButton.id = "auto-approve";
  autoApproveButton.innerHTML = `${svg} Blindly Auto-Approve`;
  autoApproveButton.classList = "auto-approve";
  document.querySelector(".gh-header-meta").appendChild(autoApproveButton);

  autoApproveButton.addEventListener("click", (e) => {
    const filesButton = document.querySelector(
      ".octicon.octicon-file-diff"
    ).parentNode;
    filesButton.click();
    checkForReviewButton(() => {
      approve();
    });
  });
};

const checkForProgress = (cb) => {
  const progressBar = document.querySelector(".turbo-progress-bar");
  if (progressBar) {
    setTimeout(() => {
      checkForProgress(cb);
    }, 10);
  } else {
    cb();
  }
};

let previousUrl = "";
const observer = new MutationObserver(function (mutations) {
  if (location.href !== previousUrl) {
    previousUrl = location.href;
    checkForProgress(() => {
      addAutoApproveButton();
    });
  }
});
const config = { subtree: true, childList: true };

observer.observe(document, config);

