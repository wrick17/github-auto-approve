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
  const autoApproveButton = document.createElement("button");
  autoApproveButton.id = "auto-approve";
  autoApproveButton.innerHTML = "Blindly Auto-Approve";
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

