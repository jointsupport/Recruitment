const scriptURL =
    "https://script.google.com/macros/s/AKfycbzjyNbhCwbyN7XiMrR_BRdWz5SSsiuByjaaZdDOqP8GYPtmIBCvVt2mZKtD9jzKRf2A/exec";

const form = document.getElementById("registrationForm");
const submitButton = form.querySelector(".submit-button");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "جارٍ إرسال الطلب...";

    const applicationData = {
        fullName: document.getElementById("fullName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        emiratesId: document.getElementById("emiratesId").value.trim(),
        age: document.getElementById("age").value,
        emirate: document.getElementById("emirate").value,
        medicalGrade: document.getElementById("medicalGrade").value,
        qualification: document
            .getElementById("qualification")
            .value.trim(),
        desiredJob: document.getElementById("desiredJob").value
    };

    try {
        await fetch(scriptURL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(applicationData)
        });

        alert("تم إرسال الطلب بنجاح");

        form.reset();

    } catch (error) {
        console.error("حدث خطأ أثناء إرسال الطلب:", error);

        alert(
            "تعذر إرسال الطلب. يرجى التأكد من الاتصال بالإنترنت والمحاولة مرة أخرى."
        );

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});