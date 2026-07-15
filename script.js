document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registrationForm");
    const phoneInput = document.getElementById("phone");
    const emiratesIdInput = document.getElementById("emiratesId");
    const birthDateInput = document.getElementById("birthDate");
    const submitButton = document.querySelector(".submit-button");

    const workExperience =
        document.getElementById("workExperience");

    const experienceGroup =
        document.getElementById("experienceGroup");

    const experienceYears =
        document.getElementById("experienceYears");

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

    /* إظهار سنوات الخبرة عند اختيار نعم */
    function updateExperienceField() {
        if (workExperience.value === "نعم") {
            experienceGroup.style.display = "block";
            experienceYears.required = true;
        } else {
            experienceGroup.style.display = "none";
            experienceYears.required = false;
            experienceYears.value = "";
        }
    }

    workExperience.addEventListener(
        "change",
        updateExperienceField
    );

    updateExperienceField();

    /* إرسال البيانات إلى Google Sheet */
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "جاري إرسال الطلب...";

        /*
            يأخذ جميع حقول النموذج تلقائياً،
            بما فيها الحقول الجديدة.
        */
        const formData = new FormData(form);

        formData.set(
            "agreement",
            document.getElementById("agreement").checked
                ? "موافق"
                : "غير موافق"
        );

        if (workExperience.value !== "نعم") {
            formData.set("experienceYears", "");
        }

        try {
            await fetch(scriptURL, {
                method: "POST",
                body: formData,
                mode: "no-cors"
            });

            alert("تم إرسال الطلب بنجاح.");

            form.reset();

            if (
                birthDateInput &&
                birthDateInput._flatpickr
            ) {
                birthDateInput._flatpickr.clear();
            }

            updateExperienceField();

        } catch (error) {
            console.error(
                "حدث خطأ أثناء الإرسال:",
                error
            );

            alert(
                "تعذر إرسال الطلب، يرجى المحاولة مرة أخرى."
            );

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "إرسال الطلب";
        }
    });
});