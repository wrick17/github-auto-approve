const check = `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
</svg>`;
const checkSvg = '';

const container = document.createElement("div");
container.id = "auto-container";
container.innerHTML = `<button class="auto-trigger">${check}</button>`;
document.body.appendChild(container);

const checkForNewExp = () => {
	const isNewExp = document.querySelector(
		`[class*="PullRequestHeaderSummary-"]`,
	);
	return isNewExp;
};

const legacyApprove = () => {
	const reviewButton = document.querySelector(".js-reviews-toggle");
	reviewButton.click();
	setTimeout(() => {
		const approveRadio = document.getElementById(
			"pull_request_review[event]_approve",
		);
		console.log(approveRadio);
		approveRadio.checked = true;

		const submitForm = document.getElementById("pull_requests_submit_review");
		submitForm.submit();
	}, 100);
};

const legacyCheckForReviewButton = (cb) => {
	const reviewButton = document.querySelector(".js-reviews-toggle");
	if (reviewButton) {
		cb();
	} else {
		setTimeout(() => {
			legacyCheckForReviewButton(cb);
		}, 100);
	}
};

const newCheckForReviewButton = (cb) => {
	const reviewButton = document.querySelector(
		'button[class*="ReviewMenuButton"]',
	);
	if (reviewButton) {
		cb();
	} else {
		setTimeout(() => {
			newCheckForReviewButton(cb);
		}, 100);
	}
};

const newApprove = () => {
	const reviewButton = document.querySelector(
		'button[class*="ReviewMenuButton"]',
	);
	reviewButton.click();
	setTimeout(() => {
		document
			.querySelector('input[value="approve"]')
			.parentNode.nextSibling.firstElementChild.click();

			try {
				document.querySelector('[class*="SubmitReviewButton"]').click();
			} catch (_e) {
				document
					.querySelector('[class*="prc-Dialog-Footer"]')
					.querySelector("[data-loading-wrapper] button")
					.click();
			}
	}, 100);
};

const autoApprove = () => {
	const isNew = checkForNewExp();
	if (isNew) {
		newCheckForReviewButton(newApprove);
	} else {
		legacyCheckForReviewButton(legacyApprove);
	}
};

const addApproveButton = () => {
	const autoApproveButton = document.createElement("button");
	autoApproveButton.id = "auto-approve";
	autoApproveButton.innerHTML = `${checkSvg} Auto Approve`;
	autoApproveButton.classList = "auto-button";
	container.appendChild(autoApproveButton);

	autoApproveButton.addEventListener("click", () => {
		const locationArr = location.pathname.split("/");
		if (locationArr[locationArr.length - 1] !== "files") {
			const filesButton = document.querySelector(
				".octicon.octicon-file-diff",
			).parentNode;
			filesButton.click();
			localStorage.setItem("autoApprove", true);
		} else {
			autoApprove();
		}
	});
};

const legacyApproveFlow = () => {
	const user = document.querySelector('meta[name="user-login"]').content;
	const author = document.querySelector(".author")?.innerText;
	const isOpen = !!document.querySelector(".State.State--open");

	if (user === author || !isOpen) {
		return;
	}

	addApproveButton();
};

const newApproveFlow = () => {
	const user = document.querySelector('meta[name="user-login"]').content;
	const author = document.querySelector(
		'[class*="PullRequestHeaderSummary-"] [aria-keyshortcuts="Alt+ArrowUp"]',
	)?.innerText;
	const isOpen =
		document.querySelector('[class*="StateLabel"]')?.innerText === "Open";

	if (user === author || !isOpen) {
		return;
	}

	addApproveButton();
};

const addAutoApproveButton = () => {
	const isNewExp = checkForNewExp();

	const buttonAlreadyThere = !!document.getElementById("auto-approve");
	if (buttonAlreadyThere) {
		if (localStorage.autoApprove) {
			localStorage.removeItem("autoApprove");
			autoApprove();
		}
		return;
	}

	if (isNewExp) {
		newApproveFlow();
	} else {
		legacyApproveFlow();
	}
};

