document.getElementById('download-btn').addEventListener('click', function () {
    openDialog();
});

function openDialog() {
    const dialog = document.getElementById('dialog');
    dialog.classList.remove('dialog-hidden');
    document.getElementById('overlay').classList.remove('hidden');
}

function closeDialog() {
    const dialog = document.getElementById('dialog');
    dialog.classList.add('dialog-hidden');
    document.getElementById('overlay').classList.add('hidden');
}

function downloadFile(fileName) {
    const link = document.createElement('a');
    link.href = fileName; // Ensure the file is in the same directory or provide a full path
    link.download = "Resume_Sukhdev_Kushwaha_Manager_Architect.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    closeDialog(); // Close the dialog after download
}


function calculateScrollPercentage(event) {
    const divElement = event.target;
    const scrollTop = divElement.scrollTop;
    const scrollHeight = divElement.scrollHeight;
    const clientHeight = divElement.clientHeight;

    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    document.querySelector(".progress-bar").style.width = scrollPercentage.toFixed(2) + "%";
}

document.querySelector("#page-container").addEventListener("scroll", calculateScrollPercentage);


function addDynamicCSS(type) {
    // Get the element you want to apply CSS to
    var overlayDiv = document.getElementById("overlay");

    var styles = `<style type="text/css">`;

    if (type == "Desktop") {
        styles += `
        .download-container:hover .download-icon {
            animation: flipHorizontal 1s forwards;
        }`;
    }else{
        styles += `
        .option-button {
            width: 161px;
        }
        .button-text{
            opacity:1;
        }`;
    }
    styles += `</style > `
    overlayDiv.insertAdjacentHTML("afterend", styles)
}

function detectDeviceType() {
    const userAgent = navigator.userAgent;

    // Regular expression to check for mobile devices
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    // Check if the user agent matches the mobile regex
    if (mobileRegex.test(userAgent)) {
        addDynamicCSS('Mobile');
    } else {
        addDynamicCSS('Desktop');
    }
}

detectDeviceType();