const form = document.getElementById("registrationForm");
const phoneInput = document.getElementById("phone");
const emiratesIdInput = document.getElementById("emiratesId");
const birthDateInput = document.getElementById("birthDate");
const submitButton = document.querySelector(".submit-button");

const scriptURL =
    "https://script.google.com/macros/s/AKfycbzjyNbhCwbyN7XiMrR_BRdWz5SSsiuByjaaZdDOqP8GYPtmIBCvVt2mZKtD9jzKRf2A/exec";

/* رقم الهاتف: أرقام فقط وبحد أقصى 10 أرقام */
phoneInput.addEventListener("input", function () {
    this.value = this.value
        .replace(/[^0-9]/g, "")
        .slice(0, 10);
});

/* رقم الهوية: أرقام فقط وبحد أقصى 15 رقماً */
emiratesIdInput.addEventListener("input", function () {
    this.value = this.value
        .replace(/[^0-9]/g, "")
        .slice(0, 15);
});

/* إرسال البيانات إلى Google Sheet */
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "جاري إرسال الطلب...";

    const formData = new FormData();

    formData.append(
        "fullName",
        document.getElementById("fullName").value.trim()
    );

    formData.append(
        "phone",
        phoneInput.value.trim()
    );

    formData.append(
        "emiratesId",
        emiratesIdInput.value.trim()
    );

    formData.append(
        "birthDate",
        birthDateInput.value.trim()
    );

    formData.append(
        "emirate",
        document.getElementById("emirate").value
    );

    formData.append(
        "medicalGrade",
        document.getElementById("medicalGrade").value
    );

    formData.append(
        "qualification",
        document.getElementById("qualification").value
    );

    formData.append(
        "agreement",
        document.getElementById("agreement").checked
            ? "موافق"
            : "غير موافق"
    );

    try {
        await fetch(scriptURL, {
            method: "POST",
            body: formData,
            mode: "no-cors"
        });

        alert("تم إرسال الطلب بنجاح.");

        form.reset();

        if (birthDateInput._flatpickr) {
            birthDateInput._flatpickr.clear();
        }

    } catch (error) {
        console.error("حدث خطأ أثناء الإرسال:", error);

        alert(
            "تعذر إرسال الطلب، يرجى المحاولة مرة أخرى."
        );

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "إرسال الطلب";
    }
});