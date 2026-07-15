const phoneInput = document.getElementById("phone");
const emiratesIdInput = document.getElementById("emiratesId");
const birthDateInput = document.getElementById("birthDate");

/*
    رقم الهاتف:
    يقبل أرقاماً فقط وبحد أقصى 10 أرقام.
*/
phoneInput.addEventListener("input", function () {
    this.value = this.value
        .replace(/[^0-9]/g, "")
        .slice(0, 10);
});

/*
    رقم الهوية الإماراتية:
    يقبل أرقاماً فقط وبحد أقصى 15 رقماً.
*/
emiratesIdInput.addEventListener("input", function () {
    this.value = this.value
        .replace(/[^0-9]/g, "")
        .slice(0, 15);
});

/*
    تحويل التاريخ إلى صيغة:
    YYYY-MM-DD
*/
function formatDateForInput(date) {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/*
    تحديد تاريخ الميلاد حسب شرط العمر:
    الحد الأدنى 18 عاماً.
    الحد الأعلى 30 عاماً.
*/
function setBirthDateLimits() {
    const today = new Date();

    const minimumBirthDate = new Date(
        today.getFullYear() - 30,
        today.getMonth(),
        today.getDate()
    );

    const maximumBirthDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    );

    birthDateInput.min =
        formatDateForInput(minimumBirthDate);

    birthDateInput.max =
        formatDateForInput(maximumBirthDate);
}

setBirthDateLimits();