const searchForMergeButton = (cb) => {
	const mergeButton = document.querySelector(
		'[class*="prc-Button-ButtonBase"]',
	);
	if (mergeButton) {
		cb();
	} else {
		setTimeout(() => {
			searchForMergeButton(cb);
		}, 100);
	}
};

const autoMerge = () => {
	const mergeButton = document.querySelector(
		'[class*="prc-Button-ButtonBase"][data-variant="primary"]',
	);
	mergeButton.click();
	setTimeout(() => {
		const finalMerge = document.querySelector(
			'[class*="prc-Button-ButtonBase"][data-variant="primary"]',
		);
		finalMerge.click();
	}, 100);
};

const addMergeButton = () => {
	searchForMergeButton(() => {
		const mergeButtonActive = !!document.querySelector(
			'[class*="prc-Button-ButtonBase"][data-variant="primary"]',
		);
		const locationArr = location.pathname.split("/");

		if (locationArr[locationArr.length - 1] !== "files" && mergeButtonActive) {
			const autoMergeButton = document.createElement("button");
			autoMergeButton.id = "auto-merge";
			autoMergeButton.innerHTML = `${checkSvg} Auto Merge`;
			autoMergeButton.classList = "auto-button merge";
			container.appendChild(autoMergeButton);

			autoMergeButton.addEventListener("click", () => {
				autoMerge();
			});
		}
	});
};

const addApproveAndMergeButton = () => {
	searchForMergeButton(() => {
		const buttonAlreadyThere = !!document.getElementById("auto-approve-merge");
		if (buttonAlreadyThere) {
			return;
		}
		const autoApproveAndMergeButton = document.createElement("button");
		autoApproveAndMergeButton.id = "auto-approve-merge";
		autoApproveAndMergeButton.innerHTML = `${checkSvg} Approve + Merge`;
		autoApproveAndMergeButton.classList = "auto-button approve-merge";
		container.appendChild(autoApproveAndMergeButton);

		autoApproveAndMergeButton.addEventListener("click", () => {
			const locationArr = location.pathname.split("/");
			const isFilePage = locationArr[locationArr.length - 1] === "files";

			if (isFilePage) {
				localStorage.setItem("autoMerge", true);
				autoApprove();
			} else {
				localStorage.setItem("autoApprove", true);
				localStorage.setItem("autoMerge", true);
				const filesButton = document.querySelector(
					".octicon.octicon-file-diff",
				).parentNode;
				filesButton.click();
			}
		});
	});
};

const addAutoMergeButton = () => {
	searchForMergeButton(() => {
		const locationArr = location.pathname.split("/");
		const isFilePage = locationArr[locationArr.length - 1] === "files";
		if (!isFilePage && localStorage.autoMerge) {
			localStorage.removeItem("autoMerge");
			autoMerge();
		}
		const buttonAlreadyThere = !!document.getElementById("auto-merge");
		if (buttonAlreadyThere) {
			return;
		}

		addMergeButton();
	});
};

const addAutoApproveAndMergeButton = () => {
	const buttonAlreadyThere = !!document.getElementById("auto-approve-merge");
	if (buttonAlreadyThere) {
		return;
	}

	addApproveAndMergeButton();
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
const observer = new MutationObserver(() => {
	if (location.href !== previousUrl) {
		previousUrl = location.href;
		checkForProgress(() => {
			addAutoApproveButton();
			addAutoMergeButton();
			addAutoApproveAndMergeButton();
		});
	}
});
const config = { subtree: true, childList: true };

observer.observe(document, config);

const checkForSSO = () => {
	const pathArr = location.pathname.split("/");
	const isSSO = pathArr[pathArr.length - 1] === "sso";
	if (!isSSO) {
		return;
	}
	const button = document.querySelector('button[type="submit"]');
	if (button) {
		button.click();
	}
	else {
		setTimeout(() => {
			checkForSSO();
		}, 100);
	}
};

checkForSSO();
